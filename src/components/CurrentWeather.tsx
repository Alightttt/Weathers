
import { WeatherData } from '@/features/weather/types/weather';
import { formatDate, getWeatherTextColor, formatTime, degreesToDirection } from '@/lib/weather-utils';
import { Wind, Droplets, Clock } from 'lucide-react';
import { AnimatedWeatherIcon } from './WeatherIcons';
import { Skeleton } from '@/components/ui/skeleton';

interface CurrentWeatherProps {
  data: WeatherData | null;
  isLoading: boolean;
}

const CurrentWeather = ({ data, isLoading }: CurrentWeatherProps) => {
  if (isLoading || !data) {
    return (
      <div className="glass-card p-8 flex flex-col items-center animate-pulse min-h-[300px] justify-center">
        <div className="w-32 h-32 rounded-full bg-gray-600/30 mb-4"></div>
        <div className="h-12 w-32 bg-gray-600/30 rounded-md mb-2"></div>
        <div className="h-6 w-48 bg-gray-600/30 rounded-md"></div>
      </div>
    );
  }

  const weatherCondition = data.weather?.[0]?.main || "Clear";
  const weatherDescription = data.weather?.[0]?.description || "clear";
  const textColorClass = getWeatherTextColor(weatherCondition);
  const today = new Date();
  
  // Safely access wind direction - handle both data structures
  let windDirection = 'N/A';
  if (data.current?.wind_direction_10m !== undefined) {
    windDirection = degreesToDirection(data.current.wind_direction_10m);
  } else if (data.wind?.deg !== undefined) {
    windDirection = degreesToDirection(data.wind.deg);
  }
  
  // Determine time display
  const dataTime = data.current?.time ? 
    formatTime(data.current.time) : 
    formatTime(today.toISOString());
  
  // Safely access temperature - handle both data structures
  let temperature = 0;
  if (data.current?.temperature_2m !== undefined) {
    temperature = data.current.temperature_2m;
  } else if (data.main?.temp !== undefined) {
    temperature = Math.round(data.main.temp);
  }
  
  // Safely access humidity - handle both data structures
  let humidity = 0;
  if (data.current?.relative_humidity_2m !== undefined) {
    humidity = data.current.relative_humidity_2m;
  } else if (data.main?.humidity !== undefined) {
    humidity = data.main.humidity;
  }
  
  // Safely access wind speed - handle both data structures
  let windSpeed = 0;
  if (data.current?.wind_speed_10m !== undefined) {
    windSpeed = data.current.wind_speed_10m;
  } else if (data.wind?.speed !== undefined) {
    windSpeed = data.wind.speed;
  }

  return (
    <div className="glass-card p-8 animate-fade-in flex flex-col md:flex-row items-start justify-between gap-6 relative overflow-hidden min-h-[300px]">
      <div className="flex flex-col items-start z-10">
        <h1 className="temperature-text mb-2">
          {Math.round(temperature)}
          <span className="text-3xl align-top ml-1">°C</span>
        </h1>
        <h2 className={`condition-text mb-6 capitalize ${textColorClass}`}>
          {weatherDescription}
        </h2>
        <p className="text-sm text-gray-300 mb-6">{formatDate(today.toISOString())}</p>
        
        <div className="flex flex-wrap gap-y-4 gap-x-8">
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-blue-400" />
            <div>
              <span className="text-lg font-semibold">
                {windSpeed} km/h
              </span>
              <p className="text-xs text-gray-400">Wind ({windDirection})</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-400" />
            <div>
              <span className="text-lg font-semibold">{humidity}%</span>
              <p className="text-xs text-gray-400">Humidity</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <div>
              <span className="text-lg font-semibold">{dataTime}</span>
              <p className="text-xs text-gray-400">Data Time</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex justify-center z-0 opacity-90">
        <div className="w-60 h-60 md:w-80 md:h-80">
          <AnimatedWeatherIcon weatherCondition={weatherCondition} size="large" />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
