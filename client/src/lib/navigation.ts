import { mapplsService, Location } from './mappls';

export interface NavigationStep {
  instruction: string;
  distance: number;
  duration: number;
  location: [number, number];
  maneuver?: string;
  voiceInstruction?: string;
}

export interface NavigationRoute {
  distance: string;
  duration: string;
  steps: NavigationStep[];
  geometry: any;
}

export interface NavigationState {
  isNavigating: boolean;
  currentStep: number;
  currentLocation: Location | null;
  destination: Location | null;
  route: NavigationRoute | null;
  voiceEnabled: boolean;
}

export class NavigationService {
  private speechSynthesis: SpeechSynthesis | null = null;
  private watchId: number | null = null;
  private onLocationUpdate?: (location: Location) => void;
  private onStepUpdate?: (step: number) => void;
  private voiceEnabled: boolean = true;

  constructor() {
    this.speechSynthesis = window.speechSynthesis || null;
  }

  // Get user's current location with high accuracy
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // Fallback to Indore coordinates
        resolve({
          lat: 22.7196,
          lng: 75.8577,
          address: "Indore, Madhya Pradesh"
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location"
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Fallback to Indore coordinates
          resolve({
            lat: 22.7196,
            lng: 75.8577,
            address: "Indore, Madhya Pradesh"
          });
        },
        { 
          enableHighAccuracy: true, 
          timeout: 8000, 
          maximumAge: 60000 
        }
      );
    });
  }

  // Get detailed navigation route with voice instructions
  async getNavigationRoute(origin: Location, destination: Location): Promise<NavigationRoute> {
    try {
      const response = await fetch(`https://apis.mappls.com/advancedmaps/v1/cc616d4dd3986c77dbbb4b4abb266036/route_adv/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full&steps=true&voice_instructions=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Navigation API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }

      const route = data.routes[0];
      const steps: NavigationStep[] = [];

      // Process route steps into navigation instructions
      if (route.legs) {
        for (const leg of route.legs) {
          if (leg.steps) {
            for (const step of leg.steps) {
              const instruction = this.formatInstruction(step);
              steps.push({
                instruction,
                distance: step.distance || 0,
                duration: step.duration || 0,
                location: step.maneuver?.location || [0, 0],
                maneuver: step.maneuver?.type || 'straight',
                voiceInstruction: this.generateVoiceInstruction(step)
              });
            }
          }
        }
      }

      // Create a simple route if no detailed steps available
      if (steps.length === 0) {
        steps.push({
          instruction: `Head towards ${destination.address || 'destination'}`,
          distance: route.distance || 0,
          duration: route.duration || 0,
          location: [destination.lng, destination.lat],
          maneuver: 'straight',
          voiceInstruction: `Navigate to ${destination.address || 'your destination'}`
        });
      }

      return {
        distance: this.formatDistance(route.distance || 0),
        duration: this.formatDuration(route.duration || 0),
        steps,
        geometry: route.geometry
      };
    } catch (error) {
      console.error('Navigation route error:', error);
      
      // Fallback simple route
      const distance = this.calculateDistance(origin, destination);
      return {
        distance: this.formatDistance(distance * 1000),
        duration: this.formatDuration(distance * 180), // Rough estimate: 180 seconds per km
        steps: [{
          instruction: `Head towards ${destination.address || 'destination'}`,
          distance: distance * 1000,
          duration: distance * 180,
          location: [destination.lng, destination.lat],
          maneuver: 'straight',
          voiceInstruction: `Navigate to ${destination.address || 'your destination'}`
        }],
        geometry: {
          type: 'LineString',
          coordinates: [[origin.lng, origin.lat], [destination.lng, destination.lat]]
        }
      };
    }
  }

  // Start real-time navigation tracking
  startNavigation(
    route: NavigationRoute,
    onLocationUpdate?: (location: Location) => void,
    onStepUpdate?: (step: number) => void
  ) {
    this.onLocationUpdate = onLocationUpdate;
    this.onStepUpdate = onStepUpdate;

    if (route.steps.length > 0 && this.voiceEnabled) {
      this.speakInstruction(`Navigation started. ${route.steps[0].voiceInstruction || route.steps[0].instruction}`);
    }

    // Start watching user location for navigation updates
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const currentLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location"
          };

          this.onLocationUpdate?.(currentLocation);
          this.checkNavigationProgress(currentLocation, route);
        },
        (error) => {
          console.warn('Navigation tracking error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000
        }
      );
    }
  }

  // Stop navigation tracking
  stopNavigation() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    
    this.onLocationUpdate = undefined;
    this.onStepUpdate = undefined;
  }

  // Enable/disable voice instructions
  setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled && this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  // Speak navigation instruction
  speakInstruction(text: string) {
    if (!this.voiceEnabled || !this.speechSynthesis) return;
    
    this.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Use a female voice if available
    const voices = this.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    this.speechSynthesis.speak(utterance);
  }

  // Check if user has reached next navigation step
  private checkNavigationProgress(currentLocation: Location, route: NavigationRoute) {
    // This would normally check user's proximity to navigation points
    // For demo purposes, we'll simulate step progression
    
    // In a real implementation, you'd calculate distance to next waypoint
    // and trigger next instruction when user gets close
  }

  // Format instruction text for display
  private formatInstruction(step: any): string {
    const maneuver = step.maneuver?.type || 'straight';
    const streetName = step.name || 'road';
    
    switch (maneuver) {
      case 'turn-right':
        return `Turn right onto ${streetName}`;
      case 'turn-left':
        return `Turn left onto ${streetName}`;
      case 'straight':
        return `Continue straight on ${streetName}`;
      case 'slight-right':
        return `Keep right on ${streetName}`;
      case 'slight-left':
        return `Keep left on ${streetName}`;
      case 'roundabout':
        return `Take the roundabout to ${streetName}`;
      default:
        return step.maneuver?.instruction || `Continue on ${streetName}`;
    }
  }

  // Generate voice instruction
  private generateVoiceInstruction(step: any): string {
    const instruction = this.formatInstruction(step);
    const distance = this.formatDistance(step.distance || 0);
    
    if (step.distance > 100) {
      return `In ${distance}, ${instruction.toLowerCase()}`;
    } else {
      return instruction;
    }
  }

  // Format distance for display
  private formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  }

  // Format duration for display
  private formatDuration(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  }

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(origin: Location, destination: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(destination.lat - origin.lat);
    const dLng = this.deg2rad(destination.lng - origin.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(origin.lat)) * Math.cos(this.deg2rad(destination.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

export const navigationService = new NavigationService();