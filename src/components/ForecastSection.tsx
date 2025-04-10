
import { ForecastData, getDailyForecasts, getDayOfWeek } from '@/lib/weather-utils';
import ForecastCard from './ForecastCard';

interface ForecastSectionProps {
  data: ForecastData;
  isLoading: boolean;
}

const ForecastSection = ({ data, isLoading }: ForecastSectionProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 animate-pulse">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="glass-card p-4 h-[130px]">
            <div className="h-4 bg-gray-600/30 rounded w-12 mb-3 mx-auto"></div>
            <div className="h-12 w-12 rounded-full bg-gray-600/30 mb-3 mx-auto"></div>
            <div className="h-4 bg-gray-600/30 rounded w-20 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const dailyForecasts = getDailyForecasts(data);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 animate-fade-in">
      {dailyForecasts.map((forecast, index) => (
        <ForecastCard
          key={index}
          day={index === 0 ? 'Today' : getDayOfWeek(forecast.dt)}
          tempMax={forecast.temp_max}
          tempMin={forecast.temp_min}
          weatherCondition={forecast.weather.main}
        />
      ))}
    </div>
  );
};

export default ForecastSection;
