import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import locationService from '../services/location';

// Custom hook for managing app state
export const useAppState = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);
  const [tripHistory, setTripHistory] = useState([]);

  // Initialize app state
  useEffect(() => {
    const token = localStorage.getItem('masarak_token');
    if (token) {
      setIsAuthenticated(true);
      loadUserProfile();
    }
  }, []);

  // Load user profile
  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await apiService.getUserProfile();
      setUser(profile);
      setError(null);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError('فشل في تحميل الملف الشخصي');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      setError(null);
      return response;
    } catch (err) {
      console.error('Login failed:', err);
      setError('فشل في تسجيل الدخول');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      setError(null);
      return response;
    } catch (err) {
      console.error('Registration failed:', err);
      setError('فشل في إنشاء الحساب');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setFavoriteRoutes([]);
      setTripHistory([]);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      const position = await locationService.getCurrentPosition();
      setLocation(position);
      setError(null);
      return position;
    } catch (err) {
      console.error('Failed to get location:', err);
      setError('فشل في الحصول على الموقع الحالي');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search for routes
  const searchRoutes = useCallback(async (fromStation, toStation) => {
    try {
      setLoading(true);
      const results = await apiService.suggestRoute(fromStation, toStation);
      setError(null);
      return results;
    } catch (err) {
      console.error('Route search failed:', err);
      setError('فشل في البحث عن المسارات');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all routes
  const loadAllRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const allRoutes = await apiService.getAllRoutes();
      setRoutes(allRoutes);
      setError(null);
      return allRoutes;
    } catch (err) {
      console.error('Failed to load routes:', err);
      setError('فشل في تحميل الخطوط');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load favorite routes
  const loadFavoriteRoutes = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const favorites = await apiService.getFavoriteRoutes();
      setFavoriteRoutes(favorites);
      setError(null);
      return favorites;
    } catch (err) {
      console.error('Failed to load favorite routes:', err);
      setError('فشل في تحميل الخطوط المفضلة');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Add route to favorites
  const addToFavorites = useCallback(async (routeId) => {
    if (!isAuthenticated) return;
    
    try {
      await apiService.addToFavorites(routeId);
      await loadFavoriteRoutes(); // Reload favorites
      setError(null);
    } catch (err) {
      console.error('Failed to add to favorites:', err);
      setError('فشل في إضافة الخط إلى المفضلة');
      throw err;
    }
  }, [isAuthenticated, loadFavoriteRoutes]);

  // Remove route from favorites
  const removeFromFavorites = useCallback(async (routeId) => {
    if (!isAuthenticated) return;
    
    try {
      await apiService.removeFromFavorites(routeId);
      await loadFavoriteRoutes(); // Reload favorites
      setError(null);
    } catch (err) {
      console.error('Failed to remove from favorites:', err);
      setError('فشل في إزالة الخط من المفضلة');
      throw err;
    }
  }, [isAuthenticated, loadFavoriteRoutes]);

  // Load trip history
  const loadTripHistory = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const history = await apiService.getTripHistory();
      setTripHistory(history);
      setError(null);
      return history;
    } catch (err) {
      console.error('Failed to load trip history:', err);
      setError('فشل في تحميل سجل الرحلات');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Rate a trip
  const rateTrip = useCallback(async (tripId, rating, comment = '') => {
    if (!isAuthenticated) return;
    
    try {
      await apiService.rateTrip(tripId, rating, comment);
      await loadTripHistory(); // Reload history
      setError(null);
    } catch (err) {
      console.error('Failed to rate trip:', err);
      setError('فشل في تقييم الرحلة');
      throw err;
    }
  }, [isAuthenticated, loadTripHistory]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    location,
    routes,
    favoriteRoutes,
    tripHistory,
    
    // Actions
    login,
    register,
    logout,
    getCurrentLocation,
    searchRoutes,
    loadAllRoutes,
    loadFavoriteRoutes,
    addToFavorites,
    removeFromFavorites,
    loadTripHistory,
    rateTrip,
    clearError,
  };
};
