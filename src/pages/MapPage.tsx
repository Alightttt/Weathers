
import React, { useEffect, useRef, useState } from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { MapPin, ArrowLeft, Layers, ZoomIn, ZoomOut, Compass, LocateFixed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useWeather } from '@/features/weather/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentWeather } = useWeather();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'temperature'>('standard');
  
  useEffect(() => {
    // Enhanced map visualization
    if (mapRef.current && !mapLoaded) {
      const mapElement = mapRef.current;
      
      // Create map mockup with weather indicators
      const createMapVisual = () => {
        // Set map background based on type
        let backgroundUrl = '';
        
        switch (mapType) {
          case 'satellite':
            backgroundUrl = 'https://maptiles.p.rapidapi.com/satellite/0/0/0.jpg?rapidapi-key=your-api-key';
            break;
          case 'temperature':
            backgroundUrl = 'https://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?appid=your-api-key&opacity=0.9&fill_bound=true';
            break;
          default:
            backgroundUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=4&size=800x600&maptype=roadmap';
        }
        
        // Set background with fallback
        mapElement.style.background = `url('${backgroundUrl}') center/cover, linear-gradient(to bottom, #1E293B, #0F172A)`;
        
        // Add weather markers
        const weatherMarkers = document.createElement('div');
        weatherMarkers.className = 'absolute inset-0 z-10';
        weatherMarkers.innerHTML = `
          <div class="absolute top-1/4 left-1/4 flex flex-col items-center">
            <div class="bg-blue-500 rounded-full p-1.5 shadow-lg mb-1">
              <span class="text-xs text-white font-bold">27°</span>
            </div>
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          <div class="absolute top-1/3 left-2/3 flex flex-col items-center">
            <div class="bg-blue-500 rounded-full p-1.5 shadow-lg mb-1">
              <span class="text-xs text-white font-bold">14°</span>
            </div>
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          <div class="absolute top-2/3 left-1/2 flex flex-col items-center">
            <div class="bg-blue-500 rounded-full p-1.5 shadow-lg mb-1">
              <span class="text-xs text-white font-bold">18°</span>
            </div>
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          <div class="absolute top-1/2 left-1/4 flex flex-col items-center">
            <div class="bg-blue-500 rounded-full p-1.5 shadow-lg mb-1">
              <span class="text-xs text-white font-bold">22°</span>
            </div>
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        `;
        
        // Add current location marker if we have weather data
        if (currentWeather && currentWeather.coord) {
          const currentLocationMarker = document.createElement('div');
          currentLocationMarker.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20';
          currentLocationMarker.innerHTML = `
            <div class="bg-red-500 rounded-full p-2 shadow-lg mb-1 animate-pulse">
              <span class="text-xs text-white font-bold">${Math.round(currentWeather.main?.temp || 0)}°</span>
            </div>
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          `;
          weatherMarkers.appendChild(currentLocationMarker);
        }
        
        mapElement.appendChild(weatherMarkers);
        setMapLoaded(true);
      };
      
      createMapVisual();
    }
  }, [mapLoaded, mapType, currentWeather]);

  const handleMapTypeChange = () => {
    const types: ('standard' | 'satellite' | 'temperature')[] = ['standard', 'satellite', 'temperature'];
    const currentIndex = types.indexOf(mapType);
    const nextType = types[(currentIndex + 1) % types.length];
    setMapType(nextType);
    setMapLoaded(false); // Reload map
    toast.success(`Map type changed to ${nextType}`);
  };
  
  const handleZoomIn = () => {
    toast.info("Zooming in");
  };
  
  const handleZoomOut = () => {
    toast.info("Zooming out");
  };

  const handleMyLocation = () => {
    toast.info("Locating your position");
  };
  
  return (
    <WeatherLayout bgGradient="from-gray-700 to-gray-900">
      <div className="relative z-10 pb-20">
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/" 
            className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium text-white">Weather Map</h1>
          <div className="w-9"></div>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-xl rounded-2xl h-[400px] md:h-[500px] relative overflow-hidden">
          <div ref={mapRef} className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            {!mapLoaded && (
              <div className="text-white/70 flex flex-col items-center">
                <MapPin className="h-8 w-8 mb-2 animate-bounce" />
                <p>Loading Weather Map...</p>
              </div>
            )}
          </div>
          
          {/* Map controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-10 w-10 rounded-full bg-white/20 border-0 backdrop-blur-md hover:bg-white/30"
              onClick={handleMapTypeChange}
            >
              <Layers className="h-5 w-5 text-white" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-10 w-10 rounded-full bg-white/20 border-0 backdrop-blur-md hover:bg-white/30"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-5 w-5 text-white" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-10 w-10 rounded-full bg-white/20 border-0 backdrop-blur-md hover:bg-white/30"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-5 w-5 text-white" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-10 w-10 rounded-full bg-white/20 border-0 backdrop-blur-md hover:bg-white/30"
              onClick={handleMyLocation}
            >
              <LocateFixed className="h-5 w-5 text-white" />
            </Button>
          </div>
        </Card>
        
        <div className="mt-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white/90 font-medium mb-1">Map Type</h2>
              <p className="text-white/70 text-sm capitalize">{mapType}</p>
            </div>
            
            <Button 
              onClick={handleMapTypeChange}
              variant="outline" 
              className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0"
              size="sm"
            >
              <Compass className="h-4 w-4 mr-2" />
              Change Map
            </Button>
          </div>
        </div>
        
        {currentWeather && (
          <div className="mt-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
            <h2 className="text-white/90 font-medium mb-2">Current Location</h2>
            <p className="text-white">{currentWeather.name}, {currentWeather.sys?.country}</p>
            <p className="text-white/70 text-sm">
              {Math.round(currentWeather.main?.temp || 0)}°C - {currentWeather.weather?.[0]?.description}
            </p>
          </div>
        )}
      </div>
    </WeatherLayout>
  );
};

export default MapPage;
