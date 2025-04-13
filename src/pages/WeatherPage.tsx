
import React, { useState, useEffect } from 'react';
import { useWeather } from '@/features/weather/hooks/useWeather';
import WeatherHeader from '@/features/weather/components/WeatherHeader';
import CurrentWeather from '@/components/CurrentWeather';
import WeeklyGraph from '@/components/WeeklyGraph';

const WeatherPage: React.FC = () => {
  const {
    currentCity,
    currentWeather,
    forecast,
    isLoading,
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
              setLocationStatus("");
            } else {
              setLocationStatus("");
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
                  setLocationStatus("");
                }
              });
            },
            () => {
              // User denied permission when prompted
              setLocationStatus("");
              handleSearch('New York');
            }
          );
        } else {
          // Permission denied
          setLocationStatus("");
          handleSearch('New York');
        }
      }).catch(() => {
        // Error checking permission
        setLocationStatus("");
        handleSearch('New York');
      });
    } else {
      // Geolocation not supported
      setLocationStatus("");
      handleSearch('New York');
    }
  }, [handleLocationAccess, handleSearch]);

  const temperature = currentWeather?.current?.temperature_2m || 
                     (currentWeather?.main?.temp !== undefined ? Math.round(currentWeather.main.temp) : 0);
  
  const weatherCondition = currentWeather?.weather?.[0]?.main || "Clear";

  return (
    <div className="min-h-screen bg-[#FFDE5F] py-6 px-4">
      {currentWeather && (
        <WeatherHeader 
          city={currentWeather.name || currentCity} 
          country={currentWeather.sys?.country || ''} 
          temperature={temperature}
          condition={weatherCondition}
          onSearch={handleSearch} 
        />
      )}

      {locationStatus && (
        <div className="mb-4 text-sm text-black px-2">
          {locationStatus}
        </div>
      )}

      <CurrentWeather data={currentWeather} isLoading={isLoading} />
      
      <div className="mt-6">
        <WeeklyGraph data={forecast} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default WeatherPage;
