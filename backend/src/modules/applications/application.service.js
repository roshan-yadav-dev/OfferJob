const fs = require('fs/promises');
const path = require('path');

const Application = require('./application.model');
const Job = require('../jobs/job.model');
const logger = require('../../config/logger');
const { extractResumeText } = require('../../services/resumeTextExtractor');
const { matchResumeToJob } = require('../../services/aiMatchingService');

// Note: Resume URLs are now Cloudinary URLs (secure_url from Cloudinary API)
// No longer using local file storage

function validateResumeUrl(resumeReference) {
    if (!resumeReference || typeof resumeReference !== 'string') {
        return null;
    }

    const trimmedReference = resumeReference.trim();

    if (!trimmedReference) {
        return null;
    }

    // Return the trimmed URL - it should be a Cloudinary secure URL
    try {
        // Basic URL validation
        new URL(trimmedReference);
        return trimmedReference;
    } catch (error) {
        logger.warn('Invalid resume URL format', {
            resume_reference: resumeReference,
        });
        return null;
    }
}

async function extractResumeTextFromReference(resumeReference, context) {
    const resumeUrl = validateResumeUrl(resumeReference);

    if (!resumeUrl) {
        logger.warn('Unable to validate resume URL for AI matching', {
            ...context,
            resume_reference: resumeReference,
        });

        return null;
    }

    try {
        const resumeText = await extractResumeText(resumeUrl);
        const cleanResumeText = resumeText?.trim();

        if (!cleanResumeText) {
            logger.warn('Resume text extraction returned empty content', {
                ...context,
                resume_url: resumeUrl,
            });

            return null;
        }

        logger.info('Resume text extracted for AI matching', {
            ...context,
            resume_url: resumeUrl,
            resume_text_length: cleanResumeText.length,
        });

        return cleanResumeText;
    } catch (error) {
        logger.error('Resume text extraction failed', {
            ...context,
            resume_url: resumeUrl,
            error_name: error.name,
            error_message: error.message,
        });

        return null;
    }
}

const createApplication = async (applicationData, options = {}) => {
    const { skipAiMatching = false } = options;
    const resumeReference =
        applicationData.resumeUrl || applicationData.resumePath;

    const existingApplication = await Application.findOne({
        student: applicationData.student,
        job: applicationData.job,
    });

    if (existingApplication) {
        const error = new Error('Already applied to this job');
        error.statusCode = 400;
        throw error;
    }

    const application = await Application.create({
        ...applicationData,
        aiScore: null,
    });

    const applicationContext = {
        application_id: application._id.toString(),
        student_id: applicationData.student.toString(),
        job_id: applicationData.job.toString(),
    };

    logger.info('Application created', {
        ...applicationContext,
        skip_ai_matching: skipAiMatching,
    });

    if (skipAiMatching) {
        logger.info('AI matching skipped for application', {
            ...applicationContext,
        });

        return application;
    }

    try {
        const [job, resumeText] = await Promise.all([
            Job.findById(applicationData.job).select('description').lean(),
            extractResumeTextFromReference(resumeReference, {
                ...applicationContext,
            }),
        ]);

        if (!job || !job.description?.trim()) {
            logger.warn('Job description unavailable for AI matching', {
                ...applicationContext,
            });

            return application;
        }

        if (!resumeText) {
            logger.warn('Resume text unavailable for AI matching', {
                ...applicationContext,
            });

            return application;
        }

        const similarityScore = await matchResumeToJob({
            resumeText,
            jobDescription: job.description,
            userId: applicationData.student.toString(),
            jobId: applicationData.job.toString(),
        });

        application.aiScore = similarityScore;
        await application.save();

        logger.info('Application AI score stored', {
            ...applicationContext,
            similarity_score: similarityScore,
        });
    } catch (error) {
        logger.error('AI matching failed; application remains without score', {
            ...applicationContext,
            error_name: error.name,
            error_message: error.message,
            error_status_code: error.statusCode ?? null,
        });
    }

    return application;
};

const getApplicationsByJob = async (jobId) => {
    return Application.find({
        job: jobId,
    })
        .populate('student', 'name email')
        .populate('job', 'title company');
};

const getStudentApplications = async (studentId) => {
    return Application.find({
        student: studentId,
    }).populate('job', 'title company location');
};

const getApplicationById = async (applicationId) => {
    return Application.findById(applicationId)
        .populate('student', 'name email')
        .populate('job', 'title company description');
};

const recomputeApplicationScore = async (applicationId) => {
    const application = await Application.findById(applicationId);

    if (!application) {
        const error = new Error('Application not found');
        error.statusCode = 404;
        throw error;
    }

    try {
        const resumeReference = application.resumeUrl || application.resumePath;

        const [job, resumeText] = await Promise.all([
            Job.findById(application.job).select('description').lean(),
            extractResumeTextFromReference(resumeReference, {
                application_id: applicationId,
                student_id: application.student?.toString(),
                job_id: application.job?.toString(),
            }),
        ]);

        if (!job || !job.description?.trim()) {
            throw new Error('Job description not found');
        }

        if (!resumeText) {
            throw new Error('Resume text not found');
        }

        const aiScore = await matchResumeToJob({
            resumeText,
            jobDescription: job.description,
            userId: application.student.toString(),
            jobId: application.job.toString(),
        });

        application.aiScore = aiScore;
        await application.save();

        logger.info('Application score recomputed', {
            application_id: applicationId,
            similarity_score: aiScore,
        });

        return application;
    } catch (error) {
        logger.error('Failed to recompute application score', {
            application_id: applicationId,
            error_name: error.name,
            error_message: error.message,
        });
        throw error;
    }
};

const getApplicationsByJobSortedByScore = async (jobId, options = {}) => {
    const { sortOrder = 'desc', limit = 50 } = options;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    return Application.find({
        job: jobId,
        aiScore: { $ne: null },
    })
        .populate('student', 'name email')
        .sort({ aiScore: sortDirection })
        .limit(limit)
        .lean();
};

const getStudentDashboardStats = async (studentId) => {
    const [totalApplications, statusCounts, recentApplications] =
        await Promise.all([
            Application.countDocuments({ student: studentId }),
            Application.aggregate([
                { $match: { student: studentId } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            Application.find({ student: studentId })
                .populate('job', 'title company location')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
        ]);

    const statusMap = {};
    statusCounts.forEach((item) => {
        statusMap[item._id] = item.count;
    });

    const stats = {
        totalApplications: totalApplications,
        appliedCount: statusMap.applied || 0,
        shortlistedCount: statusMap.shortlisted || 0,
        rejectedCount: statusMap.rejected || 0,
        recentApplications: recentApplications,
        latestAtsScores: recentApplications
            .filter((app) => app.aiScore !== null)
            .slice(0, 3),
    };

    return stats;
};

module.exports = {
    createApplication,
    getApplicationsByJob,
    getStudentApplications,
    getApplicationById,
    recomputeApplicationScore,
    getApplicationsByJobSortedByScore,
    extractResumeTextFromReference,
    getStudentDashboardStats,
};
