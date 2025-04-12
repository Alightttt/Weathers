
import { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface CitySearchProps {
  onSearch: (city: string) => void;
  defaultCity: string;
}

const CitySearch = ({ onSearch, defaultCity }: CitySearchProps) => {
  const [city, setCity] = useState<string>(defaultCity);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setIsExpanded(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };
  
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => document.getElementById('city-search')?.focus(), 100);
    }
  };

  return (
    <div className="relative z-20">
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="w-full flex items-center animate-fade-in">
          <Input
            id="city-search"
            type="text"
            placeholder="Search for a city..."
            value={city}
            onChange={handleChange}
            className="flex-1 bg-white/20 border-none placeholder:text-white/50 text-white focus-visible:ring-white/30 rounded-full h-10"
          />
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="ml-1 text-white/70 hover:text-white hover:bg-white/10"
            onClick={toggleSearch}
          >
            <X className="h-5 w-5" />
          </Button>
        </form>
      ) : (
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className="ml-auto text-white/70 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 flex items-center justify-center"
          onClick={toggleSearch}
        >
          <Search className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default CitySearch;
