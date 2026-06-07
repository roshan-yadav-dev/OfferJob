import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingStates';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../api/authApi';
import { handleApiError } from '../../utils/apiErrorHandler';

function RecruiterProfile() {
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
            companyName: user?.companyName || '',
            currentPosition: user?.currentPosition || '',
            mobileNumber: user?.mobileNumber || '',
            address: user?.address || '',
            city: user?.city || '',
            state: user?.state || '',
        },
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [profileCompletion, setProfileCompletion] = useState(0);

    // Watch form fields to calculate profile completion
    const formValues = watch();

    useEffect(() => {
        // Required fields for recruiters
        const requiredFields = [
            'name',
            'companyName',
            'currentPosition',
            'mobileNumber',
            'email',
            'address',
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
                companyName: user.companyName || '',
                currentPosition: user.currentPosition || '',
                mobileNumber: user.mobileNumber || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
            });
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
            if (data.companyName !== user.companyName)
                updateData.companyName = data.companyName;
            if (data.currentPosition !== user.currentPosition)
                updateData.currentPosition = data.currentPosition;
            if (data.mobileNumber !== user.mobileNumber)
                updateData.mobileNumber = data.mobileNumber;
            if (data.address !== user.address)
                updateData.address = data.address;
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

    if (!user) {
        return <LoadingSpinner message="Loading profile..." />;
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-800">
                    Company Profile 🏢
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your recruiter and company information.
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

                            {/* Company Name */}
                            <Input
                                label="Company Name"
                                type="text"
                                placeholder="Enter your company name"
                                register={() =>
                                    register('companyName', {
                                        required: 'Company name is required',
                                    })
                                }
                                name="companyName"
                                error={errors.companyName}
                            />

                            {/* Current Position */}
                            <Input
                                label="Current Position"
                                type="text"
                                placeholder="Enter your position (e.g., HR Manager)"
                                register={() =>
                                    register('currentPosition', {
                                        required: 'Position is required',
                                    })
                                }
                                name="currentPosition"
                                error={errors.currentPosition}
                            />

                            {/* Address */}
                            <div className="md:col-span-2">
                                <Input
                                    label="Address"
                                    type="text"
                                    placeholder="Enter your company address"
                                    register={() =>
                                        register('address', {
                                            required: 'Address is required',
                                        })
                                    }
                                    name="address"
                                    error={errors.address}
                                />
                            </div>

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
                                    {user.role || 'Recruiter'}
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
        </div>
    );
}

export default RecruiterProfile;
