// API service for Masarak mobile app
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('masarak_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('masarak_token', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('masarak_token');
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    this.removeToken();
  }

  // Route methods
  async getAllRoutes() {
    return this.request('/routes/all');
  }

  async suggestRoute(fromStation, toStation) {
    return this.request('/routes/suggest', {
      method: 'POST',
      body: JSON.stringify({
        from_station_name: fromStation,
        to_station_name: toStation,
      }),
    });
  }

  async rateTrip(tripId, rating, comment = '') {
    return this.request('/routes/rate', {
      method: 'POST',
      body: JSON.stringify({
        trip_id: tripId,
        rating,
        comment,
      }),
    });
  }

  // Station methods
  async getNearbyStations(latitude, longitude, radius = 1000) {
    // This would be implemented when we have geolocation support
    // For now, return mock data
    return {
      stations: [
        { name: 'ساحة الأمويين', distance: '200م', routes: 3, latitude: 33.5123, longitude: 36.2919 },
        { name: 'ساحة العباسيين', distance: '450م', routes: 2, latitude: 33.5089, longitude: 36.2847 },
        { name: 'باب توما', distance: '600م', routes: 4, latitude: 33.5156, longitude: 36.3089 }
      ]
    };
  }

  // User methods
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Trip history methods
  async getTripHistory() {
    return this.request('/user/trips');
  }

  // Favorites methods
  async getFavoriteRoutes() {
    return this.request('/user/favorites');
  }

  async addToFavorites(routeId) {
    return this.request('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ route_id: routeId }),
    });
  }

  async removeFromFavorites(routeId) {
    return this.request(`/user/favorites/${routeId}`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for easier importing
export const {
  register,
  login,
  logout,
  getAllRoutes,
  suggestRoute,
  rateTrip,
  getNearbyStations,
  getUserProfile,
  updateUserProfile,
  getTripHistory,
  getFavoriteRoutes,
  addToFavorites,
  removeFromFavorites,
} = apiService;
