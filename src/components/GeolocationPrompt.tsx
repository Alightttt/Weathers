import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';

// This component is no longer used as we're directly requesting location in the WeatherPage
interface GeolocationPromptProps {
  onAllowLocation: () => void;
  onDenyLocation: () => void;
}

const GeolocationPrompt = ({ onAllowLocation, onDenyLocation }: GeolocationPromptProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [status, setStatus] = useState<string>("");

  return (
    <div>
      {/* This component is no longer used */}
    </div>
  );
};

export default GeolocationPrompt;
