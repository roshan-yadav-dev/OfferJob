import HeroSection from '../../components/landing/HeroSection';
import TrustSection from '../../components/landing/TrustSection';
import FeatureGrid from '../../components/landing/FeatureGrid';
import HowItWorks from '../../components/landing/HowItWorks';
import AiHighlights from '../../components/landing/AiHighlights';
import StatsSection from '../../components/landing/StatsSection';
import CTASection from '../../components/landing/CTASection';
import Footer from '../../components/landing/Footer';

function LandingPage() {
    return (
        <div className="w-full">
            <HeroSection />
            <TrustSection />
            <div id="features">
                <FeatureGrid />
            </div>
            <div id="how-it-works">
                <HowItWorks />
            </div>
            <div id="ai-highlights">
                <AiHighlights />
            </div>
            <StatsSection />
            <CTASection />
            <Footer />
        </div>
    );
}

export default LandingPage;
