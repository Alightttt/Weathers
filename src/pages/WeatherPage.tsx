
import React, { useState, useEffect } from 'react';
import { useWeather } from '@/features/weather/hooks/useWeather';
import { toast } from "sonner";
import WeatherLayout from '@/components/layout/WeatherLayout';
import WeatherHeader from '@/features/weather/components/WeatherHeader';
import WeatherDashboard from '@/features/weather/components/WeatherDashboard';

const WeatherPage: React.FC = () => {
  const {
    currentCity,
    currentWeather,
    forecast,
    isLoading,
    bgGradient,
    handleSearch,
    handleLocationAccess
  } = useWeather();
  const [locationStatus, setLocationStatus] = useState<string>("");

  useEffect(() => {
    // Check if browser supports geolocation
    if (navigator.geolocation) {
      // Try to get user location automatically
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          // Location permission already granted, get weather
          setLocationStatus("Getting weather for your location...");
          handleLocationAccess().then(success => {
            if (success) {
              setLocationStatus("Using your location");
              toast.success("Weather updated using your location");
            } else {
              setLocationStatus("Could not access location. Using New York");
              handleSearch('New York');
            }
          });
        } else if (result.state === 'prompt') {
          // Will be asked for permission
          navigator.geolocation.getCurrentPosition(
            () => {
              setLocationStatus("Getting weather for your location...");
              handleLocationAccess().then(success => {
                if (success) {
                  setLocationStatus("Using your location");
                  toast.success("Weather updated using your location");
                }
              });
            },
            () => {
              // User denied permission when prompted
              setLocationStatus("Using default location: New York");
              handleSearch('New York');
              toast.info("Using default location: New York. Allow location access for local weather.");
            }
          );
        } else {
          // Permission denied
          setLocationStatus("Using default location: New York");
          handleSearch('New York');
        }
      }).catch(() => {
        // Error checking permission
        setLocationStatus("Using default location: New York");
        handleSearch('New York');
      });
    } else {
      // Geolocation not supported
      setLocationStatus("Using default location: New York");
      handleSearch('New York');
    }
  }, [handleLocationAccess, handleSearch]);

  return (
    <WeatherLayout bgGradient={bgGradient}>
      {currentWeather && (
        <WeatherHeader 
          city={currentWeather.name || currentCity} 
          country={currentWeather.sys?.country || ''} 
          onSearch={handleSearch} 
        />
      )}

      {locationStatus && (
        <div className="mb-4 text-sm text-white/70 px-2">
          {locationStatus}
        </div>
      )}

      <WeatherDashboard
        currentWeather={currentWeather}
        forecast={forecast}
        isLoading={isLoading}
      />
    </WeatherLayout>
  );
};

export default WeatherPage;
