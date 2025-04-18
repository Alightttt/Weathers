
import React from 'react';
import { MapPin } from 'lucide-react';
import CitySearch from '@/components/CitySearch';

interface WeatherHeaderProps {
  city: string;
  country: string;
  onSearch: (city: string) => void;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({ city, country, onSearch }) => {
  // Format current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    weekday: 'short'
  });
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <div className="bg-white/20 rounded-full p-1.5 mr-2">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">
              {city}
              {country ? `, ${country}` : ''}
            </h2>
            <p className="text-xs text-white/70">
              {formattedDate}
            </p>
          </div>
        </div>
        <CitySearch onSearch={onSearch} defaultCity={city} />
      </div>
    </div>
  );
};

export default WeatherHeader;
