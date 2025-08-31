import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertCircle, Wrench, Battery, Car, Droplets } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ServiceRecord {
  id: string;
  type: 'Oil Change' | 'Battery Service' | 'Car Wash' | 'General Service';
  status: 'completed' | 'scheduled' | 'pending';
  date: string;
  time: string;
  location: string;
  cost: number;
}

const generateRandomServices = (): ServiceRecord[] => {
  const services = [
    { type: 'Oil Change' as const, cost: 800 },
    { type: 'Battery Service' as const, cost: 1200 },
    { type: 'Car Wash' as const, cost: 300 },
    { type: 'General Service' as const, cost: 2500 }
  ];

  const statuses = ['completed', 'scheduled', 'pending'] as const;
  const locations = ['Parking Zone A', 'Mall Parking B3', 'Office Complex C1', 'Airport Terminal 2'];
  
  return services.map((service, index) => {
    const randomDays = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
    const date = new Date();
    date.setDate(date.getDate() + randomDays);
    
    return {
      id: `service-${index}-${Date.now()}`,
      type: service.type,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: `${Math.floor(Math.random() * 12) + 1}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      cost: service.cost + Math.floor(Math.random() * 200) - 100
    };
  });
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);

  useEffect(() => {
    // Generate new dummy data on every visit for real-time effect
    setServices(generateRandomServices());
  }, []);

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'Oil Change': return <Droplets className="h-5 w-5" />;
      case 'Battery Service': return <Battery className="h-5 w-5" />;
      case 'Car Wash': return <Car className="h-5 w-5" />;
      case 'General Service': return <Wrench className="h-5 w-5" />;
      default: return <Wrench className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Car & Bike Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete vehicle services at your parking location. Track your service history and schedule new appointments.
            </p>
          </div>

          {/* Service Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Oil Change</h3>
                <p className="text-gray-600 text-sm mb-4">Engine oil & filter replacement</p>
                <Button size="sm" data-testid="button-book-oil-change">Book Now</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Battery className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Battery Service</h3>
                <p className="text-gray-600 text-sm mb-4">Battery check & replacement</p>
                <Button size="sm" data-testid="button-book-battery">Book Now</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">General Service</h3>
                <p className="text-gray-600 text-sm mb-4">Complete vehicle checkup</p>
                <Button size="sm" data-testid="button-book-service">Book Now</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Car Wash</h3>
                <p className="text-gray-600 text-sm mb-4">Interior & exterior cleaning</p>
                <Button size="sm" data-testid="button-book-wash">Book Now</Button>
              </CardContent>
            </Card>
          </div>

          {/* Service History Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Service History Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    data-testid={`service-record-${service.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getServiceIcon(service.type)}
                        <span className="font-medium">{service.type}</span>
                      </div>
                      
                      <Badge className={getStatusColor(service.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(service.status)}
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </span>
                      </Badge>
                    </div>

                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3 w-3" />
                        {service.date} at {service.time}
                      </div>
                      <div className="font-medium text-gray-900">
                        ₹{service.cost.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {service.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Quick Service Booking</h3>
                <p className="text-gray-600 mb-4">
                  Book your next service appointment and get it done right at your parking spot.
                </p>
                <Button className="w-full md:w-auto" data-testid="button-book-new-service">
                  Schedule New Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}