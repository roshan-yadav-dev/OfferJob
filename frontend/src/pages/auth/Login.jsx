import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { loginUser } from '../../api/authApi';
import { saveToken } from '../../services/tokenService';

import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

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

            // Call backend login API
            const response = await loginUser(data);

            // Save user in AuthContext
            login(response.user);

            // Save token
            saveToken(response.token);

            toast.success('Login successful');

            // Navigate by role
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
                toast.error('Login failed. Please try again.');
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
                <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
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
                        placeholder="Enter your password"
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

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={loading}
                    >
                        Login
                    </Button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{' '}
                    <a
                        href="/signup"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
