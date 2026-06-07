import { Link } from 'react-router-dom';
import Button from '../common/Button';

function CTASection() {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Ready to Transform Your Hiring?
                    </h2>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Join thousands of recruiters and candidates using Smart
                        AI Job Portal to find perfect matches.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Link to="/signup">
                        <Button
                            variant="primary"
                            className="bg-white text-blue-600 hover:bg-gray-100 text-lg py-3 px-8"
                        >
                            Get Started for Free
                        </Button>
                    </Link>
                    <Link to="/jobs">
                        <Button
                            variant="outline"
                            className="border-white text-white hover:bg-white hover:text-blue-600 text-lg py-3 px-8"
                        >
                            Browse Jobs
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default CTASection;
