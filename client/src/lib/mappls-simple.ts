import { Location } from './mappls';

const MAPPLS_API_KEY = "cc616d4dd3986c77dbbb4b4abb266036";

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

        console.log('Loading Mappls SDK with API key...');
        
        // Try a simpler approach first - load without callback
        const script = document.createElement('script');
        script.src = `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?v=3.0&layer=vector`;
        script.async = true;

        script.onload = () => {
          console.log('Mappls SDK script loaded from server');
          // Wait for SDK to be available
          const checkSDK = () => {
            if ((window as any).mappls) {
              console.log('Mappls SDK is available');
              try {
                this.createInteractiveMap(container, destination, origin);
                resolve();
              } catch (error) {
                console.error('Error creating interactive map:', error);
                reject(error);
              }
            } else {
              console.log('Waiting for Mappls SDK...');
              setTimeout(checkSDK, 100);
            }
          };
          checkSDK();
        };

        script.onerror = () => {
          console.error('Failed to load Mappls SDK script');
          reject(new Error('SDK script load failed'));
        };

        // Timeout after 20 seconds
        setTimeout(() => {
          if (!(window as any).mappls) {
            console.error('Mappls SDK loading timeout');
            reject(new Error('SDK load timeout'));
          }
        }, 20000);

        document.head.appendChild(script);
        console.log('Mappls SDK script added to page');
      } catch (error) {
        reject(error);
      }
    });
  }

  // Create interactive map using Mappls SDK
  private createInteractiveMap(container: HTMLElement, destination: Location, origin?: Location): void {
    try {
      // Clear container and create map div
      container.innerHTML = '';
      const mapDiv = document.createElement('div');
      mapDiv.style.width = '100%';
      mapDiv.style.height = '100%';
      mapDiv.style.borderRadius = '8px';
      mapDiv.style.position = 'relative';
      mapDiv.style.overflow = 'hidden';
      mapDiv.id = `map_${Date.now()}`;
      container.appendChild(mapDiv);

      // Add Mappls CSS if not already present
      if (!document.querySelector('link[href*="mappls"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?v=3.0&layer=vector`;
        document.head.appendChild(link);
      }

      console.log('Creating Mappls map instance...');

      // Ensure the div is properly attached before creating map
      setTimeout(() => {
        try {
          // Initialize the map with basic configuration
          const center = origin ? [(origin.lng + destination.lng) / 2, (origin.lat + destination.lat) / 2] : [destination.lng, destination.lat];
          
          console.log('Initializing map with center:', center);
          
          // Double-check the div exists before creating map
          const mapElement = document.getElementById(mapDiv.id);
          if (!mapElement) {
            console.error('Map div not found in DOM');
            return;
          }
          
          console.log('Map div confirmed in DOM, creating Map instance...');
          
          // Initialize Mappls Map with correct syntax
          const map = new (window as any).mappls.Map(mapDiv.id);
          
          // Set map properties
          map.setCenter(center);
          map.setZoom(origin ? 12 : 15);

          console.log('Map instance created successfully');

          // Wait for map to be loaded before adding markers
          map.on('load', () => {
            try {
              console.log('Map loaded event fired, adding markers...');

              // Add destination marker using proper Mappls API
              const destinationMarker = new (window as any).mappls.Marker({
                map: map,
                position: [destination.lng, destination.lat],
                title: destination.address || 'Destination'
              });

              console.log('Destination marker added successfully');

              // Add origin marker if available
              if (origin) {
                const originMarker = new (window as any).mappls.Marker({
                  map: map,
                  position: [origin.lng, origin.lat],
                  title: origin.address || 'Your Location'
                });

                console.log('Origin marker added successfully');

                // Center map to show both points
                try {
                  const centerLat = (origin.lat + destination.lat) / 2;
                  const centerLng = (origin.lng + destination.lng) / 2;
                  map.setCenter([centerLng, centerLat]);
                  map.setZoom(12);
                  console.log('Map centered successfully');
                } catch (boundsError) {
                  console.log('Could not center map, using default position');
                }
              }

              console.log('Interactive map setup completed successfully');
            } catch (markerError) {
              console.error('Error adding markers:', markerError);
            }
          });

          // Also add a timeout as backup
          setTimeout(() => {
            try {
              if (map && map.getCenter && !document.querySelector('.destination-marker')) {
                console.log('Backup marker addition triggered...');
                
                // Simple fallback markers without custom styling
                const simpleDestinationMarker = new (window as any).mappls.Marker({
                  map: map,
                  position: [destination.lng, destination.lat]
                });

                if (origin) {
                  const simpleOriginMarker = new (window as any).mappls.Marker({
                    map: map,
                    position: [origin.lng, origin.lat]
                  });
                }
                
                console.log('Backup markers added');
              }
            } catch (error) {
              console.log('Backup marker addition failed:', error);
            }
          }, 3000);

          // Handle map errors
          if (map.on) {
            map.on('error', (e: any) => {
              console.error('Map error:', e);
            });
          }

        } catch (mapError) {
          console.error('Error creating map instance:', mapError);
          // Fall back to enhanced fallback
          this.createEnhancedFallbackMap(container, destination, origin);
        }
      }, 200);

    } catch (error) {
      console.error('Error in createInteractiveMap:', error);
      // Fall back to enhanced fallback
      this.createEnhancedFallbackMap(container, destination, origin);
    }
  }

  // Add route to map if possible
  private addRouteToMap(map: any, origin: Location, destination: Location): void {
    try {
      // Try to get route using Mappls Directions API
      fetch(`https://apis.mappls.com/advancedmaps/v1/${this.apiKey}/route_adv/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full`)
        .then(response => response.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            
            // Add route source
            map.addSource('route', {
              'type': 'geojson',
              'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': route.geometry
              }
            });

            // Add route layer
            map.addLayer({
              'id': 'route',
              'type': 'line',
              'source': 'route',
              'layout': {
                'line-join': 'round',
                'line-cap': 'round'
              },
              'paint': {
                'line-color': '#3b82f6',
                'line-width': 4,
                'line-opacity': 0.8
              }
            });

            console.log('Route added to map successfully');
          }
        })
        .catch(error => {
          console.log('Could not load route, showing straight line');
          // Fallback: show a simple line
          this.addSimpleLineToMap(map, origin, destination);
        });
    } catch (error) {
      console.error('Error adding route:', error);
    }
  }

  // Add simple line between points as fallback
  private addSimpleLineToMap(map: any, origin: Location, destination: Location): void {
    try {
      map.addSource('simple-route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': [[origin.lng, origin.lat], [destination.lng, destination.lat]]
          }
        }
      });

      map.addLayer({
        'id': 'simple-route',
        'type': 'line',
        'source': 'simple-route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#6b7280',
          'line-width': 2,
          'line-dasharray': [2, 2],
          'line-opacity': 0.6
        }
      });
    } catch (error) {
      console.error('Error adding simple line:', error);
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