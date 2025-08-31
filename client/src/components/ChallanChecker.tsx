import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { mapplsService } from '@/lib/mappls';
import { 
  Search, 
  AlertTriangle, 
  Car, 
  MapPin, 
  Clock, 
  IndianRupee,
  User,
  FileText,
  Navigation,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface ChallanData {
  vehicleNumber: string;
  ownerName: string;
  pendingAmount: number;
  violations: {
    id: string;
    type: string;
    location: string;
    date: string;
    amount: number;
    status: 'pending' | 'paid';
    coordinates?: { lat: number; lng: number };
  }[];
  vehicleDetails: {
    make: string;
    model: string;
    color: string;
    registrationDate: string;
    lastUpdate: string;
  };
}

const mockChallanData: Record<string, ChallanData> = {
  'MH12AB1234': {
    vehicleNumber: 'MH 12 AB 1234',
    ownerName: 'John Doe',
    pendingAmount: 500,
    violations: [
      {
        id: 'CH001',
        type: 'Over Speeding',
        location: 'AB Road, Indore',
        date: '2024-01-15',
        amount: 300,
        status: 'pending',
        coordinates: { lat: 22.7196, lng: 75.8577 }
      },
      {
        id: 'CH002',
        type: 'Wrong Parking',
        location: 'C21 Mall, Indore',
        date: '2024-01-10',
        amount: 200,
        status: 'pending',
        coordinates: { lat: 22.7196, lng: 75.8577 }
      }
    ],
    vehicleDetails: {
      make: 'Maruti Suzuki',
      model: 'Swift',
      color: 'White',
      registrationDate: '2020-03-15',
      lastUpdate: '2024-01-20'
    }
  },
  'MH14CD5678': {
    vehicleNumber: 'MH 14 CD 5678',
    ownerName: 'Jane Smith',
    pendingAmount: 1000,
    violations: [
      {
        id: 'CH003',
        type: 'Signal Jump',
        location: 'MG Road Signal, Indore',
        date: '2024-01-18',
        amount: 500,
        status: 'pending',
        coordinates: { lat: 22.7283, lng: 75.8641 }
      },
      {
        id: 'CH004',
        type: 'No Helmet',
        location: 'Vijay Nagar, Indore',
        date: '2024-01-12',
        amount: 300,
        status: 'pending',
        coordinates: { lat: 22.7523, lng: 75.8937 }
      },
      {
        id: 'CH005',
        type: 'Triple Riding',
        location: 'Ring Road, Indore',
        date: '2024-01-08',
        amount: 200,
        status: 'pending',
        coordinates: { lat: 22.7045, lng: 75.8732 }
      }
    ],
    vehicleDetails: {
      make: 'Honda',
      model: 'Activa 6G',
      color: 'Black',
      registrationDate: '2021-07-22',
      lastUpdate: '2024-01-19'
    }
  },
  'MP09XY9876': {
    vehicleNumber: 'MP 09 XY 9876',
    ownerName: 'Rajesh Kumar',
    pendingAmount: 0,
    violations: [],
    vehicleDetails: {
      make: 'Hyundai',
      model: 'Creta',
      color: 'Blue',
      registrationDate: '2022-11-30',
      lastUpdate: '2024-01-21'
    }
  }
};

export default function ChallanChecker() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [challanData, setChallanData] = useState<ChallanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const searchChallan = async () => {
    if (!vehicleNumber.trim()) {
      setError('Please enter a vehicle number');
      return;
    }

    setIsLoading(true);
    setError('');
    setChallanData(null);

    // Simulate API call delay
    setTimeout(() => {
      const cleanVehicleNumber = vehicleNumber.replace(/\\s+/g, '').toUpperCase();
      const found = mockChallanData[cleanVehicleNumber];
      
      if (found) {
        setChallanData(found);
        toast({
          title: "Challan Details Found",
          description: `Found ${found.violations.length} violation(s) for ${found.vehicleNumber}`,
        });
      } else {
        setError('No challan records found for this vehicle number');
        toast({
          title: "No Records Found",
          description: "This vehicle has no pending challans",
          variant: "default"
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const openLocationInMaps = async (coordinates: { lat: number; lng: number }, location: string) => {
    try {
      const currentLocation = await mapplsService.getCurrentLocation();
      const mapplsUrl = `https://maps.mapmyindia.com/directions?origin=${currentLocation.lat},${currentLocation.lng}&destination=${coordinates.lat},${coordinates.lng}&mode=driving`;
      window.open(mapplsUrl, '_blank');
      
      toast({
        title: "Opening Navigation",
        description: `Getting directions to ${location}`,
      });
    } catch (error) {
      // Fallback to destination only
      const mapplsUrl = `https://maps.mapmyindia.com/directions?destination=${coordinates.lat},${coordinates.lng}&mode=driving`;
      window.open(mapplsUrl, '_blank');
    }
  };

  const payChallan = (violationId: string, amount: number) => {
    toast({
      title: "Payment Gateway",
      description: `Redirecting to payment gateway for ₹${amount}`,
    });
    // Here you would integrate with actual payment gateway
  };

  const formatVehicleNumber = (number: string) => {
    return number.replace(/(.{2})(.{2})(.{2})(.{4})/, '$1 $2 $3 $4');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Traffic Challan Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Enter vehicle number (e.g., MH12AB1234)"
              value={vehicleNumber}
              onChange={(e) => {
                setVehicleNumber(e.target.value);
                setError('');
              }}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && searchChallan()}
            />
            <Button 
              onClick={searchChallan} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              Check Challan
            </Button>
          </div>
          
          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Sample vehicle numbers to try:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(mockChallanData).map((vehicleNum) => (
                <Badge 
                  key={vehicleNum}
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => setVehicleNumber(formatVehicleNumber(vehicleNum))}
                >
                  {formatVehicleNumber(vehicleNum)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {challanData && (
        <div className="space-y-6">
          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Number:</span>
                    <span className="font-semibold">{challanData.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Owner Name:</span>
                    <span className="font-semibold">{challanData.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Make & Model:</span>
                    <span className="font-semibold">{challanData.vehicleDetails.make} {challanData.vehicleDetails.model}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-semibold">{challanData.vehicleDetails.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Date:</span>
                    <span className="font-semibold">{challanData.vehicleDetails.registrationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-semibold">{challanData.vehicleDetails.lastUpdate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Challan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Challan Summary
                </div>
                {challanData.pendingAmount > 0 ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    ₹{challanData.pendingAmount} Pending
                  </Badge>
                ) : (
                  <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                    <CheckCircle className="h-3 w-3" />
                    No Pending Challans
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {challanData.pendingAmount > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-red-800">Total Pending Amount</p>
                      <p className="text-sm text-red-600">{challanData.violations.length} violation(s) found</p>
                    </div>
                    <div className="text-2xl font-bold text-red-800">
                      ₹{challanData.pendingAmount}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => payChallan('all', challanData.pendingAmount)}
                  >
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Pay All Challans (₹{challanData.pendingAmount})
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-green-800">No Pending Challans</p>
                  <p className="text-green-600">Your vehicle record is clean!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Individual Violations */}
          {challanData.violations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Violation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challanData.violations.map((violation) => (
                    <div key={violation.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="font-semibold">{violation.type}</span>
                          <Badge variant="outline">{violation.id}</Badge>
                        </div>
                        <Badge 
                          variant={violation.status === 'pending' ? 'destructive' : 'default'}
                          className={violation.status === 'paid' ? 'bg-green-600' : ''}
                        >
                          {violation.status === 'pending' ? 'Pending' : 'Paid'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{violation.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{violation.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">₹{violation.amount}</span>
                        </div>
                      </div>
                      
                      {violation.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm"
                            onClick={() => payChallan(violation.id, violation.amount)}
                            className="flex items-center gap-1"
                          >
                            <IndianRupee className="h-3 w-3" />
                            Pay ₹{violation.amount}
                          </Button>
                          
                          {violation.coordinates && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openLocationInMaps(violation.coordinates!, violation.location)}
                              className="flex items-center gap-1"
                            >
                              <Navigation className="h-3 w-3" />
                              Get Directions
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Pay challans within 60 days to avoid additional penalties</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>You can pay online or visit the nearest traffic police station</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Keep payment receipts for future reference</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Unpaid challans may affect vehicle registration renewal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}