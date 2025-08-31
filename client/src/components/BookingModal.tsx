import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { mapplsService } from '@/lib/mappls';
import { apiRequest } from '@/lib/queryClient';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const { addPoints } = useWallet();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'select' | 'form' | 'confirmation'>('select');
  const [bookingType, setBookingType] = useState<'pre' | 'quick'>('pre');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    vehicleNumber: '',
    bookingTime: '',
    duration: '1'
  });

  const parkingLocations = [
    { id: 'c21-mall', name: 'C21 Mall Indore', available: 12, price: 20 },
    { id: 'treasure-island', name: 'Treasure Island Mall', available: 3, price: 25 },
    { id: 'orbit-mall', name: 'Orbit Mall', available: 0, price: 30 }
  ];

  const handleBookingTypeSelect = (type: 'pre' | 'quick') => {
    setBookingType(type);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.vehicleNumber || !selectedLocation) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (bookingType === 'pre' && !formData.bookingTime) {
      toast({
        title: "Error",
        description: "Please select booking time for pre-booking",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        vehicleNumber: formData.vehicleNumber,
        location: selectedLocation,
        bookingTime: bookingType === 'pre' ? new Date(formData.bookingTime) : new Date(),
        duration: parseInt(formData.duration) * 60, // Convert hours to minutes
        isPreBooked: bookingType === 'pre',
        pointsEarned: bookingType === 'pre' ? 50 : 30
      };

      await apiRequest('POST', '/api/bookings', bookingData);
      
      // Add points based on booking type
      addPoints(bookingData.pointsEarned, bookingType === 'pre' ? 'Pre-slot booking' : 'Quick booking');
      
      setStep('confirmation');
      
      toast({
        title: "Booking Confirmed!",
        description: `Your ${bookingType === 'pre' ? 'pre-booking' : 'quick booking'} has been confirmed`,
      });

      // Get directions if available
      try {
        const userLocation = await mapplsService.getCurrentLocation();
        const destination = { lat: 22.7196, lng: 75.8577 }; // Default to C21 Mall
        await mapplsService.getDirections(userLocation, destination);
      } catch (error) {
        console.warn('Could not get directions:', error);
      }

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep('select');
    setBookingType('pre');
    setSelectedLocation('');
    setFormData({ name: '', vehicleNumber: '', bookingTime: '', duration: '1' });
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-parking text-blue-600 text-2xl"></i>
            </div>
            {step === 'select' && <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Parking Spot</h3>}
            {step === 'form' && <h3 className="text-2xl font-bold text-gray-900 mb-2">{bookingType === 'pre' ? 'Pre-Book' : 'Quick Book'} Parking</h3>}
            {step === 'confirmation' && <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h3>}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {step === 'select' && 'Choose your preferred booking type to secure your parking spot'}
            {step === 'form' && 'Complete your booking details to reserve your parking space'}
            {step === 'confirmation' && 'Your parking spot has been successfully reserved'}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            <Button
              onClick={() => handleBookingTypeSelect('pre')}
              className="w-full p-6 h-auto bg-blue-50 hover:bg-blue-100 text-gray-900 border-2 border-blue-200 rounded-lg"
              variant="outline"
              data-testid="button-pre-booking"
            >
              <div className="text-center">
                <i className="fas fa-calendar-check text-blue-600 text-2xl mb-2"></i>
                <div className="font-semibold">Pre-Slot Booking</div>
                <div className="text-sm text-gray-600">Book in advance • Earn 50 points</div>
              </div>
            </Button>

            <Button
              onClick={() => handleBookingTypeSelect('quick')}
              className="w-full p-6 h-auto bg-green-50 hover:bg-green-100 text-gray-900 border-2 border-green-200 rounded-lg"
              variant="outline"
              data-testid="button-quick-booking"
            >
              <div className="text-center">
                <i className="fas fa-bolt text-green-600 text-2xl mb-2"></i>
                <div className="font-semibold">Quick Booking</div>
                <div className="text-sm text-gray-600">Immediate parking • Earn 30 points</div>
              </div>
            </Button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Your Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                data-testid="input-booking-name"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</Label>
              <Input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                placeholder="e.g., MP09AB1234"
                data-testid="input-booking-vehicle"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Parking Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger data-testid="select-location">
                  <SelectValue placeholder="Select parking location" />
                </SelectTrigger>
                <SelectContent>
                  {parkingLocations.map((location) => (
                    <SelectItem 
                      key={location.id} 
                      value={location.name}
                      disabled={location.available === 0}
                    >
                      {location.name} - {location.available > 0 ? `${location.available} slots` : 'Full'} (₹{location.price}/hr)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {bookingType === 'pre' && (
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Booking Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.bookingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, bookingTime: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                  data-testid="input-booking-time"
                />
              </div>
            )}

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours)</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger data-testid="select-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hour</SelectItem>
                  <SelectItem value="2">2 Hours</SelectItem>
                  <SelectItem value="3">3 Hours</SelectItem>
                  <SelectItem value="4">4 Hours</SelectItem>
                  <SelectItem value="8">8 Hours</SelectItem>
                  <SelectItem value="24">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1"
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                data-testid="button-confirm-booking"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        )}

        {step === 'confirmation' && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-check text-green-600 text-3xl"></i>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Booking Confirmed!</h4>
              <p className="text-gray-600 mb-4">
                Your parking spot has been reserved at {selectedLocation}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{formData.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formData.duration} hour(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Points Earned:</span>
                  <span className="font-medium text-green-600">+{bookingType === 'pre' ? 50 : 30}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-green-600 text-white hover:bg-green-700"
              data-testid="button-close-confirmation"
            >
              Great! Get Directions
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
