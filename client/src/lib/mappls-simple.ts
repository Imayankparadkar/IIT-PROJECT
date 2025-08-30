import { Location } from './mappls';

const MAPPLS_API_KEY = "cc616d4dd3986c77dbbb4b4abb266036";

export class SimpleMappls {
  private apiKey: string;

  constructor() {
    this.apiKey = MAPPLS_API_KEY;
  }

  // Initialize a simple embedded map using iframe approach
  createEmbeddedMap(containerId: string, destination: Location, origin?: Location): HTMLIFrameElement {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id ${containerId} not found`);
    }

    // Clear container
    container.innerHTML = '';

    // Create iframe for embedded map
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';

    // Build URL for embedded map with directions
    let mapUrl = `https://maps.mappls.com/embed?`;
    
    if (origin) {
      // Show route from origin to destination
      mapUrl += `origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving`;
    } else {
      // Just show the destination
      mapUrl += `q=${destination.lat},${destination.lng}&zoom=15`;
    }

    iframe.src = mapUrl;
    container.appendChild(iframe);

    return iframe;
  }

  // Get directions URL for external navigation
  getDirectionsUrl(destination: Location): string {
    return `https://maps.mappls.com/directions?destination=${destination.lat},${destination.lng}`;
  }

  // Get Google Maps fallback URL
  getGoogleMapsUrl(destination: Location): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`;
  }

  // Get current location
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Fallback to Indore coordinates
          resolve({
            lat: 22.7196,
            lng: 75.8577,
            address: "Indore, Madhya Pradesh"
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

  // Calculate approximate distance using basic formula
  calculateDistance(origin: Location, destination: Location): { distance: string; duration: string } {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(destination.lat - origin.lat);
    const dLng = this.toRad(destination.lng - origin.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(origin.lat)) * Math.cos(this.toRad(destination.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Estimate duration (assuming average city speed of 30 km/h)
    const duration = Math.round((distance / 30) * 60);

    return {
      distance: `${distance.toFixed(1)} km`,
      duration: `${duration} min`
    };
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }
}

export const simpleMappls = new SimpleMappls();