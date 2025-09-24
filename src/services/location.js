// Location service for Masarak mobile app
class LocationService {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
  }

  // Check if geolocation is supported
  isSupported() {
    return 'geolocation' in navigator;
  }

  // Get current position
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
      ...options,
    };

    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          resolve(this.currentPosition);
        },
        (error) => {
          let errorMessage = 'Unknown location error';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'تم رفض الإذن للوصول إلى الموقع';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'معلومات الموقع غير متاحة';
              break;
            case error.TIMEOUT:
              errorMessage = 'انتهت مهلة طلب الموقع';
              break;
          }
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }

  // Watch position changes
  watchPosition(callback, errorCallback, options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options,
    };

    if (!this.isSupported()) {
      errorCallback(new Error('Geolocation is not supported by this browser'));
      return null;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        callback(this.currentPosition);
      },
      (error) => {
        let errorMessage = 'Unknown location error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض الإذن للوصول إلى الموقع';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متاحة';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب الموقع';
            break;
        }
        errorCallback(new Error(errorMessage));
      },
      defaultOptions
    );

    return this.watchId;
  }

  // Stop watching position
  clearWatch() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Format distance for display
  formatDistance(distanceKm) {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}م`;
    } else {
      return `${distanceKm.toFixed(1)}كم`;
    }
  }

  // Find nearest stations to current position
  async findNearestStations(stations, maxResults = 5) {
    try {
      const position = await this.getCurrentPosition();
      
      const stationsWithDistance = stations.map(station => ({
        ...station,
        distance: this.calculateDistance(
          position.latitude,
          position.longitude,
          station.latitude,
          station.longitude
        ),
      }));

      // Sort by distance and return top results
      return stationsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxResults)
        .map(station => ({
          ...station,
          formattedDistance: this.formatDistance(station.distance),
        }));
    } catch (error) {
      console.error('Error finding nearest stations:', error);
      throw error;
    }
  }

  // Get address from coordinates (reverse geocoding)
  async reverseGeocode(latitude, longitude) {
    // This would typically use a geocoding service like Google Maps
    // For now, return a mock address based on Damascus areas
    const damascusAreas = [
      'دمشق القديمة',
      'المزة',
      'أبو رمانة',
      'المالكي',
      'الشعلان',
      'القصاع',
      'المهاجرين',
      'الصالحية',
      'باب توما',
      'القيمرية'
    ];
    
    const randomArea = damascusAreas[Math.floor(Math.random() * damascusAreas.length)];
    return `${randomArea}, دمشق, سوريا`;
  }

  // Request location permission
  async requestPermission() {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    try {
      const position = await this.getCurrentPosition();
      return { granted: true, position };
    } catch (error) {
      return { granted: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const locationService = new LocationService();
export default locationService;
