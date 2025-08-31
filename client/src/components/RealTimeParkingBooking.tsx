import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { mapplsService, ParkingLocation } from '@/lib/mappls';
import { realtimeDbFunctions } from '@/lib/firebase';
import NavigationModal from './NavigationModal';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Clock, 
  Car, 
  Users, 
  Shield, 
  Zap,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

interface ParkingSlot {
  id: string;
  level: string;
  section: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved';
  vehicleType: 'car' | 'bike' | 'any';
  isAccessible: boolean;
}

interface ParkingMall extends ParkingLocation {
  id: string;
  slots: ParkingSlot[];
  lastUpdated: Date;
  features: string[];
  operatingHours: string;
}

export default function RealTimeParkingBooking() {
  const { user } = useAuth();
  const { addPoints } = useWallet();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMall, setSelectedMall] = useState<ParkingMall | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [showMapDirections, setShowMapDirections] = useState(false);
  const [leavingMessage, setLeavingMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  
  // Mock real-time parking data
  const [parkingMalls, setParkingMalls] = useState<ParkingMall[]>([
    {
      id: 'c21-mall',
      name: 'C21 Mall Indore',
      lat: 22.7196,
      lng: 75.8577,
      availableSlots: 12,
      totalSlots: 100,
      pricePerHour: 20,
      distance: '0.5 km',
      amenities: ['Security', 'CCTV', 'Valet Service'],
      address: 'C21 Mall, AB Road, Indore',
      lastUpdated: new Date(),
      features: ['Food Court', 'Cinema', 'Shopping'],
      operatingHours: '10:00 AM - 10:00 PM',
      slots: Array.from({ length: 100 }, (_, i) => ({
        id: `c21-${i + 1}`,
        level: `Level ${Math.floor(i / 25) + 1}`,
        section: String.fromCharCode(65 + Math.floor((i % 25) / 5)),
        number: String(i + 1).padStart(2, '0'),
        status: i < 12 ? 'available' : Math.random() > 0.3 ? 'occupied' : 'reserved',
        vehicleType: i % 10 === 0 ? 'bike' : 'car',
        isAccessible: i % 15 === 0
      }))
    },
    {
      id: 'treasure-island',
      name: 'Treasure Island Mall',
      lat: 22.7283,
      lng: 75.8641,
      availableSlots: 3,
      totalSlots: 80,
      pricePerHour: 25,
      distance: '1.2 km',
      amenities: ['Security', 'Car Wash', 'Food Court'],
      address: 'Treasure Island Mall, MG Road, Indore',
      lastUpdated: new Date(),
      features: ['Entertainment Zone', 'Brand Stores'],
      operatingHours: '11:00 AM - 11:00 PM',
      slots: Array.from({ length: 80 }, (_, i) => ({
        id: `ti-${i + 1}`,
        level: `Floor ${Math.floor(i / 20) + 1}`,
        section: String.fromCharCode(65 + Math.floor((i % 20) / 4)),
        number: String(i + 1).padStart(2, '0'),
        status: i < 3 ? 'available' : Math.random() > 0.2 ? 'occupied' : 'reserved',
        vehicleType: i % 8 === 0 ? 'bike' : 'car',
        isAccessible: i % 12 === 0
      }))
    },
    {
      id: 'orbit-mall',
      name: 'Orbit Mall',
      lat: 22.7045,
      lng: 75.8732,
      availableSlots: 0,
      totalSlots: 150,
      pricePerHour: 30,
      distance: '2.1 km',
      amenities: ['Security', 'Valet Service', 'Car Service'],
      address: 'Orbit Mall, Ring Road, Indore',
      lastUpdated: new Date(),
      features: ['Multiplex', 'Hypermarket', 'Restaurants'],
      operatingHours: '10:00 AM - 12:00 AM',
      slots: Array.from({ length: 150 }, (_, i) => ({
        id: `orbit-${i + 1}`,
        level: `Level ${Math.floor(i / 30) + 1}`,
        section: String.fromCharCode(65 + Math.floor((i % 30) / 6)),
        number: String(i + 1).padStart(3, '0'),
        status: 'occupied',
        vehicleType: i % 12 === 0 ? 'bike' : 'car',
        isAccessible: i % 18 === 0
      }))
    },
    {
      id: 'phoenix-mall',
      name: 'Phoenix Citadel Mall',
      lat: 22.7156,
      lng: 75.8698,
      availableSlots: 25,
      totalSlots: 120,
      pricePerHour: 22,
      distance: '1.8 km',
      amenities: ['Security', 'EV Charging', 'Valet Service'],
      address: 'Phoenix Citadel Mall, Scheme 54, Indore',
      lastUpdated: new Date(),
      features: ['Premium Brands', 'Dining', 'Entertainment'],
      operatingHours: '10:00 AM - 11:00 PM',
      slots: Array.from({ length: 120 }, (_, i) => ({
        id: `phoenix-${i + 1}`,
        level: `Floor ${Math.floor(i / 24) + 1}`,
        section: String.fromCharCode(65 + Math.floor((i % 24) / 4)),
        number: String(i + 1).padStart(3, '0'),
        status: i < 25 ? 'available' : Math.random() > 0.4 ? 'occupied' : 'reserved',
        vehicleType: i % 10 === 0 ? 'bike' : 'car',
        isAccessible: i % 16 === 0
      }))
    }
  ]);

  // Filter malls based on search query
  const filteredMalls = parkingMalls.filter(mall =>
    mall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (mall.address && mall.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingMalls(prevMalls => 
        prevMalls.map(mall => ({
          ...mall,
          availableSlots: Math.max(0, mall.availableSlots + Math.floor(Math.random() * 3) - 1),
          lastUpdated: new Date()
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (availableSlots: number, totalSlots: number) => {
    const occupancy = 1 - (availableSlots / totalSlots);
    if (occupancy >= 1) return 'bg-red-500';
    if (occupancy >= 0.8) return 'bg-red-400';
    if (occupancy >= 0.6) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const getStatusText = (availableSlots: number) => {
    if (availableSlots === 0) return 'Full';
    if (availableSlots <= 5) return 'Limited';
    return 'Available';
  };

  const handleSlotSelection = (mall: ParkingMall, slot: ParkingSlot) => {
    setSelectedMall(mall);
    setSelectedSlot(slot);
    setShowSlotModal(true);
  };

  const handleBookSlot = async () => {
    if (!user || !selectedMall || !selectedSlot) return;

    setIsBooking(true);

    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update slot status locally
      setParkingMalls(prevMalls =>
        prevMalls.map(mall =>
          mall.id === selectedMall.id
            ? {
                ...mall,
                availableSlots: mall.availableSlots - 1,
                slots: mall.slots.map(slot =>
                  slot.id === selectedSlot.id
                    ? { ...slot, status: 'reserved' as const }
                    : slot
                )
              }
            : mall
        )
      );

      addPoints(30, 'Real-time slot booking');
      
      toast({
        title: "Slot Booked Successfully!",
        description: `${selectedSlot.level}, Section ${selectedSlot.section}-${selectedSlot.number} at ${selectedMall.name}`,
      });

      setShowSlotModal(false);
      setShowNavigationModal(true);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleGetDirections = async () => {
    if (!selectedMall) return;
    setShowMapDirections(true);
  };

  const handleSendLeavingMessage = () => {
    if (!leavingMessage.trim()) return;

    // Simulate sending leaving message
    toast({
      title: "Message Sent",
      description: `Your message "${leavingMessage}" has been sent to update slot availability`,
    });

    // Simulate slot becoming available after delay
    setTimeout(() => {
      if (selectedMall) {
        setParkingMalls(prevMalls =>
          prevMalls.map(mall =>
            mall.id === selectedMall.id
              ? { ...mall, availableSlots: mall.availableSlots + 1 }
              : mall
          )
        );
        
        toast({
          title: "Slot Updated",
          description: "Your slot is now available for others",
        });
      }
    }, 5000);

    setLeavingMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search malls and locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-malls"
        />
      </div>

      {/* Real-time Mall List */}
      <div className="space-y-4">
        {filteredMalls.map((mall) => (
          <Card key={mall.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{mall.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {mall.address}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated {mall.lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(mall.availableSlots, mall.totalSlots)} inline-block mr-2`}></div>
                  <Badge variant={mall.availableSlots > 0 ? 'default' : 'destructive'}>
                    {getStatusText(mall.availableSlots)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available:</span>
                    <span className="font-semibold text-green-600">{mall.availableSlots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-semibold">{mall.totalSlots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-semibold">₹{mall.pricePerHour}/hr</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Distance:</span>
                    <span className="font-semibold">{mall.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hours:</span>
                    <span className="text-xs">{mall.operatingHours}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {mall.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    setSelectedMall(mall);
                    setShowSlotModal(true);
                  }}
                  disabled={mall.availableSlots === 0}
                  className="w-full"
                  data-testid={`button-book-${mall.id}`}
                >
                  <Car className="h-4 w-4 mr-2" />
                  {mall.availableSlots > 0 ? 'Book Slot' : 'Full'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMall(mall);
                    setShowMapDirections(true);
                  }}
                  className="w-full"
                  data-testid={`button-directions-${mall.id}`}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Voice Navigation
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Slot Selection Modal */}
      <Dialog open={showSlotModal} onOpenChange={setShowSlotModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Select Parking Slot - {selectedMall?.name}
            </DialogTitle>
            <DialogDescription>Choose your preferred parking slot from the available options</DialogDescription>
          </DialogHeader>
          
          {selectedMall && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Available Slots */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-3">Available Slots</h3>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                    {selectedMall.slots
                      .filter(slot => slot.status === 'available')
                      .map((slot) => (
                        <Button
                          key={slot.id}
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2 text-xs ${
                            selectedSlot?.id === slot.id ? 'bg-blue-100 border-blue-500' : ''
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-semibold">{slot.section}-{slot.number}</div>
                            <div className="text-xs text-gray-500">{slot.level}</div>
                            {slot.isAccessible && <div className="text-xs text-blue-600">♿</div>}
                          </div>
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Slot Details */}
                <div className="space-y-4">
                  {selectedSlot && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Selected Slot</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="text-sm font-medium">
                            {selectedSlot.level}, {selectedSlot.section}-{selectedSlot.number}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Type:</span>
                          <span className="text-sm font-medium capitalize">{selectedSlot.vehicleType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="text-sm font-medium">₹{selectedMall.pricePerHour}/hr</span>
                        </div>
                        {selectedSlot.isAccessible && (
                          <div className="flex items-center gap-1 text-blue-600 text-sm">
                            <Shield className="h-3 w-3" />
                            Accessible
                          </div>
                        )}
                        
                        <Separator />
                        
                        <Button
                          onClick={handleBookSlot}
                          disabled={isBooking || !user}
                          className="w-full"
                        >
                          {isBooking ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Booking...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Book This Slot
                            </>
                          )}
                        </Button>

                        {!user && (
                          <p className="text-xs text-gray-500 text-center">
                            Please login to book slots
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Leaving Message */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Leaving Soon?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Input
                        placeholder="Leaving in 10 minutes"
                        value={leavingMessage}
                        onChange={(e) => setLeavingMessage(e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={handleSendLeavingMessage}
                        disabled={!leavingMessage.trim()}
                        className="w-full"
                      >
                        Send Update
                      </Button>
                      <p className="text-xs text-gray-500">
                        Help others by updating when you're leaving
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Navigation Modal */}
      <Dialog open={showNavigationModal} onOpenChange={setShowNavigationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Navigation to {selectedMall?.name}
            </DialogTitle>
            <DialogDescription>Your booking is confirmed. Get directions to your reserved parking slot</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600">Slot Booked Successfully!</h3>
              <p className="text-gray-600">Your parking slot has been reserved</p>
            </div>

            {selectedSlot && selectedMall && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedMall.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Slot:</span>
                      <span className="font-medium">
                        {selectedSlot.level}, {selectedSlot.section}-{selectedSlot.number}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{selectedMall.distance}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleGetDirections} className="w-full" data-testid="button-get-navigation">
                <Navigation className="h-4 w-4 mr-2" />
                Start Voice Navigation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNavigationModal(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Navigation Modal with Voice Guidance */}
      {selectedMall && (
        <NavigationModal
          isOpen={showMapDirections}
          onClose={() => setShowMapDirections(false)}
          destination={{
            lat: selectedMall.lat,
            lng: selectedMall.lng,
            address: selectedMall.address
          }}
          destinationName={selectedMall.name}
          slotInfo={selectedSlot ? {
            level: selectedSlot.level,
            section: selectedSlot.section,
            number: selectedSlot.number
          } : undefined}
        />
      )}
    </div>
  );
}