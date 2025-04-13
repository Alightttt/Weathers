
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';

interface GeolocationPromptProps {
  onAllowLocation: () => void;
  onDenyLocation: () => void;
}

const GeolocationPrompt = ({ onAllowLocation, onDenyLocation }: GeolocationPromptProps) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllowLocation = () => {
    setIsRequesting(true);
    onAllowLocation();
  };

  return (
    <div className="text-center p-6 bg-[#FFDE5F] rounded-3xl">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
          <MapPin className="h-8 w-8 text-black" />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-black mb-2">Weather Widgets</h2>
      <p className="text-black mb-6">
        Allow access to your location for accurate weather information.
      </p>
      
      <div className="space-y-3">
        <Button 
          onClick={handleAllowLocation}
          disabled={isRequesting}
          className="w-full bg-black hover:bg-black/90 text-white"
        >
          {isRequesting ? "Getting location..." : "Allow location access"}
        </Button>
        
        <Button 
          onClick={onDenyLocation}
          variant="outline" 
          className="w-full border-black text-black hover:bg-black/10"
        >
          Use default location
        </Button>
      </div>
    </div>
  );
};

export default GeolocationPrompt;
