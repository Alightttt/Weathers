import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';

interface LocationPromptProps {
  onAllowLocation: () => void;
  onDenyLocation: () => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ 
  onAllowLocation, 
  onDenyLocation 
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleAllowLocation = () => {
    setIsRequesting(true);
    setStatus("Requesting location access...");
    
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported by your browser");
      setTimeout(() => {
        onDenyLocation();
      }, 2000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus("Location access granted!");
        setTimeout(() => {
          setIsRequesting(false);
          onAllowLocation();
        }, 1000);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setStatus("Location access denied");
        setTimeout(() => {
          setIsRequesting(false);
          onDenyLocation();
        }, 2000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg">
      <div className="mb-4 text-center">
        <MapPin className="h-12 w-12 mx-auto mb-3 text-white" />
        <h2 className="text-xl font-medium mb-2 text-white">Weather Location</h2>
        <p className="text-white/80 text-sm mb-4">
          Allow access to your location for accurate local weather
        </p>
        
        {status && (
          <div className="text-sm py-2 px-4 rounded-md bg-white/10 text-white mb-4">
            {status}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Button 
          onClick={handleAllowLocation}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-xl"
          disabled={isRequesting}
        >
          {isRequesting ? "Getting Location..." : "Allow Location"}
        </Button>
        
        <Button 
          onClick={onDenyLocation}
          variant="outline"
          className="w-full border-white/10 bg-transparent text-white hover:bg-white/10 rounded-xl"
        >
          Use Default Location (New York)
        </Button>
      </div>
    </div>
  );
};

export default LocationPrompt;
