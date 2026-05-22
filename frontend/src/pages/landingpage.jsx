import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/HowItWorks'

export default function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      {/* WhyUs, Footer will go here next */}
    </div>
  )
}
