import { Location } from './mappls';

const MAPPLS_API_KEY = import.meta.env.VITE_MAPPLS_API_KEY;

export class SimpleMappls {
  private apiKey: string;

  constructor() {
    this.apiKey = MAPPLS_API_KEY;
  }

  // Initialize a reliable map using Mappls SDK or fallback
  createEmbeddedMap(containerId: string, destination: Location, origin?: Location): HTMLElement {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id ${containerId} not found`);
    }

    // Clear container
    container.innerHTML = '';

    // Try to load Mappls SDK first
    this.loadMapplsSDKAndCreateMap(container, destination, origin)
      .catch(() => {
        console.log('Mappls SDK failed, using enhanced fallback map');
        this.createEnhancedFallbackMap(container, destination, origin);
      });

    return container;
  }

  // Load Mappls SDK and create interactive map
  private async loadMapplsSDKAndCreateMap(container: HTMLElement, destination: Location, origin?: Location): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if SDK is already loaded
        if ((window as any).mappls) {
          this.createInteractiveMap(container, destination, origin);
          resolve();
          return;
        }

        // Load the SDK
        const script = document.createElement('script');
        script.src = `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?v=3.0&layer=vector`;
        script.async = true;

        script.onload = () => {
          console.log('Mappls SDK loaded successfully');
          try {
            this.createInteractiveMap(container, destination, origin);
            resolve();
          } catch (error) {
            console.error('Error creating interactive map:', error);
            reject(error);
          }
        };

        script.onerror = () => {
          console.error('Failed to load Mappls SDK');
          reject(new Error('SDK load failed'));
        };

        // Timeout after 10 seconds
        setTimeout(() => {
          reject(new Error('SDK load timeout'));
        }, 10000);

        document.head.appendChild(script);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Create interactive map using Mappls SDK
  private createInteractiveMap(container: HTMLElement, destination: Location, origin?: Location): void {
    try {
      // Create map container div
      const mapDiv = document.createElement('div');
      mapDiv.style.width = '100%';
      mapDiv.style.height = '100%';
      mapDiv.style.borderRadius = '8px';
      mapDiv.id = `map_${Date.now()}`;
      container.appendChild(mapDiv);

      // Initialize the map
      const center = origin ? [(origin.lng + destination.lng) / 2, (origin.lat + destination.lat) / 2] : [destination.lng, destination.lat];
      const map = new (window as any).mappls.Map(mapDiv.id, {
        center: center,
        zoom: origin ? 12 : 15
      });

      // Add destination marker
      new (window as any).mappls.Marker({
        color: '#ef4444'
      }).setLngLat([destination.lng, destination.lat]).addTo(map);

      // Add origin marker if available
      if (origin) {
        new (window as any).mappls.Marker({
          color: '#22c55e'
        }).setLngLat([origin.lng, origin.lat]).addTo(map);

        // Fit bounds to show both points
        const bounds = new (window as any).mappls.LngLatBounds();
        bounds.extend([origin.lng, origin.lat]);
        bounds.extend([destination.lng, destination.lat]);
        map.fitBounds(bounds, { padding: 50 });
      }

      console.log('Interactive map created successfully');
    } catch (error) {
      console.error('Error creating interactive map:', error);
      throw error;
    }
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

  // Create enhanced fallback map with better visual representation
  createEnhancedFallbackMap(container: HTMLElement, destination: Location, origin?: Location) {
    const routeInfo = origin ? this.calculateDistance(origin, destination) : { distance: 'N/A', duration: 'N/A' };
    
    container.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-lg flex flex-col items-center justify-center p-6 shadow-lg">
        <div class="text-center mb-6">
          <div class="text-6xl mb-3 animate-pulse">🗺️</div>
          <h3 class="text-xl font-bold text-blue-900 mb-3">${destination.address || 'Parking Destination'}</h3>
          <div class="bg-white rounded-lg p-4 shadow-md text-sm text-gray-700 space-y-2 max-w-sm">
            <div class="flex items-center justify-between">
              <span class="font-medium">📍 Location:</span>
              <span>${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}</span>
            </div>
            ${origin ? `
              <div class="flex items-center justify-between">
                <span class="font-medium">📏 Distance:</span>
                <span class="text-blue-600 font-semibold">${routeInfo.distance}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium">⏱️ Est. Time:</span>
                <span class="text-green-600 font-semibold">${routeInfo.duration}</span>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p class="text-sm text-yellow-800 font-medium mb-2">📱 Interactive Map Loading...</p>
          <p class="text-xs text-yellow-600">Use navigation buttons below for directions</p>
        </div>
      </div>
    `;
  }
}

export const simpleMappls = new SimpleMappls();