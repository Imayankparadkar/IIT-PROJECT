import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';
import BookingModal from '@/components/BookingModal';
import VehicleDetails from '@/components/VehicleDetails';

export default function Hero() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);
  const [challanVehicle, setChallanVehicle] = useState('');
  const [vehicleNumberFetch, setVehicleNumberFetch] = useState('');

  const handleChallanCheck = async () => {
    if (!challanVehicle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a vehicle number",
        variant: "destructive",
      });
      return;
    }

    // Open detailed vehicle lookup modal
    setShowVehicleDetailsModal(true);
  };

  const handleVehicleDetails = async () => {
    if (!vehicleNumberFetch.trim()) {
      toast({
        title: "Error",
        description: "Please enter a vehicle number",
        variant: "destructive",
      });
      return;
    }

    // Open detailed vehicle lookup modal
    setShowVehicleDetailsModal(true);
  };

  const handleGetStarted = () => {
    if (user) {
      setShowBookingModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section className="pt-20 pb-16 gradient-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Your Spot, <br />
                <span className="text-yellow-300">Just a Tap Away</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">Making parking simpler, faster, and stress-free</p>
              
              {/* Gamification Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold" data-testid="stat-users">50K+</div>
                  <div className="text-sm text-blue-200">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" data-testid="stat-bookings">1M+</div>
                  <div className="text-sm text-blue-200">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" data-testid="stat-locations">500+</div>
                  <div className="text-sm text-blue-200">Locations</div>
                </div>
              </div>
              
              <Button 
                onClick={handleGetStarted}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center"
                data-testid="button-get-started"
              >
                <i className="fas fa-mobile-alt mr-2"></i>
                Get Started
              </Button>
            </div>
            
            {/* Right Content - Quick Actions */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 card-hover">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <i className="fas fa-search mr-2"></i>
                  Challan Findings
                </h3>
                <div className="space-y-3">
                  <Input 
                    type="text" 
                    placeholder="Enter Vehicle Number" 
                    value={challanVehicle}
                    onChange={(e) => setChallanVehicle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30"
                    data-testid="input-challan-vehicle"
                  />
                  <Button 
                    onClick={handleChallanCheck}
                    className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                    data-testid="button-check-challan"
                  >
                    Get Details & Location
                  </Button>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 card-hover">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Vehicle No. → Name Fetch
                </h3>
                <div className="space-y-3">
                  <Input 
                    type="text" 
                    placeholder="Enter Vehicle Number" 
                    value={vehicleNumberFetch}
                    onChange={(e) => setVehicleNumberFetch(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30"
                    data-testid="input-vehicle-details"
                  />
                  <Button 
                    onClick={handleVehicleDetails}
                    className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-400 transition-colors"
                    data-testid="button-get-vehicle-details"
                  >
                    Get Details & Location
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="login"
      />

      <BookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

      <Dialog open={showVehicleDetailsModal} onOpenChange={setShowVehicleDetailsModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vehicle Details & Challan Information</DialogTitle>
            <DialogDescription>Access comprehensive vehicle information and outstanding traffic challans</DialogDescription>
          </DialogHeader>
          <VehicleDetails 
            showInModal={true}
            onDataFetched={(data) => {
              toast({
                title: "Vehicle Information Retrieved",
                description: `Found details for ${data.ownerName}'s ${data.vehicleNumber}`,
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
