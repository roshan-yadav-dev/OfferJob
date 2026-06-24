import { Link } from 'react-router-dom';
import { Code2, Share2, MessageCircle, Mail, Phone } from 'lucide-react';

function Footer() {
    const currentYear = new Date().getFullYear();

    const platformLinks = [
        { label: 'Browse Jobs', to: '/jobs' },
        { label: 'Get Started', to: '/signup' },
        { label: 'Login', to: '/login' },
    ];

    const resourceLinks = [
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Features', href: '#features' },
        { label: 'AI Highlights', href: '#ai-highlights' },
    ];

    const companyLinks = [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
    ];

    return (
        <footer className="border-t border-[#e2e8f0] bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                        <h3 className="text-lg font-bold text-[#0f172a]">
                            Smart AI Job Portal
                        </h3>
                        <p className="max-w-xs text-sm leading-relaxed text-[#64748b]">
                            AI-powered recruitment for students and hiring teams.
                            Match faster, apply smarter, hire with confidence.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#0f172a]">
                            Platform
                        </h4>
                        <ul className="space-y-2">
                            {platformLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-[#64748b] transition-colors duration-200 hover:text-[#2563eb]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#0f172a]">
                            Resources
                        </h4>
                        <ul className="space-y-2">
                            {resourceLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-[#64748b] transition-colors duration-200 hover:text-[#2563eb]"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#0f172a]">
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="mailto:support@smartaijobportal.com"
                                    className="flex items-center gap-2 text-sm text-[#64748b] transition-colors duration-200 hover:text-[#2563eb]"
                                >
                                    <Mail className="h-4 w-4" />
                                    support@smartaijobportal.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+1234567890"
                                    className="flex items-center gap-2 text-sm text-[#64748b] transition-colors duration-200 hover:text-[#2563eb]"
                                >
                                    <Phone className="h-4 w-4" />
                                    +1 (234) 567-8900
                                </a>
                            </li>
                        </ul>

                        <div className="mt-5 flex items-center gap-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] text-[#64748b] transition-all duration-200 hover:border-[#2563eb] hover:text-[#2563eb]"
                                aria-label="GitHub"
                            >
                                <Code2 className="h-4 w-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] text-[#64748b] transition-all duration-200 hover:border-[#2563eb] hover:text-[#2563eb]"
                                aria-label="LinkedIn"
                            >
                                <Share2 className="h-4 w-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] text-[#64748b] transition-all duration-200 hover:border-[#2563eb] hover:text-[#2563eb]"
                                aria-label="Twitter"
                            >
                                <MessageCircle className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-[#e2e8f0] pt-6 text-center text-sm text-[#64748b]">
                    © {currentYear} Smart AI Job Portal. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
