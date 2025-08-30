import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';
import BookingModal from '@/components/BookingModal';

export default function Hero() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
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

    // Mock challan check
    const mockChallans = [
      { amount: 500, reason: "Over speeding", date: "2024-01-15", location: "MG Road, Indore" },
      { amount: 300, reason: "No parking", date: "2024-01-10", location: "AB Road, Indore" }
    ];

    toast({
      title: "Challan Found",
      description: `Found ${mockChallans.length} pending challans worth ₹${mockChallans.reduce((sum, c) => sum + c.amount, 0)}`,
    });
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

    // Mock vehicle details fetch
    toast({
      title: "Vehicle Details",
      description: `Owner: Rahul Sharma, Location: C21 Mall Parking, Status: Active`,
    });
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
                    Check Challan
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
    </>
  );
}
