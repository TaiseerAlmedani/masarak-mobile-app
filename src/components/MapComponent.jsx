import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  MapPin, 
  Navigation, 
  Zap, 
  Route as RouteIcon,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react'
import mapsService from '../services/maps'

const MapComponent = ({ 
  center, 
  zoom = 12, 
  markers = [], 
  routes = [], 
  onLocationSelect,
  className = "",
  height = "300px",
  showControls = true 
}) => {
  const mapRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentCenter, setCurrentCenter] = useState(center || mapsService.defaultCenter)
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const [selectedMarker, setSelectedMarker] = useState(null)

  // Mock map rendering using a visual representation
  const renderMapTiles = () => {
    const tiles = []
    const gridSize = 8
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        tiles.push(
          <div
            key={`${i}-${j}`}
            className="absolute border border-gray-200/30"
            style={{
              left: `${(j / gridSize) * 100}%`,
              top: `${(i / gridSize) * 100}%`,
              width: `${100 / gridSize}%`,
              height: `${100 / gridSize}%`,
              backgroundColor: `hsl(${200 + (i + j) * 2}, 20%, ${85 + (i + j) % 10}%)`
            }}
          />
        )
      }
    }
    
    return tiles
  }

  const renderMarkers = () => {
    return markers.map((marker, index) => (
      <div
        key={marker.id || index}
        className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-10 hover:z-20"
        style={{
          left: `${50 + (index - markers.length / 2) * 15}%`,
          top: `${40 + (index % 2) * 20}%`
        }}
        onClick={() => {
          setSelectedMarker(marker)
          if (onLocationSelect) {
            onLocationSelect(marker)
          }
        }}
      >
        <div className="relative">
          <MapPin 
            className={`h-8 w-8 ${marker.type === 'station' ? 'text-blue-600' : 'text-red-600'} drop-shadow-lg`}
            fill="currentColor"
          />
          {marker.title && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
              {marker.title}
            </div>
          )}
        </div>
      </div>
    ))
  }

  const renderRoutes = () => {
    return routes.map((route, index) => (
      <div
        key={route.id || index}
        className="absolute z-5"
        style={{
          left: '20%',
          top: `${30 + index * 10}%`,
          width: '60%',
          height: '4px'
        }}
      >
        <div
          className="h-full rounded-full opacity-80"
          style={{ backgroundColor: route.color || '#2563eb' }}
        />
        <div className="absolute -top-6 left-0 text-xs font-medium text-gray-700">
          {route.name}
        </div>
      </div>
    ))
  }

  const handleZoomIn = () => {
    setCurrentZoom(Math.min(currentZoom + 1, 18))
  }

  const handleZoomOut = () => {
    setCurrentZoom(Math.max(currentZoom - 1, 1))
  }

  const handleResetView = () => {
    setCurrentCenter(mapsService.defaultCenter)
    setCurrentZoom(12)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Navigation className="h-5 w-5 masarak-blue" />
            <span>الخريطة</span>
          </CardTitle>
          {showControls && (
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="ghost" size="sm" onClick={handleResetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapRef}
          className="relative bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden"
          style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}
        >
          {/* Map tiles background */}
          {renderMapTiles()}
          
          {/* Damascus landmarks overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Damascus Old City */}
            <div 
              className="absolute w-16 h-16 bg-yellow-200/60 rounded-full border-2 border-yellow-600/40"
              style={{ left: '45%', top: '45%' }}
            />
            <div 
              className="absolute text-xs font-semibold text-yellow-800"
              style={{ left: '42%', top: '52%' }}
            >
              دمشق القديمة
            </div>
            
            {/* Umayyad Square */}
            <div 
              className="absolute w-3 h-3 bg-blue-600 rounded-full"
              style={{ left: '48%', top: '48%' }}
            />
            <div 
              className="absolute text-xs text-blue-800"
              style={{ left: '45%', top: '40%' }}
            >
              ساحة الأمويين
            </div>
            
            {/* Mezzeh area */}
            <div 
              className="absolute w-12 h-8 bg-green-200/60 rounded border border-green-600/40"
              style={{ left: '25%', top: '35%' }}
            />
            <div 
              className="absolute text-xs text-green-800"
              style={{ left: '22%', top: '30%' }}
            >
              المزة
            </div>
          </div>
          
          {/* Routes */}
          {renderRoutes()}
          
          {/* Markers */}
          {renderMarkers()}
          
          {/* Map controls */}
          {showControls && (
            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleZoomIn}
                className="w-8 h-8 p-0"
              >
                +
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleZoomOut}
                className="w-8 h-8 p-0"
              >
                -
              </Button>
            </div>
          )}
          
          {/* Zoom level indicator */}
          <div className="absolute bottom-4 left-4 z-20">
            <Badge variant="secondary" className="text-xs">
              تكبير: {currentZoom}x
            </Badge>
          </div>
          
          {/* Scale indicator */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-white/90 px-2 py-1 rounded text-xs border">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-12 h-0.5 bg-black"></div>
                <span>1 كم</span>
              </div>
            </div>
          </div>
          
          {/* Attribution */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
            © OpenStreetMap contributors | مسارك
          </div>
        </div>
        
        {/* Selected marker info */}
        {selectedMarker && (
          <div className="p-4 border-t bg-muted/30">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{selectedMarker.title}</h4>
                {selectedMarker.description && (
                  <p className="text-sm text-muted-foreground">{selectedMarker.description}</p>
                )}
                {selectedMarker.routes && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedMarker.routes.map((route, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {route}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedMarker(null)}
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MapComponent
