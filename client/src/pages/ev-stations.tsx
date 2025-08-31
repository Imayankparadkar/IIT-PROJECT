import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Zap, Clock, IndianRupee, Volume2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SimpleMappls } from '@/lib/mappls-simple';
import { Location } from '@/lib/mappls';

interface EVStation {
  id: string;
  name: string;
  brand: string;
  distance: string;
  availablePorts: number;
  totalPorts: number;
  pricePerKWh: number;
  location: Location;
  type: 'Fast' | 'Rapid' | 'Standard';
  estimatedTime: string;
}

const generateRandomEVStations = (): EVStation[] => {
  const brands = ['Tata Power', 'BPCL', 'Ather', 'ChargeZone', 'Fortum', 'Shell Recharge'];
  const locations = [
    { lat: 22.7196, lng: 75.8577, name: 'Central Mall' },
    { lat: 22.7406, lng: 75.8692, name: 'IT Park' },
    { lat: 22.6983, lng: 75.8547, name: 'Airport Road' },
    { lat: 22.7547, lng: 75.8926, name: 'Vijay Nagar' },
    { lat: 22.6739, lng: 75.8127, name: 'Ring Road' },
    { lat: 22.7833, lng: 75.8341, name: 'Bhopal Road' }
  ];

  return brands.map((brand, index) => {
    const location = locations[index];
    const totalPorts = Math.floor(Math.random() * 8) + 2; // 2-10 ports
    const availablePorts = Math.floor(Math.random() * totalPorts);
    const distance = (Math.random() * 5 + 0.1).toFixed(1); // 0.1-5.1 km
    
    return {
      id: `station-${index}-${Date.now()}`,
      name: location.name,
      brand,
      distance: `${distance} km`,
      availablePorts,
      totalPorts,
      pricePerKWh: Math.floor(Math.random() * 5) + 6, // ₹6-10 per kWh
      location: {
        lat: location.lat + (Math.random() - 0.5) * 0.02,
        lng: location.lng + (Math.random() - 0.5) * 0.02,
        address: location.name
      },
      type: ['Fast', 'Rapid', 'Standard'][Math.floor(Math.random() * 3)] as 'Fast' | 'Rapid' | 'Standard',
      estimatedTime: `${Math.floor(Math.random() * 30) + 10} min`
    };
  });
};

export default function EVStationsPage() {
  const [stations, setStations] = useState<EVStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<EVStation | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const simpleMappls = new SimpleMappls();

  useEffect(() => {
    // Generate new dummy data on every visit for real-time effect
    setStations(generateRandomEVStations());
  }, []);

  useEffect(() => {
    if (selectedStation && mapContainer.current) {
      const mapId = `ev-map-${Date.now()}`;
      mapContainer.current.id = mapId;
      
      try {
        simpleMappls.createEmbeddedMap(mapId, selectedStation.location);
      } catch (error) {
        console.error('Error creating map:', error);
      }
    }
  }, [selectedStation]);

  const getPortsColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.6) return 'text-green-600';
    if (ratio > 0.3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fast': return 'bg-green-100 text-green-800';
      case 'Rapid': return 'bg-blue-100 text-blue-800';
      case 'Standard': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateToStation = async (station: EVStation) => {
    try {
      const currentLocation = await simpleMappls.getCurrentLocation();
      const url = simpleMappls.getDirectionsUrl(station.location, currentLocation);
      window.open(url, '_blank');
    } catch (error) {
      const url = simpleMappls.getDirectionsUrl(station.location);
      window.open(url, '_blank');
    }
  };

  const startVoiceNavigation = (station: EVStation) => {
    // Simulate voice navigation
    const utterance = new SpeechSynthesisUtterance(
      `Starting navigation to ${station.brand} charging station at ${station.name}. Distance is ${station.distance}. Estimated charging time is ${station.estimatedTime}.`
    );
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EV Charging Stations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the nearest charging stations in real-time with live availability and pricing information.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Station List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Nearby Stations</h2>
              
              {stations.map((station) => (
                <Card 
                  key={station.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedStation?.id === station.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedStation(station)}
                  data-testid={`station-card-${station.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{station.brand}</h3>
                          <Badge className={getTypeColor(station.type)}>
                            {station.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{station.name} • {station.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Est. charging: {station.estimatedTime}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getPortsColor(station.availablePorts, station.totalPorts)}`}>
                          {station.availablePorts}/{station.totalPorts} ports
                        </div>
                        <div className="text-sm text-gray-600">available</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        <span className="font-medium">₹{station.pricePerKWh}/kWh</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startVoiceNavigation(station);
                          }}
                          data-testid={`button-voice-${station.id}`}
                        >
                          <Volume2 className="h-4 w-4 mr-1" />
                          Voice Nav
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToStation(station);
                          }}
                          data-testid={`button-navigate-${station.id}`}
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          Navigate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map View */}
            <div className="lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {selectedStation ? selectedStation.brand : 'Select a Station'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStation ? (
                    <div>
                      <div 
                        ref={mapContainer}
                        className="w-full h-80 rounded-lg bg-gray-100 border mb-4"
                        data-testid="ev-station-map"
                      />
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="font-medium">{selectedStation.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Distance:</span>
                          <span className="font-medium">{selectedStation.distance}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Charging Type:</span>
                          <Badge className={getTypeColor(selectedStation.type)}>
                            {selectedStation.type}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Available Ports:</span>
                          <span className={`font-medium ${getPortsColor(selectedStation.availablePorts, selectedStation.totalPorts)}`}>
                            {selectedStation.availablePorts} of {selectedStation.totalPorts}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="font-medium">₹{selectedStation.pricePerKWh}/kWh</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Select a charging station to view on map</p>
                      </div>
                    </div>
                  )}
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