import { useState } from 'react';

import toast from 'react-hot-toast';

import Card from '../../components/common/Card';

import { uploadResume } from '../../api/uploadApi';
import { getErrorMessage } from '../utils/getErrorMessage';

function ResumeUpload() {
    const [resume, setResume] = useState(null);

    const [resumeUrl, setResumeUrl] = useState(
        localStorage.getItem('resumeUrl') || '',
    );

    const [loading, setLoading] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Validate PDF file
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed');

            return;
        }

        setResume(file);
    };

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

            const uploadedUrl = data.resumeUrl || data.url;

            setResumeUrl(uploadedUrl);

            // Store resume globally
            localStorage.setItem('resumeUrl', uploadedUrl);

            toast.success('Resume uploaded successfully');
        } catch (error) {
            console.error(error);

            toast.error(
                getErrorMessage(error) ||
                    'Failed to upload resume. Please try again.',
            );
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Card>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">Upload Resume</h2>

                    <p className="mt-2 text-gray-500">
                        Upload your PDF resume.
                    </p>
                </div>

                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="
                        w-full
                        rounded-lg
                        border
                        p-2
                    "
                />

                {uploadProgress > 0 && (
                    <div>
                        <p className="mb-2 text-sm font-medium">
                            Upload Progress: {uploadProgress}%
                        </p>

                        <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                                className="
                                    h-2
                                    rounded-full
                                    bg-blue-500
                                "
                                style={{
                                    width: `${uploadProgress}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="
                        rounded-lg
                        bg-blue-500
                        px-4
                        py-2
                        text-white
                        hover:bg-blue-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    {loading ? 'Uploading...' : 'Upload Resume'}
                </button>

                {resumeUrl && (
                    <div className="mt-4">
                        <p className="font-medium text-green-600">
                            Resume Uploaded Successfully
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
    );
}

export default ResumeUpload;
