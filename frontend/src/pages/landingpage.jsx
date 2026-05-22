import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'

export default function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <HeroSection />
      {/* WhyUs, Footer will go here next */}
    </div>
  )
}
