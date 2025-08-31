import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealTimeParkingBooking from '@/components/RealTimeParkingBooking';
import ChallanChecker from '@/components/ChallanChecker';
import ValetService from '@/components/ValetService';
import FASTagServices from '@/components/FASTagServices';
import VehicleMaintenance from '@/components/VehicleMaintenance';
import EVStationFinder from '@/components/EVStationFinder';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Car, 
  MapPin, 
  Clock, 
  Shield, 
  Zap, 
  Wrench, 
  CreditCard,
  FileText,
  Phone,
  Star,
  AlertTriangle,
  Navigation,
  Search,
  Wallet,
  Calendar
} from 'lucide-react';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('parking');

  const services = [
    {
      id: 'parking',
      title: 'Smart Parking',
      icon: <Car className="h-6 w-6" />,
      description: 'Find and book parking slots in real-time across Indore',
      features: ['Real-time availability', 'Pre-booking', 'Voice navigation', 'Slot search'],
      color: 'bg-blue-500'
    },
    {
      id: 'challan',
      title: 'Challan Checker',
      icon: <AlertTriangle className="h-6 w-6" />,
      description: 'Check traffic violations and pay challans online',
      features: ['Instant lookup', 'Online payment', 'Location mapping', 'History tracking'],
      color: 'bg-red-500'
    },
    {
      id: 'ev-stations',
      title: 'EV Charging',
      icon: <Zap className="h-6 w-6" />,
      description: 'Locate and book EV charging stations with real-time status',
      features: ['Live availability', 'Price comparison', 'Booking system', 'Route planning'],
      color: 'bg-green-500'
    },
    {
      id: 'valet',
      title: 'Valet Service',
      icon: <Shield className="h-6 w-6" />,
      description: 'Premium valet parking and car care services',
      features: ['Professional service', 'Car care', 'Secure parking', 'Priority access'],
      color: 'bg-purple-500'
    },
    {
      id: 'fastag',
      title: 'FASTag Services',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'FASTag recharge and management services',
      features: ['Quick recharge', 'Balance check', 'Transaction history', 'Auto-recharge'],
      color: 'bg-orange-500'
    },
    {
      id: 'maintenance',
      title: 'Vehicle Maintenance',
      icon: <Wrench className="h-6 w-6" />,
      description: 'Schedule and track vehicle maintenance services',
      features: ['Service booking', 'Reminder alerts', 'Service history', 'Quality assured'],
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Parking Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your one-stop solution for smart parking, traffic management, and vehicle services in Indore
            </p>
          </div>

          {/* Service Cards Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service) => (
              <Card 
                key={service.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveTab(service.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${service.color} text-white`}>
                      {service.icon}
                    </div>
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant={activeTab === service.id ? "default" : "outline"}
                    onClick={() => setActiveTab(service.id)}
                  >
                    {activeTab === service.id ? 'Currently Active' : 'Access Service'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Service Interface */}
          <Card className="mb-12">
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
                  <TabsTrigger value="parking" className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span className="hidden sm:inline">Parking</span>
                  </TabsTrigger>
                  <TabsTrigger value="challan" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden sm:inline">Challan</span>
                  </TabsTrigger>
                  <TabsTrigger value="ev-stations" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="hidden sm:inline">EV Stations</span>
                  </TabsTrigger>
                  <TabsTrigger value="valet" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Valet</span>
                  </TabsTrigger>
                  <TabsTrigger value="fastag" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">FASTag</span>
                  </TabsTrigger>
                  <TabsTrigger value="maintenance" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span className="hidden sm:inline">Maintenance</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="parking" className="mt-6">
                  <RealTimeParkingBooking />
                </TabsContent>

                <TabsContent value="challan" className="mt-6">
                  <ChallanChecker />
                </TabsContent>

                <TabsContent value="ev-stations" className="mt-6">
                  <EVStationFinder />
                </TabsContent>

                <TabsContent value="valet" className="mt-6">
                  <ValetService />
                </TabsContent>

                <TabsContent value="fastag" className="mt-6">
                  <FASTagServices />
                </TabsContent>

                <TabsContent value="maintenance" className="mt-6">
                  <VehicleMaintenance />
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          {/* Statistics and Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">Parking Slots</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">EV Charging Points</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Service Available</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}