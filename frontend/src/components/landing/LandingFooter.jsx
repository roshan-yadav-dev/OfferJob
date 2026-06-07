function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-100 px-4">
            <div className="max-w-6xl mx-auto py-16">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">
                            Smart AI Job Portal
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            Revolutionizing recruitment with AI-powered matching
                            and intelligent candidate ranking.
                        </p>
                    </div>

                    {/* About */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">About</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">
                            Contact
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="mailto:support@smartaijobportal.com"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    support@smartaijobportal.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+1234567890"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    +1 (234) 567-8900
                                </a>
                            </li>
                            <li className="pt-2">
                                <span className="text-gray-500">
                                    Hours: 9AM - 6PM EST
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">
                            Connect
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <span className="text-xl">🔗</span> GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <span className="text-xl">🔗</span> LinkedIn
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <span className="text-xl">🔗</span> Twitter
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 py-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Smart AI Job Portal. All rights
                            reserved.
                        </p>
                        <div className="flex flex-col md:flex-row md:justify-end gap-4 text-sm">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default LandingFooter;
