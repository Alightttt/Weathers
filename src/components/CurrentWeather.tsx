
import { WeatherData } from '@/lib/weather-utils';
import { kelvinToCelsius, formatDate, getWeatherTextColor } from '@/lib/weather-utils';
import { Wind, Droplets } from 'lucide-react';
import { AnimatedWeatherIcon } from './WeatherIcons';

interface CurrentWeatherProps {
  data: WeatherData;
  isLoading: boolean;
}

const CurrentWeather = ({ data, isLoading }: CurrentWeatherProps) => {
  if (isLoading) {
    return (
      <div className="glass-card p-8 flex flex-col items-center animate-pulse min-h-[300px] justify-center">
        <div className="w-32 h-32 rounded-full bg-gray-600/30 mb-4"></div>
        <div className="h-12 w-32 bg-gray-600/30 rounded-md mb-2"></div>
        <div className="h-6 w-48 bg-gray-600/30 rounded-md"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const weatherCondition = data.weather[0].main;
  const weatherDescription = data.weather[0].description;
  const textColorClass = getWeatherTextColor(weatherCondition);

  return (
    <div className="glass-card p-8 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
      <div className="flex flex-col items-start z-10">
        <h1 className="text-8xl font-bold tracking-tighter mb-2">
          {kelvinToCelsius(data.main.temp)}
          <span className="text-4xl align-top ml-1">°C</span>
        </h1>
        <h2 className={`text-3xl font-semibold mb-4 capitalize ${textColorClass}`}>
          {weatherDescription}
        </h2>
        <p className="text-sm text-gray-300 mb-6">{formatDate(data.dt)}</p>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-200">{Math.round(data.wind.speed * 3.6)} km/h</span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-200">{data.main.humidity}%</span>
          </div>
        </div>
      </div>
      
      <div className="md:absolute md:right-4 md:top-1/2 md:transform md:-translate-y-1/2 flex justify-center md:justify-end md:w-1/3">
        <div className="w-40 h-40 md:w-60 md:h-60">
          <AnimatedWeatherIcon weatherCondition={weatherCondition} size="large" />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
