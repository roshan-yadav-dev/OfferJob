import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { signupUser } from '../../api/authApi';
import { saveToken } from '../../services/tokenService';
import { useAuth } from '../../context/AuthContext';

function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Call backend register API
            const response = await signupUser(data);

            // Save token
            saveToken(response.token);

            // Save user in AuthContext
            login(response.user);

            toast.success('Signup successful');

            // Redirect to dashboard based on role
            if (response.user.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (error) {
            console.error(error);

            // Handle backend validation errors
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.data?.errors) {
                // Handle field-specific errors
                Object.values(error.response.data.errors).forEach((err) => {
                    toast.error(err);
                });
            } else {
                toast.error('Signup failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div
                className="
                    bg-white
                    shadow-md
                    rounded-xl
                    p-8
                    w-full
                    max-w-md
                "
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Signup</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                        label="Full Name"
                        placeholder="Enter full name"
                        name="name"
                        register={(name) =>
                            register(name, {
                                required: 'Full name is required',

                                minLength: {
                                    value: 3,

                                    message:
                                        'Name must be at least 3 characters',
                                },
                            })
                        }
                        error={errors.name}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        register={(name) =>
                            register(name, {
                                required: 'Email is required',

                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                                    message: 'Invalid email address',
                                },
                            })
                        }
                        error={errors.email}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        register={(name) =>
                            register(name, {
                                required: 'Password is required',

                                minLength: {
                                    value: 6,

                                    message:
                                        'Password must be at least 6 characters',
                                },
                            })
                        }
                        error={errors.password}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-700">
                            Select Role
                        </label>

                        <select
                            {...register('role', {
                                required: 'Please select a role',
                            })}
                            className="
                                border
                                border-gray-300
                                rounded-lg
                                px-4
                                py-2
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                        >
                            <option value="">Choose a role</option>
                            <option value="student">Student</option>

                            <option value="recruiter">Recruiter</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={loading}
                    >
                        Signup
                    </Button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account?{' '}
                    <a
                        href="/login"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Signup;
