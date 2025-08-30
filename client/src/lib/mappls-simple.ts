import { Location } from './mappls';

const MAPPLS_API_KEY = "cc616d4dd3986c77dbbb4b4abb266036";

export class SimpleMappls {
  private apiKey: string;

  constructor() {
    this.apiKey = MAPPLS_API_KEY;
  }

  // Initialize a simple embedded map using iframe approach
  createEmbeddedMap(containerId: string, destination: Location, origin?: Location): HTMLElement {
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

    // Build URL for embedded map with directions using correct domain
    let mapUrl = `https://maps.mapmyindia.com/embed?`;
    
    if (origin) {
      // Show route from origin to destination
      mapUrl += `origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving`;
    } else {
      // Just show the destination
      mapUrl += `q=${destination.lat},${destination.lng}&zoom=15`;
    }

    // Try to load the iframe, but provide fallback if it fails
    iframe.src = mapUrl;
    iframe.onload = () => {
      console.log('Map iframe loaded successfully');
    };
    iframe.onerror = () => {
      console.error('Map iframe failed to load, showing fallback');
      this.createFallbackMap(container, destination, origin);
    };

    container.appendChild(iframe);

    // Set a timeout to show fallback if iframe doesn't load
    setTimeout(() => {
      if (iframe.contentDocument === null || iframe.contentDocument.readyState !== 'complete') {
        console.log('Map iframe timeout, showing fallback');
        this.createFallbackMap(container, destination, origin);
      }
    }, 5000);

    return container;
  }

  // Get directions URL for external navigation
  getDirectionsUrl(destination: Location): string {
    return `https://maps.mapmyindia.com/directions?destination=${destination.lat},${destination.lng}`;
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

  // Create a fallback visual map when iframe fails
  private createFallbackMap(container: HTMLElement, destination: Location, origin?: Location) {
    const routeInfo = origin ? this.calculateDistance(origin, destination) : { distance: 'N/A', duration: 'N/A' };
    
    container.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center p-6">
        <div class="text-center mb-4">
          <div class="text-4xl mb-2">🗺️</div>
          <h3 class="text-lg font-semibold text-blue-800 mb-2">${destination.address || 'Destination'}</h3>
          <div class="text-sm text-blue-600 space-y-1">
            <div>📍 Lat: ${destination.lat.toFixed(4)}, Lng: ${destination.lng.toFixed(4)}</div>
            ${origin ? `<div>📍 From: ${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}</div>` : ''}
            ${origin ? `<div>📏 Distance: ${routeInfo.distance}</div>` : ''}
            ${origin ? `<div>⏱️ Est. Time: ${routeInfo.duration}</div>` : ''}
          </div>
        </div>
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-3">Interactive map unavailable</p>
          <p class="text-xs text-gray-500">Use external navigation buttons below</p>
        </div>
      </div>
    `;
  }
}

export const simpleMappls = new SimpleMappls();