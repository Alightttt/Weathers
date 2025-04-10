
import { MapPin } from 'lucide-react';

interface LocationHeaderProps {
  city: string;
  country: string;
}

const LocationHeader = ({ city, country }: LocationHeaderProps) => {
  // Format current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div className="flex items-center mb-2 sm:mb-0">
        <MapPin className="h-5 w-5 mr-2 text-white/80" />
        <h2 className="text-xl font-medium">
          {city}, {country}
        </h2>
      </div>
      <p className="text-sm text-white/70">
        {formattedDate}
      </p>
    </div>
  );
};

export default LocationHeader;
