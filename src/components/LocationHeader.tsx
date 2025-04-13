
import { ChevronDown } from 'lucide-react';
import CitySearch from './CitySearch';

interface LocationHeaderProps {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  onSearch: (city: string) => void;
}

const LocationHeader = ({ city, country, temperature, condition, onSearch }: LocationHeaderProps) => {
  return (
    <div className="flex flex-col items-start mb-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-1">
          <h2 className="text-2xl font-bold text-black">
            {city}
          </h2>
          <ChevronDown className="h-5 w-5 text-black" />
        </div>
        <CitySearch onSearch={onSearch} defaultCity={city} />
      </div>
      <div className="flex items-end space-x-2">
        <span className="text-5xl font-medium text-black">{Math.round(temperature)}°</span>
        <span className="text-2xl font-medium text-black mb-1">{condition}</span>
      </div>
    </div>
  );
};

export default LocationHeader;
