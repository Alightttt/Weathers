
import React, { useEffect, useRef, useState } from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useWeather } from '@/features/weather/hooks/useWeather';

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentWeather } = useWeather();
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // Simple map visualization using a mockup
    if (mapRef.current && !mapLoaded) {
      const mapElement = mapRef.current;
      
      // Create map mockup with weather indicators
      const createMapVisual = () => {
        // Set background
        mapElement.style.background = "url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=4&size=600x400&maptype=roadmap&key=YOUR_API_KEY') center/cover";
        
        // Weather indicators would be added here in a real implementation
        const weatherMarkers = document.createElement('div');
        weatherMarkers.className = 'absolute inset-0 z-10';
        weatherMarkers.innerHTML = `
          <div class="absolute top-1/4 left-1/4 flex flex-col items-center">
            <div class="bg-yellow-500 rounded-full p-1 mb-1">
              <span class="text-xs text-white">27°</span>
            </div>
            <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
          
          <div class="absolute top-1/3 left-2/3 flex flex-col items-center">
            <div class="bg-blue-500 rounded-full p-1 mb-1">
              <span class="text-xs text-white">14°</span>
            </div>
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          <div class="absolute top-2/3 left-1/2 flex flex-col items-center">
            <div class="bg-gray-500 rounded-full p-1 mb-1">
              <span class="text-xs text-white">18°</span>
            </div>
            <div class="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
          </div>
        `;
        
        mapElement.appendChild(weatherMarkers);
        setMapLoaded(true);
      };
      
      createMapVisual();
    }
  }, [mapLoaded]);
  
  return (
    <WeatherLayout bgGradient="from-gray-700 to-gray-900">
      <div className="relative z-10">
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
        
        <Card className="bg-white/10 backdrop-blur-xl rounded-lg h-[500px] relative overflow-hidden">
          <div ref={mapRef} className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            {!mapLoaded && (
              <div className="text-white/70 flex flex-col items-center">
                <MapPin className="h-8 w-8 mb-2 animate-bounce" />
                <p>Loading Weather Map...</p>
              </div>
            )}
          </div>
        </Card>
        
        {currentWeather && (
          <div className="mt-4 bg-white/10 backdrop-blur-md p-4 rounded-lg">
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
