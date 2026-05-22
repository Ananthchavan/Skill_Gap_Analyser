import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/HowItWorks'
import WhyUs from '../components/WhyUs'

export default function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <WhyUs />
      {/* Footer will go here next */}
    </div>
  )
}
