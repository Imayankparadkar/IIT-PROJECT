import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mapplsService, Location } from '@/lib/mappls';
import { simpleMappls } from '@/lib/mappls-simple';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Route,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface MapDirectionsProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Location;
  destinationName: string;
  slotInfo?: {
    level: string;
    section: string;
    number: string;
  };
}

export default function MapDirections({ 
  isOpen, 
  onClose, 
  destination, 
  destinationName,
  slotInfo 
}: MapDirectionsProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<string>('Initializing...');
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && mapContainer.current) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [isOpen]);

  const initializeMap = async () => {
    if (!mapContainer.current) return;

    setIsLoading(true);
    setLocationStatus('Getting your location...');

    try {
      // Get user's current location with faster timeout
      const userLoc = await simpleMappls.getCurrentLocation();
      setUserLocation(userLoc);
      setLocationStatus('Location found!');

      console.log('User location:', userLoc);
      console.log('Destination:', destination);
      console.log('Map container ID:', mapContainer.current.id);

      // Use simple iframe approach for reliable map display
      const mapElement = simpleMappls.createEmbeddedMap(
        mapContainer.current.id,
        destination,
        userLoc
      );
      
      setMap(mapElement);
      console.log('Simple map initialized successfully');

      // Calculate basic route information
      const routeCalc = simpleMappls.calculateDistance(userLoc, destination);
      setRouteInfo(routeCalc);

    } catch (error) {
      console.error('Error initializing simple map:', error);
      setLocationStatus('Using default location');
      // Create fallback static map
      if (mapContainer.current) {
        simpleMappls.createEnhancedFallbackMap(mapContainer.current, destination, userLocation || undefined);
        setRouteInfo({
          distance: 'Use external navigation',
          duration: 'for accurate directions'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openInMappls = async () => {
    try {
      // Get fresh location quickly for navigation
      const currentLocation = await simpleMappls.getCurrentLocation();
      const mapplsUrl = simpleMappls.getDirectionsUrl(destination, currentLocation);
      console.log('Opening Mappls with locations:', currentLocation, destination);
      window.open(mapplsUrl, '_blank');
    } catch (error) {
      console.error('Error getting location for Mappls:', error);
      // Fallback to destination only
      const mapplsUrl = simpleMappls.getDirectionsUrl(destination);
      window.open(mapplsUrl, '_blank');
    }
  };

  const openInGoogleMaps = async () => {
    try {
      // Get fresh location quickly for navigation
      const currentLocation = await simpleMappls.getCurrentLocation();
      const googleMapsUrl = simpleMappls.getGoogleMapsUrl(destination, currentLocation);
      console.log('Opening Google Maps with locations:', currentLocation, destination);
      window.open(googleMapsUrl, '_blank');
    } catch (error) {
      console.error('Error getting location for Google Maps:', error);
      // Fallback to destination only
      const googleMapsUrl = simpleMappls.getGoogleMapsUrl(destination);
      window.open(googleMapsUrl, '_blank');
    }
  };

  // Instant navigation - opens immediately while trying to get location in background
  const openQuickNavigation = async (type: 'mappls' | 'google') => {
    if (type === 'mappls') {
      // Try to get location quickly, but don't wait
      const locationPromise = simpleMappls.getCurrentLocation();
      
      try {
        // Wait max 500ms for location
        const location = await Promise.race([
          locationPromise,
          new Promise<Location>((resolve) => setTimeout(() => resolve({
            lat: 22.7196,
            lng: 75.8577,
            address: "Quick fallback"
          }), 500))
        ]);
        
        const url = simpleMappls.getDirectionsUrl(destination, location);
        console.log('Quick Mappls navigation with location:', location);
        window.open(url, '_blank');
      } catch {
        const url = `https://maps.mapmyindia.com/directions?destination=${destination.lat},${destination.lng}`;
        window.open(url, '_blank');
      }
    } else {
      // Same for Google Maps
      const locationPromise = simpleMappls.getCurrentLocation();
      
      try {
        const location = await Promise.race([
          locationPromise,
          new Promise<Location>((resolve) => setTimeout(() => resolve({
            lat: 22.7196,
            lng: 75.8577,
            address: "Quick fallback"
          }), 500))
        ]);
        
        const url = simpleMappls.getGoogleMapsUrl(destination, location);
        console.log('Quick Google Maps navigation with location:', location);
        window.open(url, '_blank');
      } catch {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`;
        window.open(url, '_blank');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Directions to {destinationName}
          </DialogTitle>
          <DialogDescription>View route details and get turn-by-turn navigation to your destination</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Route Information */}
          {(routeInfo || slotInfo) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              {routeInfo && (
                <>
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{routeInfo.distance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{routeInfo.duration}</span>
                  </div>
                </>
              )}
              {slotInfo && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {slotInfo.level}, {slotInfo.section}-{slotInfo.number}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Map Container */}
          <div className="relative">
            <div 
              ref={mapContainer}
              id={`mappls-map-${Date.now()}`}
              className="w-full h-96 rounded-lg bg-gray-100 border"
              style={{ minHeight: '400px', width: '100%' }}
            />
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-sm text-gray-600">{locationStatus}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsLoading(false);
                      if (mapContainer.current) {
                        simpleMappls.createEmbeddedMap(
                          mapContainer.current.id,
                          destination
                        );
                      }
                    }}
                    className="mt-2"
                  >
                    Skip & Show Map
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Parking Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-blue-500 rounded"></div>
              <span className="text-sm">Route</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={openInMappls}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                variant="default"
                size="lg"
              >
                <Navigation className="h-4 w-4" />
                🧭 Navigate with Mappls
              </Button>
              
              <Button
                onClick={openInGoogleMaps}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                variant="default"
                size="lg"
              >
                <Navigation className="h-4 w-4" />
                🗺️ Navigate with Google Maps
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => openQuickNavigation('mappls')}
                className="flex items-center gap-2"
                variant="outline"
                size="sm"
              >
                <ExternalLink className="h-3 w-3" />
                Quick Mappls
              </Button>
              
              <Button
                onClick={() => openQuickNavigation('google')}
                className="flex items-center gap-2"
                variant="outline" 
                size="sm"
              >
                <ExternalLink className="h-3 w-3" />
                Quick Google
              </Button>
            </div>
            
            <Button
              onClick={onClose}
              variant="secondary"
              className="w-full"
            >
              Close
            </Button>
          </div>

          {/* Additional Information */}
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Follow traffic rules and parking guidelines. 
              Your slot is reserved for 15 minutes from booking time.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}