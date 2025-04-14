
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
    
    // Refresh the page after a short delay to allow the weather data to update
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDenyLocation = () => {
    onDenyLocation();
    
    // Refresh the page after selecting default location
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="text-center p-6 bg-black/30 backdrop-blur-md rounded-3xl border border-white/10">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-500/30 flex items-center justify-center">
          <MapPin className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-white mb-2">Location Access</h2>
      <p className="text-white/80 mb-6">
        Allow access to your location for accurate weather information for your area.
      </p>
      
      <div className="space-y-3">
        <Button 
          onClick={handleAllowLocation}
          disabled={isRequesting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isRequesting ? "Getting location..." : "Allow location access"}
        </Button>
        
        <Button 
          onClick={handleDenyLocation}
          variant="outline" 
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          Use default location
        </Button>
      </div>
    </div>
  );
};

export default GeolocationPrompt;
