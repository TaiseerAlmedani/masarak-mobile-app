import { useState, useEffect } from 'react'
import { installPWA, isPWAInstalled, handleAppShortcuts, checkForUpdates } from './utils/pwa'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Navigation, 
  MapPin, 
  Route as RouteIcon, 
  Search, 
  Star, 
  Clock, 
  ArrowRight,
  Home,
  History,
  User,
  Settings,
  ChevronLeft,
  Bus,
  Zap,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  AlertCircle,
  Loader2,
  MapPinIcon,
  Navigation2,
  Map
} from 'lucide-react'
import { useAppState } from './hooks/useAppState'
import locationService from './services/location'
import mapsService from './services/maps'
import MapComponent from './components/MapComponent'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [fromStation, setFromStation] = useState('')
  const [toStation, setToStation] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [nearbyStations, setNearbyStations] = useState([])
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [showMapDialog, setShowMapDialog] = useState(false)
  const [mapMarkers, setMapMarkers] = useState([])
  const [mapRoutes, setMapRoutes] = useState([])
  
  const {
    user,
    isAuthenticated,
    loading,
    error,
    location,
    routes,
    favoriteRoutes,
    tripHistory,
    searchRoutes,
    getCurrentLocation,
    loadFavoriteRoutes,
    loadTripHistory,
    clearError
  } = useAppState()

  // Load initial data and PWA setup
  useEffect(() => {
    if (isAuthenticated) {
      loadFavoriteRoutes()
      loadTripHistory()
    }
    loadInitialMapData()
    
    // PWA initialization
    handleAppShortcuts()
    checkForUpdates()
  }, [isAuthenticated, loadFavoriteRoutes, loadTripHistory])

  // Load nearby stations when location changes
  useEffect(() => {
    if (location) {
      loadNearbyStations()
    }
  }, [location])

  const loadInitialMapData = () => {
    // Load Damascus stations as map markers
    const damascusStations = [
      {
        id: 1,
        title: 'ساحة الأمويين',
        lat: 33.5123,
        lng: 36.2919,
        type: 'station',
        routes: ['خط المزة جبل', 'خط الصالحية'],
        description: 'محطة رئيسية في وسط دمشق'
      },
      {
        id: 2,
        title: 'ساحة العباسيين',
        lat: 33.5089,
        lng: 36.2847,
        type: 'station',
        routes: ['خط جادات سلمية'],
        description: 'محطة مهمة في دمشق القديمة'
      },
      {
        id: 3,
        title: 'المزة',
        lat: 33.5234,
        lng: 36.2456,
        type: 'station',
        routes: ['خط المزة جبل'],
        description: 'منطقة المزة السكنية'
      },
      {
        id: 4,
        title: 'جادات سلمية',
        lat: 33.4987,
        lng: 36.3123,
        type: 'station',
        routes: ['خط جادات سلمية'],
        description: 'منطقة جادات سلمية'
      }
    ]
    
    setMapMarkers(damascusStations)
    
    // Load route lines
    const routeLines = [
      {
        id: 1,
        name: 'خط المزة جبل',
        color: '#2563eb',
        stations: ['المزة', 'الجبل', 'ساحة الأمويين', 'وسط البلد']
      },
      {
        id: 2,
        name: 'خط جادات سلمية',
        color: '#dc2626',
        stations: ['جادات سلمية', 'شارع الثورة', 'البحصة', 'ساحة المحافظة']
      }
    ]
    
    setMapRoutes(routeLines)
  }

  const loadNearbyStations = async () => {
    try {
      // Mock nearby stations data
      const mockStations = [
        { name: 'ساحة الأمويين', distance: '200م', routes: 3, latitude: 33.5123, longitude: 36.2919 },
        { name: 'ساحة العباسيين', distance: '450م', routes: 2, latitude: 33.5089, longitude: 36.2847 },
        { name: 'باب توما', distance: '600م', routes: 4, latitude: 33.5156, longitude: 36.3089 }
      ]
      setNearbyStations(mockStations)
    } catch (err) {
      console.error('Failed to load nearby stations:', err)
    }
  }

  const handleSearch = async () => {
    if (!fromStation || !toStation) return
    
    try {
      // For demo purposes, use mock data
      const mockResults = {
        direct: [
          {
            id: 1,
            route: 'خط المزة جبل',
            color: '#2563eb',
            stations: ['المزة', 'الجبل', 'ساحة الأمويين', 'وسط البلد'],
            duration: '25 دقيقة',
            price: 2500,
            rating: 4.5
          }
        ],
        transfer: [
          {
            id: 2,
            route1: 'خط جادات سلمية',
            route2: 'خط المزة جبل',
            transferStation: 'ساحة المحافظة',
            duration: '35 دقيقة',
            price: 5500,
            rating: 4.2
          }
        ]
      }
      
      setSearchResults(mockResults)
      
      // Add to recent searches if authenticated
      if (isAuthenticated) {
        console.log('Saving search to history:', { from: fromStation, to: toStation })
      }
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  const clearSearch = () => {
    setFromStation('')
    setToStation('')
    setSearchResults(null)
  }

  const handleGetLocation = async () => {
    try {
      setShowLocationDialog(true)
      await getCurrentLocation()
      setShowLocationDialog(false)
    } catch (err) {
      setShowLocationDialog(false)
      console.error('Location error:', err)
    }
  }

  const handleUseCurrentLocation = async (field) => {
    try {
      const position = await getCurrentLocation()
      const address = await locationService.reverseGeocode(position.latitude, position.longitude)
      
      if (field === 'from') {
        setFromStation(address)
      } else {
        setToStation(address)
      }
    } catch (err) {
      console.error('Failed to get current location:', err)
    }
  }

  const handleShowMap = () => {
    setShowMapDialog(true)
  }

  const handleMapLocationSelect = (marker) => {
    console.log('Selected location:', marker)
    // You could use this to set the from/to fields
  }

  return (
    <div className="mobile-container bg-background rtl-grid">
      {/* Header */}
      <header className="masarak-gradient text-white p-4 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Navigation className="h-8 w-8" />
            <h1 className="text-2xl font-bold">مسارك</h1>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={handleShowMap}
            >
              <Map className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20"
              onClick={handleGetLocation}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation2 className="h-5 w-5" />
              )}
            </Button>
            {!isPWAInstalled() && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
                onClick={installPWA}
                title="تثبيت التطبيق"
              >
                <Zap className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <p className="text-white/90 text-sm">دليلك للمواصلات العامة في دمشق</p>
        {location && (
          <p className="text-white/80 text-xs mt-1">
            📍 الموقع الحالي متاح
          </p>
        )}
      </header>

      {/* Error Alert */}
      {error && (
        <Alert className="m-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {error}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearError}
              className="mr-2 text-red-600 hover:text-red-800"
            >
              إغلاق
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Search Section */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-6 fade-in-mobile">
              {/* Quick Search Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Search className="h-5 w-5 masarak-blue" />
                    <span>البحث عن مسار</span>
                  </CardTitle>
                  <CardDescription>أدخل نقطة الانطلاق والوجهة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">من</Label>
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        id="from"
                        placeholder="نقطة الانطلاق"
                        value={fromStation}
                        onChange={(e) => setFromStation(e.target.value)}
                        className="text-right flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseCurrentLocation('from')}
                        disabled={loading}
                        className="touch-button"
                      >
                        <MapPinIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">إلى</Label>
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        id="to"
                        placeholder="الوجهة"
                        value={toStation}
                        onChange={(e) => setToStation(e.target.value)}
                        className="text-right flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseCurrentLocation('to')}
                        disabled={loading}
                        className="touch-button"
                      >
                        <MapPinIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button 
                      onClick={handleSearch} 
                      disabled={loading || !fromStation || !toStation}
                      className="flex-1 touch-button masarak-bg-blue"
                    >
                      {loading ? (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Search className="ml-2 h-4 w-4" />
                          البحث
                        </>
                      )}
                    </Button>
                    {(fromStation || toStation) && (
                      <Button variant="outline" onClick={clearSearch} className="touch-button">
                        مسح
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Mini Map */}
              <MapComponent
                markers={mapMarkers}
                routes={mapRoutes}
                onLocationSelect={handleMapLocationSelect}
                height="200px"
                showControls={false}
                className="cursor-pointer"
                onClick={handleShowMap}
              />

              {/* Search Results */}
              {searchResults && (
                <div className="space-y-4 slide-up">
                  <h3 className="text-lg font-semibold">نتائج البحث</h3>
                  
                  {/* Direct Routes */}
                  {searchResults.direct.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-md font-medium text-green-600">مسارات مباشرة</h4>
                      {searchResults.direct.map((route, index) => (
                        <Card key={index} className="border-r-4" style={{ borderRightColor: route.color }}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-semibold">{route.route}</h5>
                                <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{route.duration}</span>
                                  <span>•</span>
                                  <span>{route.price.toLocaleString()} ل.س</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{route.rating}</span>
                              </div>
                            </div>
                            <div className="route-line py-2">
                              {route.stations.map((station, idx) => (
                                <div key={idx} className="route-station flex items-center py-1">
                                  <span className="text-sm mr-4">{station}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex space-x-2 space-x-reverse mt-3">
                              <Button className="flex-1 masarak-bg-blue">
                                اختيار هذا المسار
                              </Button>
                              <Button variant="outline" onClick={handleShowMap}>
                                <Map className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Transfer Routes */}
                  {searchResults.transfer.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-md font-medium text-orange-600">مسارات مع تحويل</h4>
                      {searchResults.transfer.map((route, index) => (
                        <Card key={index} className="border-r-4 border-r-orange-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-semibold">مسار مع تحويل</h5>
                                <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{route.duration}</span>
                                  <span>•</span>
                                  <span>{route.price.toLocaleString()} ل.س</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{route.rating}</span>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Bus className="h-4 w-4 text-blue-600" />
                                <span>{route.route1}</span>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse mr-6">
                                <ArrowRight className="h-4 w-4 text-orange-500" />
                                <span>تحويل في {route.transferStation}</span>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Bus className="h-4 w-4 text-red-600" />
                                <span>{route.route2}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2 space-x-reverse mt-3">
                              <Button className="flex-1 masarak-bg-blue">
                                اختيار هذا المسار
                              </Button>
                              <Button variant="outline" onClick={handleShowMap}>
                                <Map className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleGetLocation}>
                  <CardContent className="p-4 text-center">
                    <MapPin className="h-8 w-8 masarak-blue mx-auto mb-2" />
                    <h4 className="font-medium">المحطات القريبة</h4>
                    <p className="text-xs text-muted-foreground">اعثر على أقرب محطة</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleShowMap}>
                  <CardContent className="p-4 text-center">
                    <Map className="h-8 w-8 masarak-blue mx-auto mb-2" />
                    <h4 className="font-medium">عرض الخريطة</h4>
                    <p className="text-xs text-muted-foreground">استكشف المحطات</p>
                  </CardContent>
                </Card>
              </div>

              {/* Nearby Stations */}
              {nearbyStations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <MapPin className="h-5 w-5 masarak-blue" />
                      <span>المحطات القريبة</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {nearbyStations.map((station, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <h5 className="font-medium">{station.name}</h5>
                          <p className="text-sm text-muted-foreground">{station.routes} خطوط متاحة</p>
                        </div>
                        <Badge variant="secondary">{station.distance}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="p-4 space-y-4 fade-in-mobile">
              <h2 className="text-xl font-bold">البحثات الأخيرة</h2>
              {!isAuthenticated ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">سجل دخولك لرؤية السجل</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      قم بتسجيل الدخول لحفظ ومراجعة بحثاتك السابقة
                    </p>
                    <Button className="masarak-bg-blue">تسجيل الدخول</Button>
                  </CardContent>
                </Card>
              ) : tripHistory.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">لا توجد رحلات سابقة</h3>
                    <p className="text-sm text-muted-foreground">
                      ابدأ بالبحث عن مسارات لرؤية سجل رحلاتك هنا
                    </p>
                  </CardContent>
                </Card>
              ) : (
                tripHistory.map((trip, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="font-medium">{trip.from}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{trip.to}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{trip.time}</p>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="p-4 space-y-4 fade-in-mobile">
              <h2 className="text-xl font-bold">الخطوط المفضلة</h2>
              {!isAuthenticated ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">سجل دخولك لحفظ المفضلة</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      قم بتسجيل الدخول لحفظ خطوطك المفضلة والوصول إليها بسهولة
                    </p>
                    <Button className="masarak-bg-blue">تسجيل الدخول</Button>
                  </CardContent>
                </Card>
              ) : favoriteRoutes.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">لا توجد خطوط مفضلة</h3>
                    <p className="text-sm text-muted-foreground">
                      أضف خطوط إلى المفضلة لرؤيتها هنا
                    </p>
                  </CardContent>
                </Card>
              ) : (
                favoriteRoutes.map((route, index) => (
                  <Card key={index} className="border-r-4" style={{ borderRightColor: route.color }}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{route.name}</h4>
                          <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                            <span>{route.price.toLocaleString()} ل.س</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{route.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-4 space-y-6 fade-in-mobile">
              {!isAuthenticated ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">مرحباً بك في مسارك</h3>
                    <p className="text-muted-foreground mb-6">
                      سجل دخولك للاستفادة من جميع ميزات التطبيق
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full masarak-bg-blue">تسجيل الدخول</Button>
                      <Button variant="outline" className="w-full">إنشاء حساب جديد</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h2 className="text-xl font-bold">{user?.name || 'المستخدم'}</h2>
                    <p className="text-muted-foreground">مستخدم منذ {user?.createdAt || 'يناير 2024'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <RouteIcon className="h-8 w-8 masarak-blue mx-auto mb-2" />
                        <h4 className="font-bold text-lg">{user?.tripCount || 0}</h4>
                        <p className="text-sm text-muted-foreground">رحلة</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <h4 className="font-bold text-lg">{user?.averageRating || '0.0'}</h4>
                        <p className="text-sm text-muted-foreground">التقييم</p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              <div className="space-y-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Settings className="h-5 w-5 masarak-blue" />
                      <span>الإعدادات</span>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Phone className="h-5 w-5 masarak-blue" />
                      <span>اتصل بنا</span>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <MessageCircle className="h-5 w-5 masarak-blue" />
                      <span>الدعم الفني</span>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t safe-area-bottom">
        <div className="grid grid-cols-4 h-16">
          <Button
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            className="h-full rounded-none flex-col space-y-1 touch-button"
            onClick={() => setActiveTab('home')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">الرئيسية</span>
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            className="h-full rounded-none flex-col space-y-1 touch-button"
            onClick={() => setActiveTab('history')}
          >
            <History className="h-5 w-5" />
            <span className="text-xs">السجل</span>
          </Button>
          <Button
            variant={activeTab === 'favorites' ? 'default' : 'ghost'}
            className="h-full rounded-none flex-col space-y-1 touch-button"
            onClick={() => setActiveTab('favorites')}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">المفضلة</span>
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            className="h-full rounded-none flex-col space-y-1 touch-button"
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">الملف الشخصي</span>
          </Button>
        </div>
      </nav>

      {/* Map Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>خريطة دمشق - محطات المواصلات</DialogTitle>
            <DialogDescription>
              استكشف محطات المواصلات العامة في دمشق
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 pt-0">
            <MapComponent
              markers={mapMarkers}
              routes={mapRoutes}
              onLocationSelect={handleMapLocationSelect}
              height="60vh"
              showControls={true}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Permission Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>طلب إذن الموقع</DialogTitle>
            <DialogDescription>
              يحتاج التطبيق إلى إذن الوصول للموقع لإظهار المحطات القريبة منك
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button variant="outline" onClick={() => setShowLocationDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleGetLocation} className="masarak-bg-blue">
              السماح
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
