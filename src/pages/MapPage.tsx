
import React from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MapPage: React.FC = () => {
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
          <div className="w-9"></div> {/* Empty div for balanced layout */}
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl h-[500px] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center flex-col text-white/70">
            <MapPin className="h-8 w-8 mb-2" />
            <p>Weather Map Feature Coming Soon</p>
          </div>
        </div>
      </div>
    </WeatherLayout>
  );
};

export default MapPage;
