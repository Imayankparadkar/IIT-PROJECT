import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  FileText, 
  Zap, 
  Star, 
  Shield, 
  Clock, 
  TrendingUp,
  Navigation,
  CheckCircle,
  Phone,
  ArrowRight,
  MapPin,
  Battery,
  Wrench,
  Droplets,
  Award,
  Users
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Smart Parking
              <span className="text-blue-600 block">Management Platform</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Complete automotive solutions at your fingertips. Park smart, service easy, and manage all your vehicle documents securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" data-testid="button-get-started">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" data-testid="button-book-service-hero">
                  <Car className="h-5 w-5 mr-2" />
                  Book Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-16 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Professional automotive services and management tools</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Car & Bike Services */}
            <Link href="/services">
              <Card className="h-full hover:shadow-xl transition-all cursor-pointer group" data-testid="card-services">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                    <Car className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Car & Bike Services</h3>
                  <p className="text-gray-600 mb-6">Complete vehicle services at your parking location. Oil change, battery service, car wash, and more.</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span>Oil Change</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Battery className="h-4 w-4 text-green-600" />
                      <span>Battery Service</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className="h-4 w-4 text-purple-600" />
                      <span>General Service</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-4 w-4 text-yellow-600" />
                      <span>Car Wash</span>
                    </div>
                  </div>
                  
                  <Badge className="bg-green-100 text-green-800">At Your Location</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* Secure Document Storage */}
            <Link href="/documents">
              <Card className="h-full hover:shadow-xl transition-all cursor-pointer group" data-testid="card-documents">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Document Storage</h3>
                  <p className="text-gray-600 mb-6">Store and manage all your important vehicle documents digitally with bank-level security.</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span>Driving License</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>RC Certificate</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>PUC Certificate</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Insurance Papers</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  
                  <Badge className="bg-purple-100 text-purple-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Secure & Encrypted
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            {/* EV Station Finder */}
            <Link href="/ev-stations">
              <Card className="h-full hover:shadow-xl transition-all cursor-pointer group" data-testid="card-ev-stations">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">EV Station Finder</h3>
                  <p className="text-gray-600 mb-6">Find nearest charging stations with real-time availability and smart navigation features.</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-green-600">0.5 km</div>
                      <div className="text-xs text-gray-600">Tata Power</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-blue-600">4 ports</div>
                      <div className="text-xs text-gray-600">Available</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-purple-600">₹8/kWh</div>
                      <div className="text-xs text-gray-600">Price</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <Navigation className="h-4 w-4 text-yellow-600 mx-auto" />
                      <div className="text-xs text-gray-600">Voice Nav</div>
                    </div>
                  </div>
                  
                  <Badge className="bg-green-100 text-green-800">Real-time Data</Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Personal Dashboard
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get a complete overview of your automotive journey. Track services, monitor documents, and manage everything from one place.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Service history and upcoming bookings</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Document status and renewal alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>EV charging sessions and savings</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Points, levels, and achievements</span>
                </div>
              </div>
              
              <Link href="/dashboard">
                <Button size="lg" data-testid="button-view-dashboard">
                  View Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">₹4,500</div>
                  <div className="text-sm text-gray-600">Total Savings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Level 4</div>
                  <div className="text-sm text-gray-600">1,247 Points</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Car className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-sm text-gray-600">Services Done</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">4/4</div>
                  <div className="text-sm text-gray-600">Docs Uploaded</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Park Sarthi</h2>
            <p className="text-xl text-gray-600">Professional, reliable, and convenient automotive solutions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Save Time & Fuel</h3>
              <p className="text-gray-600">Smart solutions reduce search time and fuel consumption significantly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Secure & Trusted</h3>
              <p className="text-gray-600">Bank-level security for all your documents and personal information</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">At Your Location</h3>
              <p className="text-gray-600">Services delivered right at your parking spot for maximum convenience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Rewards & Points</h3>
              <p className="text-gray-600">Earn points on every service and unlock exclusive benefits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,50,000+</div>
              <div className="text-blue-100">Services Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">EV Stations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Automotive Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who trust Park Sarthi for all their vehicle needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" data-testid="button-start-now">
                Start Now - It's Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/support">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800" data-testid="button-contact-us">
                <Phone className="h-5 w-5 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}