// Maps service using OpenStreetMap and Leaflet as a free alternative to Google Maps
// This service provides mapping functionality optimized for Syria and Damascus

class MapsService {
  constructor() {
    this.defaultCenter = [33.5138, 36.2765]; // Damascus coordinates
    this.defaultZoom = 12;
    this.mapInstance = null;
    this.markers = [];
    
    // OpenStreetMap tile servers
    this.tileServers = {
      osm: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
      },
      humanitarian: {
        url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors, Tiles courtesy of Humanitarian OpenStreetMap Team'
      },
      cartodb: {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors, © CARTO'
      }
    };
    
    // Damascus districts and areas for better geocoding
    this.damascusAreas = {
      'دمشق القديمة': [33.5123, 36.2919],
      'المزة': [33.5234, 36.2456],
      'أبو رمانة': [33.5089, 36.2847],
      'المالكي': [33.5156, 36.3089],
      'الشعلان': [33.5067, 36.2734],
      'القصاع': [33.5201, 36.2623],
      'المهاجرين': [33.5298, 36.2891],
      'الصالحية': [33.5345, 36.2756],
      'باب توما': [33.5156, 36.3089],
      'القيمرية': [33.5098, 36.2945],
      'ساحة الأمويين': [33.5123, 36.2919],
      'ساحة العباسيين': [33.5089, 36.2847],
      'ساحة المحافظة': [33.5067, 36.2734],
      'جادات سلمية': [33.4987, 36.3123],
      'الكسوة': [33.4234, 36.2456],
      'وسط البلد': [33.5098, 36.2945]
    };
  }

  // Initialize Leaflet map (this would be called when the map component mounts)
  async initializeMap(containerId, options = {}) {
    try {
      // This is a placeholder for Leaflet initialization
      // In a real implementation, you would load Leaflet library and create the map
      const mapOptions = {
        center: options.center || this.defaultCenter,
        zoom: options.zoom || this.defaultZoom,
        ...options
      };
      
      console.log('Initializing map with options:', mapOptions);
      
      // Mock map instance
      this.mapInstance = {
        id: containerId,
        center: mapOptions.center,
        zoom: mapOptions.zoom,
        markers: []
      };
      
      return this.mapInstance;
    } catch (error) {
      console.error('Failed to initialize map:', error);
      throw error;
    }
  }

  // Get coordinates for a location name (geocoding)
  async geocodeLocation(locationName) {
    try {
      // First, check if it's a known Damascus area
      const normalizedName = locationName.trim();
      if (this.damascusAreas[normalizedName]) {
        return {
          lat: this.damascusAreas[normalizedName][0],
          lng: this.damascusAreas[normalizedName][1],
          display_name: `${normalizedName}, دمشق, سوريا`,
          confidence: 1.0
        };
      }

      // Use Nominatim API (OpenStreetMap's geocoding service)
      const query = encodeURIComponent(`${locationName}, Damascus, Syria`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&countrycodes=sy&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const results = await response.json();
      
      if (results.length === 0) {
        // Fallback: try searching without Damascus
        const fallbackQuery = encodeURIComponent(`${locationName}, Syria`);
        const fallbackResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${fallbackQuery}&limit=3&countrycodes=sy&addressdetails=1`
        );
        
        if (fallbackResponse.ok) {
          const fallbackResults = await fallbackResponse.json();
          if (fallbackResults.length > 0) {
            return {
              lat: parseFloat(fallbackResults[0].lat),
              lng: parseFloat(fallbackResults[0].lon),
              display_name: fallbackResults[0].display_name,
              confidence: 0.7
            };
          }
        }
        
        throw new Error('Location not found');
      }
      
      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon),
        display_name: results[0].display_name,
        confidence: 0.9
      };
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw error;
    }
  }

  // Reverse geocoding - get location name from coordinates
  async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ar`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding request failed');
      }
      
      const result = await response.json();
      
      if (!result.display_name) {
        // Fallback to nearest known area
        return this.findNearestKnownArea(lat, lng);
      }
      
      return {
        display_name: result.display_name,
        address: result.address || {},
        confidence: 0.9
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Fallback to nearest known area
      return this.findNearestKnownArea(lat, lng);
    }
  }

  // Find the nearest known Damascus area
  findNearestKnownArea(lat, lng) {
    let nearestArea = 'دمشق';
    let minDistance = Infinity;
    
    Object.entries(this.damascusAreas).forEach(([areaName, coords]) => {
      const distance = this.calculateDistance(lat, lng, coords[0], coords[1]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestArea = areaName;
      }
    });
    
    return {
      display_name: `${nearestArea}, دمشق, سوريا`,
      address: { city: 'دمشق', country: 'سوريا' },
      confidence: 0.6
    };
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get route between two points (using OSRM - Open Source Routing Machine)
  async getRoute(startLat, startLng, endLat, endLng, profile = 'driving') {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`
      );
      
      if (!response.ok) {
        throw new Error('Routing request failed');
      }
      
      const result = await response.json();
      
      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        return {
          geometry: route.geometry,
          distance: route.distance, // in meters
          duration: route.duration, // in seconds
          steps: route.legs[0].steps || [],
          confidence: 0.9
        };
      }
      
      throw new Error('No route found');
    } catch (error) {
      console.error('Routing failed:', error);
      // Return a simple straight line as fallback
      return {
        geometry: {
          type: 'LineString',
          coordinates: [[startLng, startLat], [endLng, endLat]]
        },
        distance: this.calculateDistance(startLat, startLng, endLat, endLng) * 1000,
        duration: this.calculateDistance(startLat, startLng, endLat, endLng) * 60, // rough estimate
        steps: [],
        confidence: 0.3
      };
    }
  }

  // Add marker to map
  addMarker(lat, lng, options = {}) {
    const marker = {
      id: Date.now() + Math.random(),
      lat,
      lng,
      title: options.title || '',
      icon: options.icon || 'default',
      popup: options.popup || null,
      ...options
    };
    
    this.markers.push(marker);
    
    if (this.mapInstance) {
      this.mapInstance.markers.push(marker);
    }
    
    return marker;
  }

  // Remove marker from map
  removeMarker(markerId) {
    this.markers = this.markers.filter(marker => marker.id !== markerId);
    
    if (this.mapInstance) {
      this.mapInstance.markers = this.mapInstance.markers.filter(
        marker => marker.id !== markerId
      );
    }
  }

  // Clear all markers
  clearMarkers() {
    this.markers = [];
    
    if (this.mapInstance) {
      this.mapInstance.markers = [];
    }
  }

  // Get map bounds for multiple points
  getBounds(points) {
    if (points.length === 0) return null;
    
    let minLat = points[0].lat;
    let maxLat = points[0].lat;
    let minLng = points[0].lng;
    let maxLng = points[0].lng;
    
    points.forEach(point => {
      minLat = Math.min(minLat, point.lat);
      maxLat = Math.max(maxLat, point.lat);
      minLng = Math.min(minLng, point.lng);
      maxLng = Math.max(maxLng, point.lng);
    });
    
    return {
      southwest: { lat: minLat, lng: minLng },
      northeast: { lat: maxLat, lng: maxLng },
      center: {
        lat: (minLat + maxLat) / 2,
        lng: (minLng + maxLng) / 2
      }
    };
  }

  // Format distance for display
  formatDistance(distanceMeters) {
    if (distanceMeters < 1000) {
      return `${Math.round(distanceMeters)}م`;
    } else {
      return `${(distanceMeters / 1000).toFixed(1)}كم`;
    }
  }

  // Format duration for display
  formatDuration(durationSeconds) {
    const minutes = Math.round(durationSeconds / 60);
    if (minutes < 60) {
      return `${minutes} دقيقة`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} ساعة ${remainingMinutes} دقيقة`;
    }
  }

  // Get tile server URL for map rendering
  getTileServerUrl(serverType = 'osm') {
    return this.tileServers[serverType] || this.tileServers.osm;
  }

  // Check if coordinates are within Damascus bounds
  isWithinDamascus(lat, lng) {
    // Rough bounds for Damascus metropolitan area
    const damascusBounds = {
      north: 33.6,
      south: 33.4,
      east: 36.4,
      west: 36.1
    };
    
    return (
      lat >= damascusBounds.south &&
      lat <= damascusBounds.north &&
      lng >= damascusBounds.west &&
      lng <= damascusBounds.east
    );
  }
}

// Create and export a singleton instance
const mapsService = new MapsService();
export default mapsService;
