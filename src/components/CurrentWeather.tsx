
import { WeatherData } from '@/lib/weather-utils';
import { formatDate, getWeatherTextColor } from '@/lib/weather-utils';
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

  const weatherCondition = data.weather?.[0]?.main || "Clear";
  const weatherDescription = data.weather?.[0]?.description || "clear";
  const textColorClass = getWeatherTextColor(weatherCondition);
  const today = new Date();

  return (
    <div className="glass-card p-8 animate-fade-in flex flex-col md:flex-row items-start justify-between gap-6 relative overflow-hidden min-h-[300px]">
      <div className="flex flex-col items-start z-10">
        <h1 className="temperature-text mb-2">
          {Math.round(data.current.temperature_2m)}
          <span className="text-3xl align-top ml-1">°C</span>
        </h1>
        <h2 className={`condition-text mb-6 capitalize ${textColorClass}`}>
          {weatherDescription}
        </h2>
        <p className="text-sm text-gray-300 mb-6">{formatDate(today.toISOString())}</p>
        
        <div className="flex space-x-8">
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-blue-400" />
            <div>
              <span className="text-lg font-semibold">
                {data.daily?.wind_speed_10m_max?.[7] || 0} km/h
              </span>
              <p className="text-xs text-gray-400">Wind</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-400" />
            <div>
              <span className="text-lg font-semibold">{data.current.relative_humidity_2m}%</span>
              <p className="text-xs text-gray-400">Humidity</p>
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
