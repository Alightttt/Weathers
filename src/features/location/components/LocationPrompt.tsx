
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, AlertCircle } from 'lucide-react';

interface LocationPromptProps {
  onAllowLocation: () => void;
  onDenyLocation: () => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ 
  onAllowLocation, 
  onDenyLocation 
}) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllowLocation = () => {
    setIsRequesting(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      onDenyLocation();
      setIsRequesting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        toast.success("Location access granted!");
        setIsRequesting(false);
        onAllowLocation();
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Could not access your location");
        setIsRequesting(false);
        onDenyLocation();
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="glass-card p-8 animate-fade-in">
      <div className="mb-6 text-center">
        <MapPin className="h-16 w-16 mx-auto mb-4 text-blue-400" />
        <h2 className="text-2xl font-semibold mb-2">Use Your Location</h2>
        <p className="text-gray-300">
          For the best weather experience, allow access to your location.
        </p>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={handleAllowLocation}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isRequesting}
        >
          {isRequesting ? "Requesting Access..." : "Allow Location Access"}
        </Button>
        
        <Button 
          onClick={onDenyLocation}
          variant="outline"
          className="w-full border-white/10 bg-transparent text-white hover:bg-white/10"
        >
          Use Default Location (Berlin)
        </Button>
      </div>

      <div className="mt-6 flex items-start gap-2 text-xs text-gray-400">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Your location is never stored on our servers and is only used to fetch
          local weather information.
        </p>
      </div>
    </div>
  );
};

export default LocationPrompt;
