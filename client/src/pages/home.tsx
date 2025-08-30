import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import GamificationDashboard from '@/components/GamificationDashboard';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BusinessQueryForm from '@/components/BusinessQueryForm';
import BusinessSection from '@/components/BusinessSection';
import ProductsSection from '@/components/ProductsSection';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <ServicesSection />
      <GamificationDashboard />
      <AboutSection />
      <TestimonialsSection />
      <BusinessQueryForm />
      <BusinessSection />
      <ProductsSection />
      
      {/* More Reasons to Love Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">More Reasons to Love Park Sarthi</h2>
            <p className="text-xl text-gray-600">Everything you need for a complete automotive experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="reason-fastag">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-credit-card text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-3">One FASTag for All</h3>
              <p className="text-gray-600">Use for parking, tolls, malls, fuel stations, and more</p>
            </div>
            
            <div className="text-center" data-testid="reason-time">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-3">Save Time & Fuel</h3>
              <p className="text-gray-600">Smart parking reduces search time and fuel consumption</p>
            </div>
            
            <div className="text-center" data-testid="reason-reminders">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bell text-yellow-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-3">Smart Reminders</h3>
              <p className="text-gray-600">Get notified for insurance and PUC renewals</p>
            </div>
            
            <div className="text-center" data-testid="reason-rto">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-university text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-3">RTO Services</h3>
              <p className="text-gray-600">Easy access to RTO services and traffic rules</p>
            </div>
          </div>
        </div>
      </section>

      <CaseStudiesSection />
      <ContactSection />
      <Footer />
      <Chatbot />
    </div>
  );
}
