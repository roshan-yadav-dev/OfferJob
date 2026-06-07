import { Link } from 'react-router-dom';
import Button from '../common/Button';

function HeroSection() {
    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-6xl mx-auto py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                Smart AI Job Portal
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 font-medium">
                                AI-Powered Recruitment Platform
                            </p>
                        </div>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                            Revolutionize your hiring process with intelligent
                            resume matching and candidate ranking. Connect top
                            talent with perfect opportunities using advanced AI
                            algorithms.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/login" className="w-full sm:w-auto">
                                <Button
                                    variant="primary"
                                    className="w-full sm:w-auto text-lg py-3"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto text-lg py-3"
                                >
                                    Register
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-8 space-y-3 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                                <span className="inline-block w-5 h-5 bg-green-500 rounded-full"></span>
                                Secure & Reliable
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="inline-block w-5 h-5 bg-green-500 rounded-full"></span>
                                AI-Powered Matching
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="inline-block w-5 h-5 bg-green-500 rounded-full"></span>
                                Real-Time Notifications
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center justify-center">
                        <div className="relative w-full h-96">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl transform rotate-3 opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-500 rounded-3xl transform -rotate-3 opacity-10"></div>
                            <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center text-white text-center p-8">
                                <div className="space-y-6">
                                    <div className="text-6xl">🚀</div>
                                    <div className="text-3xl font-bold">
                                        Smart Hiring
                                    </div>
                                    <p className="text-blue-100">
                                        Powered by AI
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
