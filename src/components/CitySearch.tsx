
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
            placeholder="Search city..."
            value={city}
            onChange={handleChange}
            className="flex-1 bg-white/50 border-none placeholder:text-black/50 text-black focus-visible:ring-black/30 rounded-md h-9 text-sm"
          />
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="ml-1 text-black/70 hover:text-black hover:bg-black/10 h-8 w-8"
            onClick={toggleSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className="text-black/70 hover:text-black hover:bg-black/10 rounded-md h-8 w-8 flex items-center justify-center"
          onClick={toggleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CitySearch;
