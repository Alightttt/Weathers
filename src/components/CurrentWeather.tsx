
import { WeatherData } from '@/features/weather/types/weather';
import { AnimatedWeatherIcon } from './WeatherIcons';
import { Droplets, Wind, Thermometer, Compass, Clock, Eye } from 'lucide-react';
import { formatDate } from '@/lib/weather-utils';

interface CurrentWeatherProps {
  data: WeatherData | null;
  isLoading: boolean;
}

const CurrentWeather = ({ data, isLoading }: CurrentWeatherProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-black/70">Loading weather data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-black/70">No weather data available</p>
      </div>
    );
  }

  const weatherCondition = data.weather?.[0]?.main || "Clear";
  const temperature = data.current?.temperature_2m || 
                     (data.main?.temp !== undefined ? Math.round(data.main.temp) : 0);
  const feelsLike = data.current?.apparent_temperature || 
                   (data.main?.feels_like !== undefined ? Math.round(data.main.feels_like) : 0);
  
  // Extract additional weather data
  const humidity = data.current?.relative_humidity_2m || data.main?.humidity || 0;
  const windSpeed = data.current?.wind_speed_10m || (data.wind?.speed ? Math.round(data.wind.speed) : 0);
  const visibility = data.visibility ? Math.round(data.visibility / 1000) : 10; // Convert m to km
  const precipitation = data.current?.precipitation || 0;
  
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/10">
      <div className="flex flex-col items-center mb-6">
        <div className="mb-4">
          <AnimatedWeatherIcon weatherCondition={weatherCondition} size="large" />
        </div>
        <div className="text-center">
          <div className="temperature-text">{temperature}°</div>
          <div className="condition-text text-black">{weatherCondition}</div>
          <div className="text-black/70 mt-1">Feels like {feelsLike}°</div>
          <div className="text-black/60 text-sm mt-1">
            {formatDate(new Date().toISOString())}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl">
          <Droplets className="text-blue-500" size={20} />
          <div>
            <div className="text-xs text-black/60">Humidity</div>
            <div className="text-black font-medium">{humidity}%</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl">
          <Wind className="text-gray-700" size={20} />
          <div>
            <div className="text-xs text-black/60">Wind Speed</div>
            <div className="text-black font-medium">{windSpeed} km/h</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl">
          <Thermometer className="text-red-500" size={20} />
          <div>
            <div className="text-xs text-black/60">Precipitation</div>
            <div className="text-black font-medium">{precipitation} mm</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl">
          <Eye className="text-green-500" size={20} />
          <div>
            <div className="text-xs text-black/60">Visibility</div>
            <div className="text-black font-medium">{visibility} km</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
