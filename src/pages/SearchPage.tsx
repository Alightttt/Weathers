
import React, { useState } from 'react';
import WeatherLayout from '@/components/layout/WeatherLayout';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, ArrowLeft, X } from 'lucide-react';
import { useWeather } from '@/features/weather/hooks/useWeather';

const POPULAR_CITIES = [
  { name: 'London', country: 'GB' },
  { name: 'New York', country: 'US' },
  { name: 'Tokyo', country: 'JP' },
  { name: 'Paris', country: 'FR' },
  { name: 'Sydney', country: 'AU' },
  { name: 'Berlin', country: 'DE' },
  { name: 'Dubai', country: 'AE' },
  { name: 'Moscow', country: 'RU' },
];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { handleSearch } = useWeather();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
      navigate('/');
    }
  };
  
  const handleCitySelect = (city: string) => {
    handleSearch(city);
    navigate('/');
  };
  
  return (
    <WeatherLayout bgGradient="from-blue-500 to-blue-700">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="bg-white/20 rounded-full p-2 text-white hover:bg-white/30 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <form onSubmit={handleSubmitSearch} className="flex-1 flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a city..."
                className="pl-10 pr-10 bg-white/20 border-none text-white placeholder:text-white/50 focus-visible:ring-white/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" className="ml-2 bg-white/20 text-white hover:bg-white/30 border-none">
              Search
            </Button>
          </form>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 animate-fade-in">
          <h3 className="text-white/90 font-medium mb-4">Popular Cities</h3>
          <div className="grid grid-cols-2 gap-3">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city.name)}
                className="bg-white/10 rounded-xl p-3 text-left hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-white/70" />
                <div>
                  <div className="text-white font-medium">{city.name}</div>
                  <div className="text-xs text-white/70">{city.country}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </WeatherLayout>
  );
};

const Link = ({ to, children, className = '' }) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };
  
  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default SearchPage;
