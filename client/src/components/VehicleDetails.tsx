import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Car, MapPin, AlertTriangle, User, CreditCard, Clock } from 'lucide-react';

interface VehicleData {
  vehicleNumber: string;
  ownerName: string;
  model: string;
  fuelType: string;
  registrationDate: string;
  insuranceExpiry: string;
  pucExpiry: string;
  pendingChallans: {
    id: string;
    amount: number;
    reason: string;
    date: string;
    location: string;
    status: 'pending' | 'paid';
  }[];
  totalChallanAmount: number;
  currentLocation?: string;
  parkingHistory: {
    location: string;
    date: string;
    duration: string;
    amount: number;
  }[];
}

interface VehicleDetailsProps {
  showInModal?: boolean;
  onDataFetched?: (data: VehicleData) => void;
}

export default function VehicleDetails({ showInModal = false, onDataFetched }: VehicleDetailsProps) {
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced dummy data with realistic Indian vehicle information
  const dummyVehicleData: Record<string, VehicleData> = {
    'MH12AB1234': {
      vehicleNumber: 'MH12AB1234',
      ownerName: 'John Doe',
      model: 'Maruti Swift VDI',
      fuelType: 'Diesel',
      registrationDate: '15-Mar-2020',
      insuranceExpiry: '14-Mar-2025',
      pucExpiry: '28-Feb-2025',
      pendingChallans: [
        {
          id: 'CH001',
          amount: 500,
          reason: 'Over speeding (40 kmph in 30 zone)',
          date: '15-Jan-2024',
          location: 'MG Road, Indore',
          status: 'pending'
        }
      ],
      totalChallanAmount: 500,
      currentLocation: 'C21 Mall Parking, Level 2, Slot A-25',
      parkingHistory: [
        { location: 'C21 Mall', date: '20-Jan-2024', duration: '2h 30m', amount: 50 },
        { location: 'Treasure Island Mall', date: '18-Jan-2024', duration: '1h 45m', amount: 35 },
        { location: 'Phoenix Mall', date: '15-Jan-2024', duration: '3h 15m', amount: 65 }
      ]
    },
    'MH14CD5678': {
      vehicleNumber: 'MH14CD5678',
      ownerName: 'Jane Smith',
      model: 'Honda City iVTEC',
      fuelType: 'Petrol',
      registrationDate: '22-Aug-2019',
      insuranceExpiry: '21-Aug-2024',
      pucExpiry: '15-Dec-2024',
      pendingChallans: [
        {
          id: 'CH002',
          amount: 1000,
          reason: 'No parking zone violation',
          date: '10-Jan-2024',
          location: 'AB Road, Indore',
          status: 'pending'
        },
        {
          id: 'CH003',
          amount: 200,
          reason: 'Signal jumping',
          date: '08-Jan-2024',
          location: 'Palasia Square, Indore',
          status: 'pending'
        }
      ],
      totalChallanAmount: 1200,
      currentLocation: 'Orbit Mall Parking, Ground Floor, Slot B-12',
      parkingHistory: [
        { location: 'Orbit Mall', date: '19-Jan-2024', duration: '4h 20m', amount: 80 },
        { location: 'Central Mall', date: '17-Jan-2024', duration: '2h 10m', amount: 40 }
      ]
    },
    'GJ01XY9876': {
      vehicleNumber: 'GJ01XY9876',
      ownerName: 'Rajesh Kumar',
      model: 'Hyundai Creta SX',
      fuelType: 'Petrol',
      registrationDate: '10-Nov-2021',
      insuranceExpiry: '09-Nov-2025',
      pucExpiry: '05-Mar-2025',
      pendingChallans: [],
      totalChallanAmount: 0,
      currentLocation: 'Home - Residential Parking',
      parkingHistory: [
        { location: 'Amanora Mall', date: '21-Jan-2024', duration: '1h 55m', amount: 30 },
        { location: 'Phoenix Mall', date: '19-Jan-2024', duration: '2h 40m', amount: 50 }
      ]
    },
    'DL05AB2345': {
      vehicleNumber: 'DL05AB2345',
      ownerName: 'Priya Sharma',
      model: 'Tata Nexon EV',
      fuelType: 'Electric',
      registrationDate: '18-Feb-2022',
      insuranceExpiry: '17-Feb-2027',
      pucExpiry: 'N/A (Electric Vehicle)',
      pendingChallans: [
        {
          id: 'CH004',
          amount: 300,
          reason: 'Wrong lane driving',
          date: '12-Jan-2024',
          location: 'Ring Road, Delhi',
          status: 'pending'
        }
      ],
      totalChallanAmount: 300,
      currentLocation: 'Select City Walk Mall - EV Charging Bay 3',
      parkingHistory: [
        { location: 'Select City Walk', date: '22-Jan-2024', duration: '3h 45m', amount: 0 },
        { location: 'DLF Mall', date: '20-Jan-2024', duration: '2h 20m', amount: 45 }
      ]
    }
  };

  const handleGetDetails = async () => {
    if (!vehicleNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a vehicle number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const upperVehicleNumber = vehicleNumber.toUpperCase().replace(/\s/g, '');
      const data = dummyVehicleData[upperVehicleNumber];
      
      if (data) {
        setVehicleData(data);
        onDataFetched?.(data);
        toast({
          title: "Vehicle Details Retrieved",
          description: `Found details for ${data.ownerName}'s ${data.model}`,
        });
      } else {
        // Generate random data for unknown vehicles
        const randomData: VehicleData = {
          vehicleNumber: upperVehicleNumber,
          ownerName: 'Amit Patel',
          model: 'Maruti Suzuki Alto',
          fuelType: 'Petrol',
          registrationDate: '15-Jun-2018',
          insuranceExpiry: '14-Jun-2025',
          pucExpiry: '28-Mar-2025',
          pendingChallans: [
            {
              id: 'CH005',
              amount: 750,
              reason: 'Parking in no-parking zone',
              date: '25-Jan-2024',
              location: 'Commercial Street, Bangalore',
              status: 'pending'
            }
          ],
          totalChallanAmount: 750,
          currentLocation: 'Forum Mall Parking, Level 1, Slot C-18',
          parkingHistory: [
            { location: 'Forum Mall', date: '23-Jan-2024', duration: '1h 30m', amount: 25 }
          ]
        };
        setVehicleData(randomData);
        onDataFetched?.(randomData);
        toast({
          title: "Vehicle Details Retrieved",
          description: `Found details for ${randomData.ownerName}'s ${randomData.model}`,
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handlePayChallan = (challanId: string) => {
    toast({
      title: "Payment Initiated",
      description: "Redirecting to payment gateway...",
    });
  };

  return (
    <div className={`space-y-6 ${showInModal ? 'max-h-96 overflow-y-auto' : ''}`}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Details Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="vehicleNumber">Vehicle Registration Number</Label>
              <Input
                id="vehicleNumber"
                placeholder="e.g., MH12AB1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                className="mt-1"
                data-testid="input-vehicle-number"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleGetDetails}
                disabled={isLoading}
                className="px-6"
                data-testid="button-get-details"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  'Get Details & Location'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Display */}
      {vehicleData && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Vehicle Number:</span>
                  <span className="font-semibold" data-testid="text-vehicle-number">{vehicleData.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Owner Name:</span>
                  <span className="font-semibold" data-testid="text-owner-name">{vehicleData.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Model:</span>
                  <span>{vehicleData.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Fuel Type:</span>
                  <Badge variant={vehicleData.fuelType === 'Electric' ? 'default' : 'secondary'}>
                    {vehicleData.fuelType}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Registration:</span>
                  <span>{vehicleData.registrationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Insurance Expiry:</span>
                  <span>{vehicleData.insuranceExpiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-muted-foreground">PUC Expiry:</span>
                  <span>{vehicleData.pucExpiry}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Location & Challans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Challans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Current Location:</Label>
                <p className="mt-1 text-sm font-medium" data-testid="text-current-location">
                  {vehicleData.currentLocation}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-muted-foreground">Pending Challans:</Label>
                  <Badge variant={vehicleData.totalChallanAmount > 0 ? 'destructive' : 'default'}>
                    ₹{vehicleData.totalChallanAmount}
                  </Badge>
                </div>
                
                {vehicleData.pendingChallans.length > 0 ? (
                  <div className="space-y-3" data-testid="challans-list">
                    {vehicleData.pendingChallans.map((challan) => (
                      <div key={challan.id} className="p-3 border rounded-lg bg-red-50 dark:bg-red-950">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-red-700 dark:text-red-300">
                              {challan.reason}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {challan.location} • {challan.date}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-sm font-bold text-red-700 dark:text-red-300">
                              ₹{challan.amount}
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePayChallan(challan.id)}
                              className="text-xs"
                            >
                              Pay Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950">
                    <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      No pending challans
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Parking History */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Parking History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vehicleData.parkingHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{entry.location}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.date} • Duration: {entry.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {entry.amount > 0 ? `₹${entry.amount}` : 'Free'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}