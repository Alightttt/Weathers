
import { WeatherData } from '@/features/weather/types/weather';
import { AnimatedWeatherIcon } from './WeatherIcons';

interface CurrentWeatherProps {
  data: WeatherData | null;
  isLoading: boolean;
}

const CurrentWeather = ({ data, isLoading }: CurrentWeatherProps) => {
  if (!data) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-black/70">Loading weather data...</p>
      </div>
    );
  }

  const weatherCondition = data.weather?.[0]?.main || "Clear";
  const temperature = data.current?.temperature_2m || 
                     (data.main?.temp !== undefined ? Math.round(data.main.temp) : 0);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-40 h-40 mb-4">
        <AnimatedWeatherIcon weatherCondition={weatherCondition} size="large" />
      </div>
    </div>
  );
};

export default CurrentWeather;
