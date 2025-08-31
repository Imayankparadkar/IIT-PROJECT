import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Car, Clock, MapPin, Calendar, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { emailService } from '@/lib/emailjs';

interface ValetBooking {
  userId: string;
  destination: string;
  pickupTime: string;
  status: 'requested' | 'confirmed' | 'in-progress' | 'completed';
  createdAt: any;
  notes?: string;
  phoneNumber?: string;
}

export default function ValetService() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<Partial<ValetBooking>>({});

  const [formData, setFormData] = useState({
    destination: '',
    pickupTime: '',
    notes: '',
    phoneNumber: ''
  });

  const savedAddresses = [
    'C21 Mall Indore',
    'Treasure Island Mall',
    'DB City Mall',
    'Phoenix Citadel Mall',
    'Orbit Mall',
    'Vijay Nagar Square',
    'Palasia Square',
    'Indore Railway Station',
    'Devi Ahilya Bai Holkar Airport'
  ];

  const handleBookValet = async () => {
    if (!user) {
      alert('Please sign in to book valet service');
      return;
    }

    if (!formData.destination || !formData.pickupTime) {
      alert('Please fill in all required fields');
      return;
    }

    setIsBooking(true);

    try {
      const booking: ValetBooking = {
        userId: user.uid,
        destination: formData.destination,
        pickupTime: formData.pickupTime,
        status: 'requested',
        createdAt: serverTimestamp(),
        notes: formData.notes,
        phoneNumber: formData.phoneNumber
      };

      const docRef = await addDoc(collection(db, 'valetBookings'), booking);
      
      setBookingData({
        ...booking
      });

      // Send email confirmations
      if (user.email) {
        try {
          await emailService.sendValetConfirmation(
            user.email,
            user.displayName || 'Customer',
            formData.destination,
            formatDateTime(formData.pickupTime),
            docRef.id
          );
          
          await emailService.sendAdminNotification(
            'Valet Service',
            user.email,
            `Destination: ${formData.destination}\nPickup Time: ${formatDateTime(formData.pickupTime)}\nNotes: ${formData.notes}`
          );
        } catch (error) {
          console.error('Failed to send email confirmations:', error);
        }
      }

      // Reset form
      setFormData({
        destination: '',
        pickupTime: '',
        notes: '',
        phoneNumber: ''
      });

      setIsOpen(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error booking valet service:', error);
      alert('Failed to book valet service. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Premium Valet Service</h3>
              <p className="text-sm text-white/80">Professional valet parking and car care</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span className="text-sm ml-1">5.0</span>
              </div>
              <span className="text-sm">500+ bookings</span>
            </div>
          </div>
          
          <ul className="text-sm space-y-1 mb-4 text-white/90">
            <li>• Professional valet parking</li>
            <li>• Car washing & basic maintenance</li>
            <li>• 24/7 availability</li>
            <li>• Insured & verified valets</li>
          </ul>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                Book Valet Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Car className="w-5 h-5 text-purple-600" />
                  <span>Book Premium Valet Service</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="destination" className="text-sm font-medium">
                    Where do you want to go? *
                  </Label>
                  <Select value={formData.destination} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, destination: value }))
                  }>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select destination or enter custom address" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedAddresses.map((address) => (
                        <SelectItem key={address} value={address}>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{address}</span>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>Enter custom address</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {formData.destination === 'custom' && (
                    <Input
                      placeholder="Enter your destination address"
                      className="mt-2"
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="pickup-time" className="text-sm font-medium">
                    Pickup Time *
                  </Label>
                  <Input
                    id="pickup-time"
                    type="datetime-local"
                    value={formData.pickupTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, pickupTime: e.target.value }))}
                    className="mt-1"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or instructions for the valet..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Service Details:</p>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>• Valet will arrive 15 minutes before pickup time</li>
                        <li>• Service includes basic car wash (₹50 extra)</li>
                        <li>• Estimated cost: ₹200-400 based on distance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleBookValet}
                  disabled={isBooking || !formData.destination || !formData.pickupTime}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isBooking ? 'Booking...' : 'Book Valet Service'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Booking Confirmed!</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 mb-3">
                A valet representative from our office will contact you soon.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium">{bookingData.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup Time:</span>
                  <span className="font-medium">
                    {bookingData.pickupTime && formatDateTime(bookingData.pickupTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-orange-600">Requested</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• You will receive SMS/call confirmation within 30 minutes</p>
              <p>• Our valet will arrive 15 minutes before scheduled time</p>
              <p>• For urgent changes, call: +91 98765 43210</p>
            </div>

            <Button 
              onClick={() => setShowConfirmation(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}