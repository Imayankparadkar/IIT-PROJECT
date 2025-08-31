import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Navigation, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Clock, 
  Route,
  ArrowRight,
  RotateCcw,
  ArrowUp,
  Phone,
  X
} from 'lucide-react';
import { navigationService, NavigationRoute, NavigationStep } from '@/lib/navigation';
import { Location } from '@/lib/mappls';

interface NavigationModalProps {
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

export default function NavigationModal({
  isOpen,
  onClose,
  destination,
  destinationName,
  slotInfo
}: NavigationModalProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [route, setRoute] = useState<NavigationRoute | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load navigation route when modal opens
  useEffect(() => {
    if (isOpen && !route) {
      loadNavigationRoute();
    }
  }, [isOpen]);

  // Cleanup navigation when modal closes
  useEffect(() => {
    if (!isOpen && isNavigating) {
      handleStopNavigation();
    }
  }, [isOpen, isNavigating]);

  const loadNavigationRoute = async () => {
    try {
      setIsLoadingRoute(true);
      
      // Get user's current location
      const origin = await navigationService.getCurrentLocation();
      setCurrentLocation(origin);
      
      // Get navigation route
      const navigationRoute = await navigationService.getNavigationRoute(origin, destination);
      setRoute(navigationRoute);
      
    } catch (error) {
      console.error('Failed to load navigation route:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const handleStartNavigation = () => {
    if (!route) return;
    
    setIsNavigating(true);
    navigationService.setVoiceEnabled(voiceEnabled);
    
    navigationService.startNavigation(
      route,
      (location) => {
        setCurrentLocation(location);
      },
      (step) => {
        setCurrentStep(step);
      }
    );
    
    // Initial voice instruction
    if (voiceEnabled && route.steps.length > 0) {
      navigationService.speakInstruction(`Starting navigation to ${destinationName}. ${route.steps[0].voiceInstruction || route.steps[0].instruction}`);
    }
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    navigationService.stopNavigation();
  };

  const toggleVoice = () => {
    const newVoiceState = !voiceEnabled;
    setVoiceEnabled(newVoiceState);
    navigationService.setVoiceEnabled(newVoiceState);
    
    if (newVoiceState) {
      navigationService.speakInstruction("Voice guidance enabled");
    }
  };

  const speakCurrentInstruction = () => {
    if (route && route.steps[currentStep]) {
      const step = route.steps[currentStep];
      navigationService.speakInstruction(step.voiceInstruction || step.instruction);
    }
  };

  const getManeuverIcon = (maneuver?: string) => {
    switch (maneuver) {
      case 'turn-right':
      case 'slight-right':
        return <ArrowRight className="h-6 w-6 text-blue-600 rotate-90" />;
      case 'turn-left':
      case 'slight-left':
        return <ArrowRight className="h-6 w-6 text-blue-600 -rotate-90" />;
      case 'roundabout':
        return <RotateCcw className="h-6 w-6 text-blue-600" />;
      case 'straight':
      default:
        return <ArrowUp className="h-6 w-6 text-blue-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Navigation to {destinationName}
          </DialogTitle>
          <DialogDescription>Turn-by-turn directions with voice guidance to your parking slot</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[70vh]">
          {/* Map Area */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg h-full min-h-[400px]">
              <div 
                ref={mapRef} 
                id="navigation-map"
                className="w-full h-full rounded-lg"
                data-testid="map-navigation"
              />
              
              {isLoadingRoute && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading route...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Instructions */}
          <div className="space-y-4 overflow-y-auto">
            {/* Route Summary */}
            {route && (
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Route className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-medium">{route.distance}</div>
                      <div className="text-xs text-gray-500">Distance</div>
                    </div>
                    <div>
                      <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-medium">{route.duration}</div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                    {slotInfo && (
                      <div>
                        <MapPin className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-medium">{slotInfo.section}-{slotInfo.number}</div>
                        <div className="text-xs text-gray-500">{slotInfo.level}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Instruction */}
            {isNavigating && route && route.steps[currentStep] && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {getManeuverIcon(route.steps[currentStep].maneuver)}
                    <div className="flex-1">
                      <div className="font-semibold text-blue-900">
                        {route.steps[currentStep].instruction}
                      </div>
                      <div className="text-sm text-blue-700">
                        in {route.steps[currentStep].distance < 1000 
                          ? `${Math.round(route.steps[currentStep].distance)} m`
                          : `${(route.steps[currentStep].distance / 1000).toFixed(1)} km`
                        }
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={speakCurrentInstruction}
                      data-testid="button-repeat-instruction"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Controls */}
            <div className="flex gap-2">
              {!isNavigating ? (
                <Button
                  onClick={handleStartNavigation}
                  disabled={!route || isLoadingRoute}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  data-testid="button-start-navigation"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Navigation
                </Button>
              ) : (
                <Button
                  onClick={handleStopNavigation}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-stop-navigation"
                >
                  <X className="h-4 w-4 mr-2" />
                  Stop Navigation
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={toggleVoice}
                data-testid="button-toggle-voice"
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Step-by-step instructions */}
            {route && route.steps.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Turn-by-turn Directions</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {route.steps.map((step, index) => (
                      <div 
                        key={index}
                        className={`flex items-center gap-3 p-2 rounded ${
                          index === currentStep && isNavigating 
                            ? 'bg-blue-100 border-blue-300 border' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {getManeuverIcon(step.maneuver)}
                        </div>
                        <div className="flex-1 text-sm">
                          <div className={`${index === currentStep && isNavigating ? 'font-semibold text-blue-900' : ''}`}>
                            {step.instruction}
                          </div>
                          {step.distance > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.round(step.distance)}m • {Math.round(step.duration / 60)} min
                            </div>
                          )}
                        </div>
                        {index === currentStep && isNavigating && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* External Navigation Options */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">External Navigation</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = `https://maps.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`;
                      window.open(url, '_blank');
                    }}
                    className="text-sm"
                    data-testid="button-google-maps"
                  >
                    Google Maps
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = `https://maps.mapmyindia.com/directions?destination=${destination.lat},${destination.lng}`;
                      window.open(url, '_blank');
                    }}
                    className="text-sm"
                    data-testid="button-mappls-external"
                  >
                    Mappls Maps
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = 'tel:+911234567890';
                  }}
                  className="w-full text-sm"
                  data-testid="button-emergency-contact"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support: +91 123 456 7890
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}