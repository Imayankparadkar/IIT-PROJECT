import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

    try {
      // Get user's current location
      const userLoc = await simpleMappls.getCurrentLocation();
      setUserLocation(userLoc);

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
      // Create fallback static map
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="w-full h-full bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
            <div class="text-center p-6">
              <div class="text-blue-600 mb-2">📍</div>
              <p class="text-blue-800 font-medium">${destinationName}</p>
              <p class="text-blue-600 text-sm">${destination.address || 'View location in external app'}</p>
            </div>
          </div>
        `;
        setRouteInfo({
          distance: 'Click external links',
          duration: 'for navigation'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openInMappls = () => {
    const mapplsUrl = simpleMappls.getDirectionsUrl(destination);
    window.open(mapplsUrl, '_blank');
  };

  const openInGoogleMaps = () => {
    const googleMapsUrl = simpleMappls.getGoogleMapsUrl(destination);
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Directions to {destinationName}
          </DialogTitle>
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
                  <p className="text-sm text-gray-600">Getting your location...</p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              onClick={openInMappls}
              className="flex items-center gap-2"
              variant="default"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Mappls
            </Button>
            
            <Button
              onClick={openInGoogleMaps}
              className="flex items-center gap-2"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4" />
              Google Maps
            </Button>

            <Button
              onClick={onClose}
              variant="secondary"
              className="md:col-span-1"
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