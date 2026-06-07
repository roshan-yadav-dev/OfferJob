import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

import { useAuth } from '../../context/AuthContext';

import { createJob } from '../../api/jobApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function PostJob() {
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Call backend to create job
            const response = await createJob(data);

            toast.success(response.message || 'Job posted successfully!');

            // Reset form
            reset();
        } catch (error) {
            handleApiError(error, 'Failed to post job. Please try again.');
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
                    Post New Job 🚀
                </h1>

                <p className="text-gray-500 mt-2">
                    Create and publish job openings.
                </p>
            </div>

            {/* Form */}

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {user?.companyName && (
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                            <p className="text-sm text-blue-700">
                                Posting as <strong>{user.companyName}</strong>
                            </p>
                        </div>
                    )}

                    {!user?.companyName && (
                        <Input
                            label="Company Name"
                            placeholder="Enter company name"
                            name="company"
                            register={(name) =>
                                register(name, {
                                    required: 'Company name is required',
                                })
                            }
                            error={errors.company}
                        />
                    )}
                    <Input
                        label="Job Title"
                        placeholder="Enter job title"
                        name="title"
                        register={(name) =>
                            register(name, {
                                required: 'Job title is required',
                            })
                        }
                        error={errors.title}
                    />
                    <Input
                        label="Location"
                        placeholder="Enter location"
                        name="location"
                        register={(name) =>
                            register(name, {
                                required: 'Location is required',
                            })
                        }
                        error={errors.location}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">
                            Job Description
                        </label>

                        <textarea
                            {...register('description', {
                                required: 'Job description is required',
                            })}
                            rows="5"
                            className="
                                border
                                border-gray-300
                                rounded-lg
                                p-4
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                            placeholder="Enter job description"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    <Input
                        label="Experience Required (years)"
                        type="number"
                        placeholder="Enter years of experience"
                        name="experience"
                        register={(name) =>
                            register(name, {
                                required: 'Experience is required',
                                min: {
                                    value: 0,
                                    message: 'Experience cannot be negative',
                                },
                            })
                        }
                        error={errors.experience}
                    />
                    <Input
                        label="Salary Range"
                        placeholder="e.g., 5-8 LPA"
                        name="salary"
                        register={(name) =>
                            register(name, {
                                required: 'Salary range is required',
                            })
                        }
                        error={errors.salary}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        disabled={loading}
                    >
                        Post Job
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default PostJob;
