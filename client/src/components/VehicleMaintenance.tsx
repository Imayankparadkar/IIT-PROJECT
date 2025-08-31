import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, Calendar, Clock, CheckCircle, AlertCircle, Car, Droplets, Battery, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

interface MaintenanceService {
  id?: string;
  userId: string;
  serviceType: 'Oil Change' | 'Battery Check' | 'Car Wash' | 'Tire Rotation' | 'Brake Inspection' | 'AC Service' | 'General Checkup';
  scheduledAt: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: any;
  completedAt?: any;
  cost?: number;
  serviceProvider?: string;
}

const serviceTypes = [
  { value: 'Oil Change', label: 'Oil Change', icon: Droplets, price: '₹800-1200', duration: '30 min' },
  { value: 'Battery Check', label: 'Battery Check', icon: Battery, price: '₹200-500', duration: '15 min' },
  { value: 'Car Wash', label: 'Car Wash', icon: Sparkles, price: '₹150-300', duration: '20 min' },
  { value: 'Tire Rotation', label: 'Tire Rotation', icon: Car, price: '₹400-600', duration: '25 min' },
  { value: 'Brake Inspection', label: 'Brake Inspection', icon: AlertCircle, price: '₹300-800', duration: '20 min' },
  { value: 'AC Service', label: 'AC Service', icon: Wrench, price: '₹1000-2000', duration: '45 min' },
  { value: 'General Checkup', label: 'General Checkup', icon: CheckCircle, price: '₹500-1000', duration: '60 min' }
];

export default function VehicleMaintenance() {
  const { user } = useAuth();
  const [services, setServices] = useState<MaintenanceService[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  const [formData, setFormData] = useState({
    serviceType: '',
    scheduledAt: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadServices();
    }
  }, [user]);

  const loadServices = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'vehicleServices'),
        where('userId', '==', user.uid),
        orderBy('scheduledAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const serviceList: MaintenanceService[] = [];
      
      querySnapshot.forEach((doc) => {
        serviceList.push({ id: doc.id, ...doc.data() } as MaintenanceService);
      });

      setServices(serviceList);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleScheduleService = async () => {
    if (!user || !formData.serviceType || !formData.scheduledAt) {
      alert('Please fill in all required fields');
      return;
    }

    setIsBooking(true);

    try {
      const service: Omit<MaintenanceService, 'id'> = {
        userId: user.uid,
        serviceType: formData.serviceType as MaintenanceService['serviceType'],
        scheduledAt: formData.scheduledAt,
        status: 'scheduled',
        notes: formData.notes,
        createdAt: serverTimestamp(),
        serviceProvider: 'Park Sarthi Service Center'
      };

      await addDoc(collection(db, 'vehicleServices'), service);
      
      // Reset form
      setFormData({
        serviceType: '',
        scheduledAt: '',
        notes: ''
      });

      setIsOpen(false);
      loadServices(); // Reload services
      
      alert('Service scheduled successfully! You will receive confirmation shortly.');
    } catch (error) {
      console.error('Error scheduling service:', error);
      alert('Failed to schedule service. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service ? service.icon : Wrench;
  };

  const filterServices = (status: string) => {
    const now = new Date();
    return services.filter(service => {
      const serviceDate = new Date(service.scheduledAt);
      
      switch (status) {
        case 'upcoming':
          return service.status === 'scheduled' && serviceDate >= now;
        case 'past':
          return service.status === 'completed' || serviceDate < now;
        default:
          return true;
      }
    });
  };

  return (
    <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Vehicle Maintenance</h3>
            <p className="text-sm text-white/80">Schedule and track your vehicle services</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule Vehicle Service</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service-type">Service Type *</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, serviceType: value }))
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => {
                        const IconComponent = service.icon;
                        return (
                          <SelectItem key={service.value} value={service.value}>
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4" />
                              <div>
                                <span className="font-medium">{service.label}</span>
                                <div className="text-xs text-gray-500">
                                  {service.price} • {service.duration}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scheduled-time">Preferred Date & Time *</Label>
                  <Input
                    id="scheduled-time"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    className="mt-1"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Special Instructions</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific issues or requests..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
                    <div className="text-sm text-orange-700">
                      <p className="font-medium">Service Information:</p>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>• Professional certified technicians</li>
                        <li>• Genuine parts and quality service</li>
                        <li>• Pickup and drop-off available</li>
                        <li>• 30-day service warranty</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleScheduleService}
                  disabled={isBooking || !formData.serviceType || !formData.scheduledAt}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isBooking ? 'Scheduling...' : 'Schedule Service'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-orange-600 border-white/30 hover:bg-white/10">
                <CheckCircle className="w-4 h-4 mr-2" />
                My Services
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>My Vehicle Services</DialogTitle>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past Services</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-3">
                  {filterServices('upcoming').length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No upcoming services</p>
                  ) : (
                    filterServices('upcoming').map((service) => {
                      const IconComponent = getServiceIcon(service.serviceType);
                      return (
                        <div key={service.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <IconComponent className="w-5 h-5 text-orange-600" />
                              <div>
                                <h4 className="font-medium">{service.serviceType}</h4>
                                <p className="text-sm text-gray-500">
                                  {formatDateTime(service.scheduledAt)}
                                </p>
                                {service.notes && (
                                  <p className="text-xs text-gray-400 mt-1">{service.notes}</p>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-3">
                  {filterServices('past').length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No past services</p>
                  ) : (
                    filterServices('past').map((service) => {
                      const IconComponent = getServiceIcon(service.serviceType);
                      return (
                        <div key={service.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <IconComponent className="w-5 h-5 text-gray-600" />
                              <div>
                                <h4 className="font-medium">{service.serviceType}</h4>
                                <p className="text-sm text-gray-500">
                                  {formatDateTime(service.scheduledAt)}
                                </p>
                                {service.cost && (
                                  <p className="text-sm font-medium text-green-600">₹{service.cost}</p>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-bold">{filterServices('upcoming').length}</p>
              <p className="text-xs text-white/80">Upcoming</p>
            </div>
            <div>
              <p className="text-lg font-bold">{filterServices('past').filter(s => s.status === 'completed').length}</p>
              <p className="text-xs text-white/80">Completed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}