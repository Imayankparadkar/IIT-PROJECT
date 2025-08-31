import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Phone, 
  Mail, 
  Car, 
  Edit3, 
  Save, 
  X,
  MapPin,
  Calendar,
  Star,
  Award
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  vehicleNumber: string;
  vehicleModel: string;
  vehicleFuelType: string;
  totalPoints: number;
  level: number;
  servicesBooked: number;
  totalSavings: number;
}

const generateUserProfile = (): UserProfile => {
  const names = ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Gupta', 'Vikash Patel'];
  const vehicles = [
    { number: 'MP 09 AB 1234', model: 'Maruti Swift', fuel: 'Petrol' },
    { number: 'MP 04 CD 5678', model: 'Hyundai Creta', fuel: 'Diesel' },
    { number: 'MP 12 EF 9012', model: 'Tata Nexon EV', fuel: 'Electric' },
    { number: 'MP 07 GH 3456', model: 'Honda City', fuel: 'Petrol' },
  ];

  const addresses = [
    'Vijay Nagar, Indore',
    'Bhopal Road, Indore', 
    'IT Park, Indore',
    'Ring Road, Indore'
  ];

  const selectedVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
  
  return {
    name: names[Math.floor(Math.random() * names.length)],
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    address: addresses[Math.floor(Math.random() * addresses.length)],
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
    vehicleNumber: selectedVehicle.number,
    vehicleModel: selectedVehicle.model,
    vehicleFuelType: selectedVehicle.fuel,
    totalPoints: Math.floor(Math.random() * 2000) + 500,
    level: Math.floor(Math.random() * 5) + 1,
    servicesBooked: Math.floor(Math.random() * 20) + 5,
    totalSavings: Math.floor(Math.random() * 5000) + 1000
  };
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Generate new dummy data on every visit for real-time effect
    const generatedProfile = generateUserProfile();
    setProfile(generatedProfile);
    setEditedProfile(generatedProfile);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      });
    }
  };

  if (!profile || !editedProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
            <p className="text-xl text-gray-600">Manage your personal information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleEdit}
                        data-testid="button-edit-profile"
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancel}
                          data-testid="button-cancel-edit"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSave}
                          data-testid="button-save-profile"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          data-testid="input-name"
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{profile.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          data-testid="input-phone"
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{profile.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        data-testid="input-email"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editedProfile.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        data-testid="input-address"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{profile.address}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                      {isEditing ? (
                        <Input
                          id="vehicleNumber"
                          value={editedProfile.vehicleNumber}
                          onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                          data-testid="input-vehicle-number"
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{profile.vehicleNumber}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="vehicleModel">Vehicle Model</Label>
                      {isEditing ? (
                        <Input
                          id="vehicleModel"
                          value={editedProfile.vehicleModel}
                          onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                          data-testid="input-vehicle-model"
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{profile.vehicleModel}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vehicleFuelType">Fuel Type</Label>
                    {isEditing ? (
                      <Input
                        id="vehicleFuelType"
                        value={editedProfile.vehicleFuelType}
                        onChange={(e) => handleInputChange('vehicleFuelType', e.target.value)}
                        data-testid="input-fuel-type"
                      />
                    ) : (
                      <div className="mt-1">
                        <Badge className={
                          profile.vehicleFuelType === 'Electric' ? 'bg-green-100 text-green-800' :
                          profile.vehicleFuelType === 'Diesel' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {profile.vehicleFuelType}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Account Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Account Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      Level {profile.level}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {profile.totalPoints.toLocaleString()} Points
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(profile.totalPoints % 1000) / 10}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Services Booked</span>
                      <span className="font-medium">{profile.servicesBooked}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Savings</span>
                      <span className="font-medium">₹{profile.totalSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Member Since</span>
                      <span className="font-medium">{profile.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Car className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Service Champion</p>
                        <p className="text-xs text-gray-600">Booked 10+ services</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Loyalty Member</p>
                        <p className="text-xs text-gray-600">Active for 6+ months</p>
                      </div>
                    </div>

                    {profile.vehicleFuelType === 'Electric' && (
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Award className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Eco Warrior</p>
                          <p className="text-xs text-gray-600">Electric vehicle owner</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}