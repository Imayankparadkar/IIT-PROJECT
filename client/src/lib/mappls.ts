const MAPPLS_API_KEY = "b963a6654470c7b9e0683f0a979ffa16";

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
        zoom: 15,
        style: 'mappls://styles/mappls/streets-v1'
      });

      return map;
    } catch (error) {
      console.error('Error initializing map:', error);
      throw error;
    }
  }

  // Get directions between two points
  async getDirections(origin: Location, destination: Location) {
    try {
      const response = await fetch(`https://apis.mappls.com/advancedmaps/v1/${this.apiKey}/route_adv/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full`);
      
      if (!response.ok) {
        throw new Error('Failed to get directions');
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
        zoom: 12,
        style: 'mappls://styles/mappls/streets-v1'
      });

      // Add markers for origin and destination
      const originMarker = new (window as any).mappls.Marker({
        color: 'green'
      }).setLngLat([origin.lng, origin.lat]).addTo(map);

      const destinationMarker = new (window as any).mappls.Marker({
        color: 'red'
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
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75
            }
          });

          // Fit map to route bounds
          const coordinates = route.geometry.coordinates;
          const bounds = new (window as any).mappls.LngLatBounds();
          coordinates.forEach((coord: number[]) => bounds.extend(coord));
          map.fitBounds(bounds, { padding: 50 });
        }
      } catch (routeError) {
        console.error('Error getting route:', routeError);
        // Still show markers even if route fails
        const bounds = new (window as any).mappls.LngLatBounds();
        bounds.extend([origin.lng, origin.lat]);
        bounds.extend([destination.lng, destination.lat]);
        map.fitBounds(bounds, { padding: 50 });
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
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://apis.mappls.com/advancedmaps/api/${this.apiKey}/map_sdk?layer=vector&v=3.0&callback=initMappls`;
      script.async = true;
      script.defer = true;
      
      (window as any).initMappls = () => {
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Mappls SDK'));
      };

      document.head.appendChild(script);
    });
  }

  // Create simple directions URL for external navigation
  getDirectionsUrl(destination: Location): string {
    return `https://maps.mappls.com/directions?destination=${destination.lat},${destination.lng}`;
  }
}

export const mapplsService = new MapplsService();
