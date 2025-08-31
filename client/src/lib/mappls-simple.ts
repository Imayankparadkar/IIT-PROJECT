import { Location } from './mappls';

const MAPPLS_API_KEY = import.meta.env.VITE_MAPPLS_API_KEY || "cc616d4dd3986c77dbbb4b4abb266036";

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

    // Build URL for embedded map with directions - try multiple approaches
    let mapUrl;
    
    if (origin) {
      // Try Mappls embed with route
      mapUrl = `https://maps.mappls.com/embed-api/route?key=${this.apiKey}&start=${origin.lat},${origin.lng}&end=${destination.lat},${destination.lng}&vehicleType=FourWheeler`;
    } else {
      // Just show the destination with Mappls embed
      mapUrl = `https://maps.mappls.com/embed-api/map?key=${this.apiKey}&centre=${destination.lat},${destination.lng}&zoom=15&markers=${destination.lat},${destination.lng}`;
    }

    // Try to load the iframe with multiple fallbacks
    let attemptCount = 0;
    const maxAttempts = 3;
    const mapUrls = [
      mapUrl,
      // Fallback 1: Basic Mappls embed
      `https://maps.mapmyindia.com/embed?q=${destination.lat},${destination.lng}&zoom=15`,
      // Fallback 2: OpenStreetMap embed as last resort
      `https://www.openstreetmap.org/export/embed.html?bbox=${destination.lng-0.01},${destination.lat-0.01},${destination.lng+0.01},${destination.lat+0.01}&marker=${destination.lat},${destination.lng}`
    ];

    const tryLoadMap = (urlIndex: number) => {
      if (urlIndex >= mapUrls.length) {
        console.log('All map URLs failed, showing enhanced fallback');
        this.createEnhancedFallbackMap(container, destination, origin);
        return;
      }

      iframe.src = mapUrls[urlIndex];
      console.log(`Trying map URL ${urlIndex + 1}:`, mapUrls[urlIndex]);

      iframe.onload = () => {
        console.log(`Map iframe loaded successfully with URL ${urlIndex + 1}`);
      };

      iframe.onerror = () => {
        console.error(`Map iframe failed to load with URL ${urlIndex + 1}, trying next...`);
        tryLoadMap(urlIndex + 1);
      };

      // Set a timeout for each attempt
      setTimeout(() => {
        if (iframe.contentDocument === null || iframe.contentDocument.readyState !== 'complete') {
          console.log(`Map iframe timeout for URL ${urlIndex + 1}, trying next...`);
          tryLoadMap(urlIndex + 1);
        }
      }, 3000);
    };

    container.appendChild(iframe);
    tryLoadMap(0);

    return container;
  }

  // Get directions URL for external navigation with origin if available
  getDirectionsUrl(destination: Location, origin?: Location): string {
    if (origin && origin.address !== 'Indore, Madhya Pradesh (Default)' && origin.address !== 'Indore, Madhya Pradesh (Timeout)' && origin.address !== 'Indore, Madhya Pradesh (Error)') {
      // Use actual user location
      return `https://maps.mapmyindia.com/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving&avoidTolls=false`;
    }
    return `https://maps.mapmyindia.com/directions?destination=${destination.lat},${destination.lng}&mode=driving`;
  }

  // Get Google Maps fallback URL with origin if available
  getGoogleMapsUrl(destination: Location, origin?: Location): string {
    if (origin && origin.address !== 'Indore, Madhya Pradesh (Default)' && origin.address !== 'Indore, Madhya Pradesh (Timeout)' && origin.address !== 'Indore, Madhya Pradesh (Error)') {
      // Use actual user location for turn-by-turn navigation
      return `https://www.google.com/maps/dir/${origin.lat},${origin.lng}/${destination.lat},${destination.lng}/@${destination.lat},${destination.lng},15z/data=!3m1!4b1!4m2!4m1!3e0`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=driving`;
  }

  // Get current location with faster timeout and better error handling
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('Geolocation not supported, using fallback location');
        resolve({
          lat: 22.7196,
          lng: 75.8577,
          address: "Indore, Madhya Pradesh (Default)"
        });
        return;
      }

      // Set a very fast timeout for navigation buttons
      const timeoutId = setTimeout(() => {
        console.log('Quick geolocation timeout, using fallback location');
        resolve({
          lat: 22.7196,
          lng: 75.8577,
          address: "Indore, Madhya Pradesh (Timeout)"
        });
      }, 1500); // Very fast timeout for immediate navigation

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          console.log('Got user location quickly:', position.coords);
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Your current location"
          });
        },
        (error) => {
          clearTimeout(timeoutId);
          console.log('Quick geolocation error:', error.message, 'using fallback location');
          resolve({
            lat: 22.7196,
            lng: 75.8577,
            address: "Indore, Madhya Pradesh (Error)"
          });
        },
        { enableHighAccuracy: true, timeout: 1000, maximumAge: 30000 } // Very aggressive settings for speed
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

  // Create an enhanced fallback with better visual representation
  createEnhancedFallbackMap(container: HTMLElement, destination: Location, origin?: Location) {
    const routeInfo = origin ? this.calculateDistance(origin, destination) : { distance: 'N/A', duration: 'N/A' };
    
    container.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 border-2 border-blue-300 rounded-lg overflow-hidden">
        <div class="bg-blue-600 text-white p-3 text-center">
          <h3 class="font-semibold text-sm">🧭 Navigation Preview</h3>
        </div>
        <div class="p-6 h-full flex flex-col justify-center">
          <div class="text-center mb-6">
            <div class="text-5xl mb-3">🎯</div>
            <h3 class="text-xl font-bold text-blue-800 mb-2">${destination.address || 'Parking Location'}</h3>
          </div>
          
          <div class="space-y-3 mb-6">
            <div class="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">📍 Destination</span>
                <span class="text-sm text-blue-600">${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}</span>
              </div>
            </div>
            
            ${origin ? `
            <div class="bg-white rounded-lg p-3 shadow-sm border border-green-100">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">📍 Your Location</span>
                <span class="text-sm text-green-600">${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}</span>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-3 border border-blue-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">📏 Distance</span>
                <span class="text-sm font-semibold text-blue-700">${routeInfo.distance}</span>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-sm font-medium text-gray-700">⏱️ Est. Time</span>
                <span class="text-sm font-semibold text-green-700">${routeInfo.duration}</span>
              </div>
            </div>
            ` : ''}
          </div>
          
          <div class="text-center bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div class="text-lg mb-2">🗺️</div>
            <p class="text-sm text-yellow-800 font-medium mb-1">Interactive Map Loading Failed</p>
            <p class="text-xs text-yellow-700">Use the navigation buttons below to get directions</p>
          </div>
        </div>
      </div>
    `;
  }
}

export const simpleMappls = new SimpleMappls();