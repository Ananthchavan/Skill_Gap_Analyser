import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/HowItWorks'
import WhyUs from '../components/WhyUs'
import Banner from '../components/Banner'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <WhyUs />
      <Banner />
      <Footer />
    </div>
  )
}
