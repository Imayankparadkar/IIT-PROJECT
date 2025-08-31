import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { mapplsService } from '@/lib/mappls';
import AuthModal from './AuthModal';
import VehicleDetails from './VehicleDetails';
import RealTimeParkingBooking from './RealTimeParkingBooking';

export default function ServicesSection() {
  const { user } = useAuth();
  const { addPoints } = useWallet();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    vehicleNumber: '',
    bookingTime: ''
  });

  const handlePreBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!bookingForm.name || !bookingForm.vehicleNumber || !bookingForm.bookingTime) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate booking process
      addPoints(50, 'Pre-slot booking');
      
      toast({
        title: "Booking Confirmed!",
        description: `Slot booked for ${bookingForm.name} at C21 Mall. Directions sent to your phone.`,
      });

      // Get directions using Mappls
      const userLocation = await mapplsService.getCurrentLocation();
      const destination = { lat: 22.7196, lng: 75.8577 }; // C21 Mall coordinates
      
      setBookingForm({ name: '', vehicleNumber: '', bookingTime: '' });
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const handleQuickBooking = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Find nearest available parking
    try {
      const userLocation = await mapplsService.getCurrentLocation();
      const nearbySpots = await mapplsService.findNearbyParking(userLocation);
      const availableSpot = nearbySpots.find(spot => spot.availableSlots > 0);

      if (availableSpot) {
        addPoints(30, 'Quick booking');
        toast({
          title: "Spot Found!",
          description: `Available at ${availableSpot.name} - ${availableSpot.distance}`,
        });
      } else {
        toast({
          title: "No Available Spots",
          description: "All nearby parking spots are full. Try pre-booking for later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Quick booking error:', error);
    }
  };

  const findEVStations = async () => {
    try {
      const userLocation = await mapplsService.getCurrentLocation();
      const evStations = await mapplsService.findNearbyEVStations(userLocation);
      
      toast({
        title: "EV Stations Found",
        description: `Found ${evStations.length} charging stations nearby`,
      });
    } catch (error) {
      console.error('EV station search error:', error);
    }
  };

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Do More with Park Sarthi</h2>
            <p className="text-xl text-gray-600">Complete parking solutions with gamified rewards</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pre-Slot Booking */}
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-calendar-check text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Pre-Slot Booking</h3>
                <p className="text-gray-600 mb-4">Book your parking spot in advance with visual directions</p>
                
                <form onSubmit={handlePreBooking} className="space-y-3">
                  <Input 
                    type="text" 
                    placeholder="Your Name"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                    data-testid="input-booking-name"
                  />
                  <Input 
                    type="text" 
                    placeholder="Vehicle Number"
                    value={bookingForm.vehicleNumber}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                    data-testid="input-booking-vehicle"
                  />
                  <Input 
                    type="datetime-local"
                    value={bookingForm.bookingTime}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, bookingTime: e.target.value }))}
                    data-testid="input-booking-time"
                  />
                  <Button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    data-testid="button-book-slot"
                  >
                    Book & Get Directions
                  </Button>
                </form>
                
                <div className="mt-3 text-sm text-green-600 flex items-center">
                  <i className="fas fa-gift mr-1"></i>
                  Earn 50 points for each booking!
                </div>
              </CardContent>
            </Card>
            
            {/* On-Time Booking with Real-Time Updates */}
            <Card className="card-hover md:col-span-2 lg:col-span-3">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-bolt text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Real-Time Parking Booking</h3>
                    <p className="text-gray-600">Live slot availability with instant booking and navigation</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live Updates</span>
                  </div>
                </div>
                
                <RealTimeParkingBooking />
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <i className="fas fa-gift"></i>
                    <span className="text-sm font-medium">Earn 30 points for each real-time booking!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Car & Bike Services */}
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-tools text-purple-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Car & Bike Services</h3>
                <p className="text-gray-600 mb-4">Complete vehicle services at your parking location</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-purple-50 rounded" data-testid="service-oil">
                    <i className="fas fa-oil-can text-purple-600"></i>
                    <div className="text-xs mt-1">Oil Change</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded" data-testid="service-battery">
                    <i className="fas fa-car-battery text-purple-600"></i>
                    <div className="text-xs mt-1">Battery</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded" data-testid="service-repair">
                    <i className="fas fa-cog text-purple-600"></i>
                    <div className="text-xs mt-1">Service</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded" data-testid="service-wash">
                    <i className="fas fa-spray-can text-purple-600"></i>
                    <div className="text-xs mt-1">Wash</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  data-testid="button-book-service"
                >
                  Book Service
                </Button>
              </CardContent>
            </Card>
            
            {/* Documents Saving */}
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-shield-alt text-yellow-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Document Storage</h3>
                <p className="text-gray-600 mb-4">Store License, RC, PUC certificates securely</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded" data-testid="doc-license">
                    <span className="text-sm">Driving License</span>
                    <i className="fas fa-check-circle text-green-500"></i>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded" data-testid="doc-rc">
                    <span className="text-sm">RC Certificate</span>
                    <i className="fas fa-check-circle text-green-500"></i>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded" data-testid="doc-puc">
                    <span className="text-sm">PUC Certificate</span>
                    <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  data-testid="button-manage-docs"
                >
                  Manage Documents
                </Button>
              </CardContent>
            </Card>
            
            {/* EV Station Finder */}
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-charging-station text-green-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">EV Station Finder</h3>
                <p className="text-gray-600 mb-4">Find nearest charging stations in real-time</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded" data-testid="ev-tata">
                    <div>
                      <div className="text-sm font-medium">Tata Power - 0.5 km</div>
                      <div className="text-xs text-gray-500">4 ports available</div>
                    </div>
                    <div className="text-green-600 text-xs">₹8/kWh</div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded" data-testid="ev-bpcl">
                    <div>
                      <div className="text-sm font-medium">BPCL - 1.2 km</div>
                      <div className="text-xs text-gray-500">2 ports available</div>
                    </div>
                    <div className="text-green-600 text-xs">₹7/kWh</div>
                  </div>
                </div>
                
                <Button 
                  onClick={findEVStations}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  data-testid="button-navigate-ev"
                >
                  Navigate to Station
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="login"
      />

      <Dialog open={showVehicleDetailsModal} onOpenChange={setShowVehicleDetailsModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vehicle Details & Information Lookup</DialogTitle>
            <DialogDescription>Check vehicle registration details, insurance status, and traffic challans</DialogDescription>
          </DialogHeader>
          <VehicleDetails 
            showInModal={true}
            onDataFetched={(data) => {
              toast({
                title: "Vehicle Details Found",
                description: `${data.ownerName}'s ${data.model} - ${data.pendingChallans.length} challan(s) pending`,
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
