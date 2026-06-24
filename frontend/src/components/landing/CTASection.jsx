import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import Button from '../common/Button';

function CTASection() {
    return (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="relative overflow-hidden rounded-2xl bg-[#2563eb] px-6 py-14 text-center shadow-lg sm:px-10 sm:py-16">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

                    <div className="relative mx-auto max-w-2xl space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to Start Your Career Journey?
                        </h2>
                        <p className="text-base text-blue-100 sm:text-lg">
                            Join students and recruiters using AI-powered tools
                            to find better matches and hire with confidence.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                            <Link to="/signup">
                                <Button className="w-full rounded-xl bg-white px-6 py-3 text-base font-semibold text-[#2563eb] hover:bg-blue-50 sm:w-auto">
                                    Create Account
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/jobs">
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl border-white px-6 py-3 text-base text-white hover:bg-white/10 sm:w-auto"
                                >
                                    Browse Opportunities
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTASection;
