import { useState } from 'react';

import toast from 'react-hot-toast';

import Button from '../../components/common/Button';

import Card from '../../components/common/Card';

import { uploadResume } from '../../api/uploadApi';
import { extractErrorMessage } from '../../utils/apiErrorHandler';

function StudentResume() {
    const [resume, setResume] = useState(null);

    const [resumeUrl, setResumeUrl] = useState(
        localStorage.getItem('resumeUrl') || '',
    );

    const [loading, setLoading] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // PDF validation
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed');

            return;
        }

        setResume(file);
    };

    // Upload resume
    const handleUpload = async () => {
        try {
            if (!resume) {
                toast.error('Please select a resume');

                return;
            }

            setLoading(true);

            const formData = new FormData();

            formData.append('resume', resume);

            const data = await uploadResume(formData, (progressEvent) => {
                const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                );

                setUploadProgress(percent);
            });

            console.log(data);

            const uploadedUrl = `http://localhost:5000${data.fileUrl}`;
            setResumeUrl(uploadedUrl);

            // Store globally
            localStorage.setItem('resumeUrl', uploadedUrl);

            toast.success('Resume uploaded successfully');
        } catch (error) {
            console.error(error);

            toast.error(extractErrorMessage(error, 'Resume upload failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}

            <div>
                <h1
                    className="
                        text-4xl
                        font-bold
                        text-gray-800
                    "
                >
                    Resume Manager 📑
                </h1>

                <p className="text-gray-500 mt-2">
                    Upload and manage your resumes.
                </p>
            </div>

            {/* Upload Card */}

            <Card>
                <div className="space-y-5">
                    {/* File Input */}

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="
                            border
                            border-gray-300
                            p-3
                            rounded-lg
                            w-full
                        "
                    />

                    {/* Upload Progress */}

                    {uploadProgress > 0 && (
                        <div>
                            <p className="text-sm text-gray-600">
                                Upload Progress: {uploadProgress}%
                            </p>
                        </div>
                    )}

                    {/* Upload Button */}

                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleUpload}
                        loading={loading}
                    >
                        Upload Resume
                    </Button>

                    {/* Uploaded Resume */}

                    {resumeUrl && (
                        <div className="mt-4">
                            <p className="font-medium text-green-600">
                                Resume uploaded successfully
                            </p>

                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    text-blue-500
                                    underline
                                "
                            >
                                View Resume
                            </a>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default StudentResume;
