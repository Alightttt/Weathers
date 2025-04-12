
import { ForecastData } from '@/features/weather/types/weather';
import { getDailyForecasts, getDayOfWeek } from '@/lib/weather-utils';
import ForecastCard from './ForecastCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ForecastSectionProps {
  data: ForecastData | null;
  isLoading: boolean;
}

const ForecastSection = ({ data, isLoading }: ForecastSectionProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 animate-pulse">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="glass-card p-4 h-[130px]">
            <Skeleton className="h-4 bg-gray-600/30 rounded w-12 mb-3 mx-auto" />
            <Skeleton className="h-12 w-12 rounded-full bg-gray-600/30 mb-3 mx-auto" />
            <Skeleton className="h-4 bg-gray-600/30 rounded w-20 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-white/60">No forecast data available</p>
      </div>
    );
  }

  // Safely handle potential null/undefined values
  const dailyForecasts = data ? getDailyForecasts(data) : [];

  if (!dailyForecasts || dailyForecasts.length === 0) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-white/60">No forecast data available</p>
      </div>
    );
  }

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
