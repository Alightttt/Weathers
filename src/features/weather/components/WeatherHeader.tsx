
import React from 'react';
import LocationHeader from '@/components/LocationHeader';

interface WeatherHeaderProps {
  city: string;
  country: string;
  onSearch: (city: string) => void;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({ city, country, onSearch }) => {
  return (
    <LocationHeader city={city} country={country} onSearch={onSearch} />
  );
};

export default WeatherHeader;
