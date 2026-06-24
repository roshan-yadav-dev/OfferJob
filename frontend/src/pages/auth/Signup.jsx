import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { showSuccess, showError } from '../../utils/toast';
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

            const response = await signupUser(data);

            saveToken(response.token);
            login(response.user);

            showSuccess('Account created successfully');

            if (response.user.role === 'recruiter') {
                navigate('/recruiter/profile');
            } else {
                navigate('/student/profile');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                showError(error.response.data.message);
            } else if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach((err) => {
                    showError(err);
                });
            } else {
                showError('Signup failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
            <div className="animate-fade-in-up w-full max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-[#0f172a]">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-[#64748b]">
                        Join as a student or recruiter to get started
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        name="name"
                        required
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
                        placeholder="you@example.com"
                        name="email"
                        required
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
                        placeholder="Create a password"
                        name="password"
                        required
                        helperText="Minimum 6 characters"
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

                    <Select
                        label="Role"
                        name="role"
                        required
                        helperText="Choose how you'll use the platform"
                        register={(name) =>
                            register(name, {
                                required: 'Please select a role',
                            })
                        }
                        error={errors.role}
                    >
                        <option value="">Choose a role</option>
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                    </Select>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={loading}
                    >
                        Create Account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-[#64748b]">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-[#2563eb] transition-colors duration-200 hover:text-[#1d4ed8]"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
