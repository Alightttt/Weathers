
import { WeatherIcon } from './WeatherIcons';

interface ForecastCardProps {
  day: string;
  tempMax: number;
  tempMin: number;
  weatherCondition: string;
}

const ForecastCard = ({
  day,
  tempMax,
  tempMin,
  weatherCondition,
}: ForecastCardProps) => {
  return (
    <div className="glass-card p-4 flex flex-col items-center transition-transform hover:scale-105 cursor-pointer">
      <p className="text-sm font-medium mb-2">{day}</p>
      <div className="my-3">
        <WeatherIcon weatherCondition={weatherCondition} size="medium" />
      </div>
      <div className="flex justify-between items-center w-full mt-2">
        <p className="text-sm font-semibold">{Math.round(tempMax)}°</p>
        <p className="text-sm text-gray-400">{Math.round(tempMin)}°</p>
      </div>
    </div>
  );
};

export default ForecastCard;
