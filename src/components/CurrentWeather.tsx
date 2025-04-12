
import { WeatherData } from '@/features/weather/types/weather';
import { degreesToDirection } from '@/lib/weather-utils';
import { Droplets, Wind, Thermometer, CloudRain, Compass } from 'lucide-react';
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
  color = "bg-blue-500/30" 
}: { 
  icon: React.ReactNode; 
  value: string; 
  label: string; 
  color?: string;
}) => {
  return (
    <div className={`${color} rounded-xl p-3 flex flex-col items-center justify-center min-w-[90px] shadow-lg`}>
      <div className="mb-1 text-white/90">{icon}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="text-xs text-white/80">{label}</div>
    </div>
  );
};

const CurrentWeather = ({ data, isLoading }: CurrentWeatherProps) => {
  const [animationClass, setAnimationClass] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState<string>(localStorage.getItem('temperatureUnit') || '°C');
  const [windSpeedUnit, setWindSpeedUnit] = useState<string>(localStorage.getItem('windSpeedUnit') || 'km/h');

  useEffect(() => {
    // Set temperature unit from settings
    const savedTempUnit = localStorage.getItem('temperatureUnit');
    if (savedTempUnit) {
      setTemperatureUnit(savedTempUnit);
    }

    // Set wind speed unit from settings
    const savedWindUnit = localStorage.getItem('windSpeedUnit');
    if (savedWindUnit) {
      setWindSpeedUnit(savedWindUnit);
    }

    // Set weather animation based on condition
    if (data?.weather && data.weather[0]) {
      const condition = data.weather[0].main;
      switch (condition) {
        case 'Clear':
          setAnimationClass("animate-pulse text-yellow-300");
          document.documentElement.style.setProperty('--weather-animation', 'sunny');
          break;
        case 'Rain':
        case 'Drizzle':
          setAnimationClass("animate-bounce text-blue-300");
          document.documentElement.style.setProperty('--weather-animation', 'rainy');
          break;
        case 'Thunderstorm':
          setAnimationClass("animate-lightning text-yellow-200");
          document.documentElement.style.setProperty('--weather-animation', 'stormy');
          break;
        case 'Snow':
          setAnimationClass("animate-fade-in text-blue-100");
          document.documentElement.style.setProperty('--weather-animation', 'snowy');
          break;
        case 'Clouds':
          setAnimationClass("animate-float text-gray-300");
          document.documentElement.style.setProperty('--weather-animation', 'cloudy');
          break;
        default:
          setAnimationClass("");
          document.documentElement.style.setProperty('--weather-animation', 'default');
      }
    }
  }, [data]);

  // Convert temperature based on unit
  const convertTemperature = (temp: number): number => {
    if (temperatureUnit === '°C') {
      return temp;
    } else {
      // Convert to Fahrenheit
      return (temp * 9/5) + 32;
    }
  };

  // Convert wind speed based on unit
  const convertWindSpeed = (speed: number): number => {
    if (windSpeedUnit === 'km/h') {
      return speed;
    } else {
      // Convert to mph
      return speed * 0.621371;
    }
  };

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

  // Convert temperature and wind speed based on settings
  const displayTemperature = Math.round(convertTemperature(temperature));
  const displayFeelsLike = Math.round(convertTemperature(feelsLike));
  const displayWindSpeed = Math.round(convertWindSpeed(windSpeed));

  return (
    <Card className="backdrop-blur-md bg-black/40 border-white/10 p-4 relative z-20 rounded-3xl shadow-xl">
      <div className="flex items-center mb-1">
        <span className="text-white/90 text-sm">{data.name}, {data.sys?.country || ''}</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-7xl font-bold text-white flex items-start">
            {displayTemperature}
            <span className="text-2xl mt-2">{temperatureUnit}</span>
          </div>
          <div className="text-white/90 capitalize mt-1 text-lg">{weatherDescription}</div>
          <div className="text-white/80 text-sm mt-2">
            Feels like {displayFeelsLike}{temperatureUnit} • {windDirection} wind
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 md:w-auto">
          <div className={`w-24 h-24 relative z-20 ${animationClass}`}>
            <AnimatedWeatherIcon weatherCondition={weatherCondition} size="medium" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <WeatherDetail 
          icon={<Droplets className="h-5 w-5" />} 
          value={`${humidity}%`} 
          label="Humidity" 
        />
        
        <WeatherDetail 
          icon={<Wind className="h-5 w-5" />} 
          value={`${displayWindSpeed} ${windSpeedUnit}`} 
          label="Wind Speed"
        />
        
        <WeatherDetail 
          icon={<Compass className="h-5 w-5" />} 
          value={windDirection} 
          label="Direction" 
        />
        
        <WeatherDetail 
          icon={<CloudRain className="h-5 w-5" />} 
          value={data.rain ? `${data.rain['1h'] || 0}mm` : '0mm'} 
          label="Rainfall" 
        />
      </div>
    </Card>
  );
};

export default CurrentWeather;
