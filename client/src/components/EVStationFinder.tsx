import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Zap, MapPin, Clock, Navigation, Star, Battery, Car, Phone } from 'lucide-react';

interface EVStation {
  id: string;
  name: string;
  address: string;
  distance: string;
  availablePorts: number;
  totalPorts: number;
  pricePerKwh: number;
  rating: number;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  fastCharging: boolean;
  operatorName: string;
  openHours: string;
}

export default function EVStationFinder() {
  const [stations, setStations] = useState<EVStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<EVStation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<EVStation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock EV stations data for demo
  const mockStations: EVStation[] = [
    {
      id: '1',
      name: 'Tata Power Station',
      address: 'Vijay Nagar Square, Indore, MP',
      distance: '2.3 km',
      availablePorts: 4,
      totalPorts: 6,
      pricePerKwh: 8,
      rating: 4.5,
      amenities: ['Fast Charging', 'Cafe', 'Parking', 'Restroom'],
      coordinates: { lat: 22.7532, lng: 75.8937 },
      fastCharging: true,
      operatorName: 'Tata Power',
      openHours: '24/7'
    },
    {
      id: '2',
      name: 'BPCL Charging Hub',
      address: 'Palasia Square, Indore, MP',
      distance: '1.8 km',
      availablePorts: 2,
      totalPorts: 4,
      pricePerKwh: 7,
      rating: 4.2,
      amenities: ['Fast Charging', 'Parking', 'ATM'],
      coordinates: { lat: 22.7196, lng: 75.8577 },
      fastCharging: true,
      operatorName: 'BPCL',
      openHours: '6:00 AM - 10:00 PM'
    },
    {
      id: '3',
      name: 'ChargePoint Station',
      address: 'Ring Road, Near Phoenix Mall, Indore',
      distance: '3.1 km',
      availablePorts: 1,
      totalPorts: 3,
      pricePerKwh: 9,
      rating: 4.3,
      amenities: ['Fast Charging', 'Shopping Mall', 'Food Court'],
      coordinates: { lat: 22.7279, lng: 75.8723 },
      fastCharging: true,
      operatorName: 'ChargePoint',
      openHours: '10:00 AM - 10:00 PM'
    },
    {
      id: '4',
      name: 'Ather Grid Station',
      address: 'Treasure Island Mall, Indore',
      distance: '4.2 km',
      availablePorts: 3,
      totalPorts: 4,
      pricePerKwh: 6.5,
      rating: 4.7,
      amenities: ['Fast Charging', 'Mall', 'Parking', 'Cinema'],
      coordinates: { lat: 22.7074, lng: 75.8737 },
      fastCharging: true,
      operatorName: 'Ather Energy',
      openHours: '24/7'
    },
    {
      id: '5',
      name: 'Shell Recharge',
      address: 'AB Road, Near C21 Mall, Indore',
      distance: '5.1 km',
      availablePorts: 0,
      totalPorts: 2,
      pricePerKwh: 8.5,
      rating: 4.1,
      amenities: ['Fast Charging', 'Fuel Station', 'Convenience Store'],
      coordinates: { lat: 22.6793, lng: 75.9063 },
      fastCharging: true,
      operatorName: 'Shell',
      openHours: '24/7'
    }
  ];

  useEffect(() => {
    loadStations();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = stations.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.operatorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStations(filtered);
    } else {
      setFilteredStations(stations);
    }
  }, [searchQuery, stations]);

  const loadStations = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setStations(mockStations);
      setFilteredStations(mockStations);
      setIsLoading(false);
    }, 1000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Indore center
          setUserLocation({ lat: 22.7196, lng: 75.8577 });
        }
      );
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return 'bg-red-100 text-red-800';
    if (percentage < 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getAvailabilityText = (available: number, total: number) => {
    if (available === 0) return 'Full';
    if (available === total) return 'Available';
    return `${available}/${total}`;
  };

  const openInMaps = (station: EVStation) => {
    if (userLocation) {
      const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${station.coordinates.lat},${station.coordinates.lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${station.coordinates.lat},${station.coordinates.lng}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const bookStation = (station: EVStation) => {
    if (station.availablePorts === 0) {
      alert('Sorry, this station is currently full. Please try another station.');
      return;
    }
    alert(`Booking confirmed at ${station.name}! You will receive SMS confirmation shortly.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">EV Charging Stations</h2>
        <p className="text-gray-600">Find and book EV charging stations with live availability</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Search by station name, location, or operator..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Stations List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading stations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStations.map((station) => (
            <Card key={station.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-500" />
                      {station.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{station.operatorName}</p>
                  </div>
                  <Badge className={getAvailabilityColor(station.availablePorts, station.totalPorts)}>
                    {getAvailabilityText(station.availablePorts, station.totalPorts)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{station.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-4 h-4 text-blue-500" />
                      <span>{station.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{station.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-green-600">₹{station.pricePerKwh}/kWh</p>
                      <p className="text-xs text-gray-500">{station.openHours}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{station.availablePorts}/{station.totalPorts} ports</p>
                      <p className="text-xs text-gray-500">available</p>
                    </div>
                  </div>

                  {station.fastCharging && (
                    <Badge variant="secondary" className="text-xs">
                      <Battery className="w-3 h-3 mr-1" />
                      Fast Charging
                    </Badge>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openInMaps(station)}
                      className="flex-1"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => setSelectedStation(station)}
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          Book Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Book Charging Slot</DialogTitle>
                        </DialogHeader>
                        {selectedStation && (
                          <div className="space-y-4">
                            <div className="text-center">
                              <h3 className="font-semibold text-lg">{selectedStation.name}</h3>
                              <p className="text-gray-600">{selectedStation.address}</p>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Available Ports:</span>
                                  <p className="font-semibold">{selectedStation.availablePorts}/{selectedStation.totalPorts}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Price:</span>
                                  <p className="font-semibold">₹{selectedStation.pricePerKwh}/kWh</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Rating:</span>
                                  <p className="font-semibold">{selectedStation.rating} ⭐</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Distance:</span>
                                  <p className="font-semibold">{selectedStation.distance}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Amenities:</h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedStation.amenities.map((amenity, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => openInMaps(selectedStation)}
                                className="flex-1"
                              >
                                <Navigation className="w-4 h-4 mr-1" />
                                Get Directions
                              </Button>
                              <Button 
                                onClick={() => bookStation(selectedStation)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                disabled={selectedStation.availablePorts === 0}
                              >
                                <Zap className="w-4 h-4 mr-1" />
                                {selectedStation.availablePorts === 0 ? 'Station Full' : 'Confirm Booking'}
                              </Button>
                            </div>

                            <div className="text-xs text-gray-500 text-center">
                              <p>Booking confirmation will be sent via SMS</p>
                              <p>Support: <span className="text-blue-600">+91 98765 43210</span></p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredStations.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No charging stations found matching your search.</p>
        </div>
      )}
    </div>
  );
}