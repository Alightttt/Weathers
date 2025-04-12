
import { WeatherData } from '@/features/weather/types/weather';
import { degreesToDirection } from '@/lib/weather-utils';
import { MapPin, Droplets, Wind, Thermometer } from 'lucide-react';
import { AnimatedWeatherIcon } from './WeatherIcons';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface CurrentWeatherProps {
  data: WeatherData | null;
  isLoading: boolean;
}

const WeatherDetail = ({ 
  icon, 
  value, 
  label, 
  color = "bg-white/10" 
}: { 
  icon: React.ReactNode; 
  value: string; 
  label: string; 
  color?: string;
}) => {
  return (
    <div className={`${color} rounded-lg p-3 flex flex-col items-center justify-center min-w-20`}>
      <div className="mb-1 text-white/90">{icon}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="text-xs text-white/80">{label}</div>
    </div>
  );
};

const CurrentWeather = ({ data, isLoading }: CurrentWeatherProps) => {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (data?.weather && data.weather[0]) {
      const condition = data.weather[0].main;
      switch (condition) {
        case 'Clear':
          setAnimationClass("animate-pulse text-yellow-300");
          break;
        case 'Rain':
        case 'Drizzle':
          setAnimationClass("animate-bounce text-blue-300");
          break;
        case 'Thunderstorm':
          setAnimationClass("animate-lightning text-yellow-200");
          break;
        case 'Snow':
          setAnimationClass("animate-fade-in text-blue-100");
          break;
        default:
          setAnimationClass("");
      }
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <Card className="backdrop-blur-md bg-white/10 border-white/10 p-5 min-h-[180px] animate-pulse">
        <div className="flex flex-col items-center md:items-start md:flex-row md:justify-between">
          <div className="space-y-4 mb-6 md:mb-0">
            <Skeleton className="h-8 w-48 bg-white/10 rounded-md" />
            <Skeleton className="h-20 w-32 bg-white/10 rounded-md" />
            <Skeleton className="h-5 w-64 bg-white/10 rounded-md" />
          </div>
          <Skeleton className="h-24 w-24 rounded-full bg-white/10" />
        </div>
      </Card>
    );
  }

  const weatherCondition = data.weather?.[0]?.main || "Clear";
  const weatherDescription = data.weather?.[0]?.description || "clear";
  
  // Safely access wind direction
  let windDirection = 'N/A';
  if (data.current?.wind_direction_10m !== undefined) {
    windDirection = degreesToDirection(data.current.wind_direction_10m);
  } else if (data.wind?.deg !== undefined) {
    windDirection = degreesToDirection(data.wind.deg);
  }
  
  // Safely access temperature
  let temperature = 0;
  if (data.current?.temperature_2m !== undefined) {
    temperature = data.current.temperature_2m;
  } else if (data.main?.temp !== undefined) {
    temperature = Math.round(data.main.temp);
  }
  
  // Safely access humidity
  let humidity = 0;
  if (data.current?.relative_humidity_2m !== undefined) {
    humidity = data.current.relative_humidity_2m;
  } else if (data.main?.humidity !== undefined) {
    humidity = data.main.humidity;
  }
  
  // Safely access wind speed
  let windSpeed = 0;
  if (data.current?.wind_speed_10m !== undefined) {
    windSpeed = data.current.wind_speed_10m;
  } else if (data.wind?.speed !== undefined) {
    windSpeed = data.wind.speed;
  }

  // Safely access feels like
  let feelsLike = 0;
  if (data.current?.apparent_temperature !== undefined) {
    feelsLike = data.current.apparent_temperature;
  } else if (data.main?.feels_like !== undefined) {
    feelsLike = Math.round(data.main.feels_like);
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/10 p-4">
      <div className="flex items-center mb-1">
        <MapPin className="h-4 w-4 text-white mr-1" />
        <span className="text-white/90 text-sm">{data.name}, {data.sys?.country || ''}</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-6xl font-bold text-white flex items-start">
            {Math.round(temperature)}
            <span className="text-2xl mt-2">°C</span>
          </div>
          <div className="text-white/80 capitalize mt-1">{weatherDescription}</div>
          <div className="text-white/70 text-sm mt-3">
            Feels like {Math.round(feelsLike)}°C • {windDirection} wind
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 md:w-auto">
          <div className={`w-24 h-24 ${animationClass}`}>
            <AnimatedWeatherIcon weatherCondition={weatherCondition} size="large" />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto mt-4 pb-2 scrollbar-none">
        <WeatherDetail 
          icon={<Droplets className="h-5 w-5" />} 
          value={`${humidity}%`} 
          label="Humidity" 
        />
        
        <WeatherDetail 
          icon={<Wind className="h-5 w-5" />} 
          value={`${windSpeed} km/h`} 
          label={`${windDirection}`}
        />
        
        <WeatherDetail 
          icon={<Thermometer className="h-5 w-5" />} 
          value={`${Math.round(feelsLike)}°`} 
          label="Feels Like" 
        />
      </div>
    </Card>
  );
};

export default CurrentWeather;
