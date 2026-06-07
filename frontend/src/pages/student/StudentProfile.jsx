import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingStates';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../api/authApi';
import { uploadResume } from '../../api/uploadApi';
import { handleApiError } from '../../utils/apiErrorHandler';
import { resolveResumeUrl } from '../../utils/resolveResumeUrl';

function StudentProfile() {
    const { user, login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            collegeName: user?.collegeName || '',
            currentCGPA: user?.currentCGPA || '',
            currentSemester: user?.currentSemester || '',
            passoutYear: user?.passoutYear || '',
            mobileNumber: user?.mobileNumber || '',
            city: user?.city || '',
            state: user?.state || '',
        },
    });

    const [loading, setLoading] = useState(false);
    const [resumeUploading, setResumeUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentResume, setCurrentResume] = useState(
        resolveResumeUrl(user?.resumeUrl || ''),
    );
    const [profileCompletion, setProfileCompletion] = useState(0);

    // Watch form fields to calculate profile completion
    const formValues = watch();

    useEffect(() => {
        // Required fields for students
        const requiredFields = [
            'name',
            'collegeName',
            'currentCGPA',
            'currentSemester',
            'passoutYear',
            'mobileNumber',
            'email',
            'city',
            'state',
        ];

        const completedFields = requiredFields.filter((field) => {
            const value = formValues[field];
            return value && value.toString().trim() !== '';
        });

        const completion = Math.round(
            (completedFields.length / requiredFields.length) * 100,
        );
        setProfileCompletion(completion);
    }, [formValues]);

    // Update default values when user changes
    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                email: user.email || '',
                collegeName: user.collegeName || '',
                currentCGPA: user.currentCGPA || '',
                currentSemester: user.currentSemester || '',
                passoutYear: user.passoutYear || '',
                mobileNumber: user.mobileNumber || '',
                city: user.city || '',
                state: user.state || '',
            });
            setCurrentResume(resolveResumeUrl(user.resumeUrl || ''));
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setSuccessMessage('');
            setErrorMessage('');

            const updateData = {};

            // Build update object with changed fields
            if (data.name !== user.name) updateData.name = data.name;
            if (data.email !== user.email) updateData.email = data.email;
            if (data.collegeName !== user.collegeName)
                updateData.collegeName = data.collegeName;
            if (data.currentCGPA !== user.currentCGPA)
                updateData.currentCGPA = data.currentCGPA
                    ? parseFloat(data.currentCGPA)
                    : null;
            if (data.currentSemester !== user.currentSemester)
                updateData.currentSemester = data.currentSemester
                    ? parseInt(data.currentSemester)
                    : null;
            if (data.passoutYear !== user.passoutYear)
                updateData.passoutYear = data.passoutYear
                    ? parseInt(data.passoutYear)
                    : null;
            if (data.mobileNumber !== user.mobileNumber)
                updateData.mobileNumber = data.mobileNumber;
            if (data.city !== user.city) updateData.city = data.city;
            if (data.state !== user.state) updateData.state = data.state;

            if (Object.keys(updateData).length > 0) {
                const response = await updateUserProfile(updateData);

                // Update auth context
                const updatedUser = response.user || response;
                login({
                    ...user,
                    ...updatedUser,
                });

                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setSuccessMessage('No changes to update.');
            }
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || 'Failed to update profile';
            setErrorMessage(errorMsg);
            handleApiError(error, errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setResumeUploading(true);
            setSuccessMessage('');
            setErrorMessage('');

            const formData = new FormData();
            formData.append('resume', file);

            const response = await uploadResume(formData);

            if (response.resumeUrl) {
                const normalizedResumeUrl = resolveResumeUrl(
                    response.resumeUrl || response.url || response.fileUrl,
                );

                setCurrentResume(normalizedResumeUrl);

                // Update auth context with new resume URL
                login({
                    ...user,
                    resumeUrl: normalizedResumeUrl,
                });

                setSuccessMessage('Resume uploaded successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || 'Failed to upload resume';
            setErrorMessage(errorMsg);
            handleApiError(error, errorMsg);
        } finally {
            setResumeUploading(false);
        }
    };

    if (!user) {
        return <LoadingSpinner message="Loading profile..." />;
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-800">
                    My Profile 👤
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your profile information and resume.
                </p>
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {errorMessage}
                </div>
            )}

            {/* Profile Information Form */}
            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Profile Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    register={() =>
                                        register('name', {
                                            required: 'Full name is required',
                                            minLength: {
                                                value: 2,
                                                message:
                                                    'Name must be at least 2 characters',
                                            },
                                        })
                                    }
                                    name="name"
                                    error={errors.name}
                                />
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <Input
                                    label="Email ID"
                                    type="email"
                                    placeholder="Enter your email"
                                    register={() =>
                                        register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message:
                                                    'Invalid email address',
                                            },
                                        })
                                    }
                                    name="email"
                                    error={errors.email}
                                />
                            </div>

                            {/* Mobile Number */}
                            <Input
                                label="Mobile Number"
                                type="tel"
                                placeholder="Enter your mobile number"
                                register={() =>
                                    register('mobileNumber', {
                                        required: 'Mobile number is required',
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message:
                                                'Mobile number must be 10 digits',
                                        },
                                    })
                                }
                                name="mobileNumber"
                                error={errors.mobileNumber}
                            />

                            {/* College Name */}
                            <Input
                                label="College Name"
                                type="text"
                                placeholder="Enter your college name"
                                register={() =>
                                    register('collegeName', {
                                        required: 'College name is required',
                                    })
                                }
                                name="collegeName"
                                error={errors.collegeName}
                            />

                            {/* Current CGPA */}
                            <Input
                                label="Current CGPA"
                                type="number"
                                placeholder="Enter your CGPA (e.g., 8.5)"
                                register={() =>
                                    register('currentCGPA', {
                                        required: 'CGPA is required',
                                        min: {
                                            value: 0,
                                            message:
                                                'CGPA cannot be less than 0',
                                        },
                                        max: {
                                            value: 10,
                                            message:
                                                'CGPA cannot be more than 10',
                                        },
                                    })
                                }
                                name="currentCGPA"
                                step="0.01"
                                min="0"
                                max="10"
                                error={errors.currentCGPA}
                            />

                            {/* Current Semester */}
                            <Input
                                label="Current Semester"
                                type="number"
                                placeholder="Enter your semester"
                                register={() =>
                                    register('currentSemester', {
                                        required: 'Semester is required',
                                        min: {
                                            value: 1,
                                            message:
                                                'Semester must be at least 1',
                                        },
                                        max: {
                                            value: 12,
                                            message:
                                                'Semester cannot exceed 12',
                                        },
                                    })
                                }
                                name="currentSemester"
                                min="1"
                                max="12"
                                error={errors.currentSemester}
                            />

                            {/* Passout Year */}
                            <Input
                                label="Passout Year"
                                type="number"
                                placeholder="Enter your passout year"
                                register={() =>
                                    register('passoutYear', {
                                        required: 'Passout year is required',
                                        min: {
                                            value: new Date().getFullYear(),
                                            message: `Passout year must be ${new Date().getFullYear()} or later`,
                                        },
                                        max: {
                                            value:
                                                new Date().getFullYear() + 10,
                                            message:
                                                'Please enter a valid year',
                                        },
                                    })
                                }
                                name="passoutYear"
                                min={new Date().getFullYear()}
                                max={new Date().getFullYear() + 10}
                                error={errors.passoutYear}
                            />

                            {/* City */}
                            <Input
                                label="City"
                                type="text"
                                placeholder="Enter your city"
                                register={() =>
                                    register('city', {
                                        required: 'City is required',
                                    })
                                }
                                name="city"
                                error={errors.city}
                            />

                            {/* State */}
                            <Input
                                label="State"
                                type="text"
                                placeholder="Enter your state"
                                register={() =>
                                    register('state', {
                                        required: 'State is required',
                                    })
                                }
                                name="state"
                                error={errors.state}
                            />

                            {/* Role */}
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium capitalize">
                                    {user.role || 'Student'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Completion Indicator */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-700">
                                Profile Completion
                            </h3>
                            <span className="text-lg font-bold text-blue-600">
                                {profileCompletion}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${profileCompletion}%` }}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        loading={loading}
                        className="w-full md:w-auto"
                    >
                        Save Changes
                    </Button>
                </form>
            </Card>

            {/* Resume Management */}
            <Card>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Resume Management
                        </h2>

                        {currentResume ? (
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Current Resume
                                    </p>
                                    <p className="text-blue-600 font-semibold break-all text-sm">
                                        {currentResume}
                                    </p>
                                </div>

                                <a
                                    href={currentResume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block"
                                >
                                    <Button variant="outline">
                                        View Resume
                                    </Button>
                                </a>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <p className="text-yellow-700 font-medium">
                                    No resume uploaded yet. Upload one to see AI
                                    match scores for jobs.
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-3">
                            Upload or Update Resume (PDF)
                        </label>

                        <div className="flex flex-col gap-4">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleResumeUpload}
                                disabled={resumeUploading}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    cursor-pointer"
                            />

                            {resumeUploading && (
                                <div className="flex items-center gap-2 text-blue-600">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    <span className="text-sm">
                                        Uploading...
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default StudentProfile;
