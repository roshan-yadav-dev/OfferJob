import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { loginUser } from '../../api/authApi';
import { saveToken } from '../../services/tokenService';
import { useAuth } from '../../context/AuthContext';
import { showSuccess, showError } from '../../utils/toast';

function Login() {
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

            const response = await loginUser(data);

            login(response.user);
            saveToken(response.token);

            showSuccess('Login successful');

            if (response.user.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else if (response.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                showError(error.response.data.message);
            } else if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach((err) => {
                    showError(err);
                });
            } else {
                showError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="animate-fade-in-up w-full max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-[#0f172a]">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-[#64748b]">
                        Sign in to continue to your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        name="email"
                        required
                        helperText="Use the email associated with your account"
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
                        placeholder="Enter your password"
                        name="password"
                        required
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

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={loading}
                    >
                        Login
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-[#64748b]">
                    Don&apos;t have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-medium text-[#2563eb] transition-colors duration-200 hover:text-[#1d4ed8]"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
