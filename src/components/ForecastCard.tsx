
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
    <div className="glass-card p-4 flex flex-col items-center transition-transform hover:scale-105">
      <p className="text-sm font-medium text-gray-300 mb-2">{day}</p>
      <div className="my-3">
        <WeatherIcon weatherCondition={weatherCondition} size="medium" />
      </div>
      <p className="text-lg font-semibold">{Math.round(tempMax)}°</p>
      <p className="text-xs font-medium text-gray-400">{Math.round(tempMin)}°</p>
    </div>
  );
};

export default ForecastCard;
