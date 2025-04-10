
import { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

interface CitySearchProps {
  onSearch: (city: string) => void;
  defaultCity: string;
}

const CitySearch = ({ onSearch, defaultCity }: CitySearchProps) => {
  const [city, setCity] = useState<string>(defaultCity);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full max-w-md">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={handleChange}
          className="pl-10 bg-black/20 border-white/10 focus:border-white/20 placeholder:text-muted-foreground/70"
        />
      </div>
      <Button type="submit" size="icon" variant="outline" className="bg-black/20 border-white/10 hover:bg-black/30">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
};

export default CitySearch;
