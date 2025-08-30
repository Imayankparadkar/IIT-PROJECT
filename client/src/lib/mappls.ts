const MAPPLS_API_KEY = "cc616d4dd3986c77dbbb4b4abb266036";

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface ParkingLocation extends Location {
  name: string;
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  distance?: string;
  amenities: string[];
}

export interface EVStation extends Location {
  name: string;
  availablePorts: number;
  totalPorts: number;
  pricePerKwh: number;
  distance: string;
  provider: string;
}

export class MapplsService {
  private apiKey: string;

  constructor() {
    this.apiKey = MAPPLS_API_KEY;
  }

  // Initialize Mappls Map
  async initializeMap(containerId: string, center: Location) {
    try {
      // Load Mappls SDK
      await this.loadMapplsSDK();
      
      const map = new (window as any).mappls.Map(containerId, {
        center: [center.lng, center.lat],
        zoom: 15
      });

      return map;
    } catch (error) {
      console.error('Error initializing map:', error);
      throw error;
    }
  }

  // Get directions between two points using Rest API
  async getDirections(origin: Location, destination: Location) {
    try {
      const response = await fetch(`https://apis.mappls.com/advancedmaps/v1/${this.apiKey}/route_adv/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full&steps=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get directions: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting directions:', error);
      throw error;
    }
  }

  // Initialize map with route between two points
  async initializeMapWithRoute(containerId: string, origin: Location, destination: Location) {
    try {
      // Load Mappls SDK
      await this.loadMapplsSDK();
      
      // Create map centered between origin and destination
      const centerLat = (origin.lat + destination.lat) / 2;
      const centerLng = (origin.lng + destination.lng) / 2;
      
      const map = new (window as any).mappls.Map(containerId, {
        center: [centerLng, centerLat],
        zoom: 12
      });

      // Wait for map to load
      await new Promise((resolve) => {
        map.on('load', resolve);
      });

      // Add markers for origin and destination
      const originMarker = new (window as any).mappls.Marker({
        color: '#22c55e'
      }).setLngLat([origin.lng, origin.lat]).addTo(map);

      const destinationMarker = new (window as any).mappls.Marker({
        color: '#ef4444'
      }).setLngLat([destination.lng, destination.lat]).addTo(map);

      // Get and display route
      try {
        const routeData = await this.getDirections(origin, destination);
        if (routeData.routes && routeData.routes.length > 0) {
          const route = routeData.routes[0];
          
          // Add route to map
          map.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': route.geometry
            }
          });

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
              'line-width': 6,
              'line-opacity': 0.8
            }
          });

          // Fit map to show entire route
          const coordinates = route.geometry.coordinates;
          if (coordinates && coordinates.length > 0) {
            const bounds = new (window as any).mappls.LngLatBounds();
            coordinates.forEach((coord: number[]) => bounds.extend(coord));
            map.fitBounds(bounds, { padding: 80 });
          }
        }
      } catch (routeError) {
        console.error('Error getting route:', routeError);
        // Still show markers and fit to bounds even if route fails
        const bounds = new (window as any).mappls.LngLatBounds();
        bounds.extend([origin.lng, origin.lat]);
        bounds.extend([destination.lng, destination.lat]);
        map.fitBounds(bounds, { padding: 80 });
      }

      return map;
    } catch (error) {
      console.error('Error initializing map with route:', error);
      throw error;
    }
  }

  // Find nearby parking spots
  async findNearbyParking(location: Location, radius: number = 5000): Promise<ParkingLocation[]> {
    // Mock data for demo - in production, this would call Mappls Places API
    const mockParkingSpots: ParkingLocation[] = [
      {
        name: "C21 Mall Indore",
        lat: 22.7196,
        lng: 75.8577,
        availableSlots: 12,
        totalSlots: 100,
        pricePerHour: 20,
        distance: "0.5 km",
        amenities: ["Security", "CCTV", "Valet Service"],
        address: "C21 Mall, AB Road, Indore"
      },
      {
        name: "Treasure Island Mall",
        lat: 22.7283,
        lng: 75.8641,
        availableSlots: 3,
        totalSlots: 80,
        pricePerHour: 25,
        distance: "1.2 km",
        amenities: ["Security", "Car Wash", "Food Court"],
        address: "Treasure Island Mall, MG Road, Indore"
      },
      {
        name: "Orbit Mall",
        lat: 22.7045,
        lng: 75.8732,
        availableSlots: 0,
        totalSlots: 150,
        pricePerHour: 30,
        distance: "2.1 km",
        amenities: ["Security", "Valet Service", "Car Service"],
        address: "Orbit Mall, Ring Road, Indore"
      }
    ];

    return mockParkingSpots;
  }

  // Find nearby EV stations
  async findNearbyEVStations(location: Location, radius: number = 10000): Promise<EVStation[]> {
    // Mock data for demo
    const mockEVStations: EVStation[] = [
      {
        name: "Tata Power Station",
        lat: 22.7156,
        lng: 75.8547,
        availablePorts: 4,
        totalPorts: 6,
        pricePerKwh: 8,
        distance: "0.5 km",
        provider: "Tata Power",
        address: "Near C21 Mall, AB Road, Indore"
      },
      {
        name: "BPCL Charging Hub",
        lat: 22.7223,
        lng: 75.8611,
        availablePorts: 2,
        totalPorts: 4,
        pricePerKwh: 7,
        distance: "1.2 km",
        provider: "BPCL",
        address: "MG Road, Indore"
      },
      {
        name: "ChargePoint Station",
        lat: 22.7098,
        lng: 75.8765,
        availablePorts: 1,
        totalPorts: 3,
        pricePerKwh: 9,
        distance: "2.3 km",
        provider: "ChargePoint",
        address: "Vijay Nagar, Indore"
      }
    ];

    return mockEVStations;
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

  private async loadMapplsSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).mappls) {
        console.log('Mappls SDK already loaded');
        resolve();
        return;
      }

      console.log('Loading Mappls SDK...');
      
      // Create callback function
      const callbackName = 'mapplsCallback_' + Date.now();
      (window as any)[callbackName] = () => {
        console.log('Mappls SDK callback executed successfully');
        // Clean up callback
        delete (window as any)[callbackName];
        resolve();
      };

      const script = document.createElement('script');
      // Updated SDK URL format for new auth mechanism (Aug 2025)
      script.src = `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?v=3.0&layer=vector&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Mappls script loaded from server');
      };
      
      script.onerror = (error) => {
        console.error('Script loading error:', error);
        console.error('Failed URL:', script.src);
        delete (window as any)[callbackName];
        reject(new Error(`Failed to load Mappls SDK from: ${script.src}`));
      };

      // Timeout after 20 seconds
      setTimeout(() => {
        if ((window as any)[callbackName]) {
          console.error('Mappls SDK loading timeout after 20 seconds');
          console.error('Script URL was:', script.src);
          delete (window as any)[callbackName];
          reject(new Error('Mappls SDK loading timeout'));
        }
      }, 20000);

      document.head.appendChild(script);
      console.log('Mappls SDK script added to head with URL:', script.src);
    });
  }

  // Create simple directions URL for external navigation
  getDirectionsUrl(destination: Location): string {
    return `https://maps.mapmyindia.com/directions?destination=${destination.lat},${destination.lng}`;
  }

  // Simple map initialization for testing using Rest/Map SDK key
  async initializeBasicMap(containerId: string, center: Location) {
    try {
      console.log('Initializing basic map with Rest/Map SDK key...');
      await this.loadMapplsSDK();
      
      console.log('Creating map instance...');
      const map = new (window as any).mappls.Map(containerId, {
        center: [center.lng, center.lat],
        zoom: 15
      });

      // Wait for map to be ready
      await new Promise((resolve) => {
        map.on('load', () => {
          console.log('Map loaded successfully');
          resolve(true);
        });
      });

      // Add a simple marker
      console.log('Adding marker to map...');
      new (window as any).mappls.Marker({
        color: '#ef4444'
      }).setLngLat([center.lng, center.lat]).addTo(map);

      console.log('Basic map initialization complete');
      return map;
    } catch (error) {
      console.error('Error initializing basic map:', error);
      throw error;
    }
  }
}

export const mapplsService = new MapplsService();
