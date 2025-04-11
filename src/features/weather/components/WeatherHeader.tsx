
import React from 'react';
import CitySearch from '@/components/CitySearch';
import LocationHeader from '@/components/LocationHeader';

interface WeatherHeaderProps {
  city: string;
  country: string;
  onSearch: (city: string) => void;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({ city, country, onSearch }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <div className="flex-1">
        <LocationHeader city={city} country={country} />
      </div>
      <div className="w-full md:w-64">
        <CitySearch onSearch={onSearch} defaultCity={city} />
      </div>
    </div>
  );
};

export default WeatherHeader;
