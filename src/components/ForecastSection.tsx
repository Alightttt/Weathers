
import { ForecastData } from '@/features/weather/types/weather';
import { getDailyForecasts, getDayOfWeek } from '@/lib/weather-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherIcon } from './WeatherIcons';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ForecastSectionProps {
  data: ForecastData | null;
  isLoading: boolean;
}

const ForecastSection = ({ data, isLoading }: ForecastSectionProps) => {
  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/10">
        <CardHeader className="pb-2 pt-4">
          <Skeleton className="h-5 w-32 bg-white/10" />
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-6 w-24 bg-white/10" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                  <Skeleton className="h-5 w-16 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  // Safely handle potential null/undefined values
  const dailyForecasts = data ? getDailyForecasts(data) : [];

  if (!dailyForecasts || dailyForecasts.length === 0) {
    return null;
  }

  const next4Days = dailyForecasts.slice(1, 5); // Skip today, show next 4 days

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/10">
      <CardHeader className="pb-2 pt-4">
        <h3 className="text-white/90 font-medium text-sm">Next Days</h3>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          {next4Days.map((forecast, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-white/80 font-medium">
                {getDayOfWeek(forecast.dt)}
              </span>
              <div className="flex items-center space-x-4">
                <WeatherIcon weatherCondition={forecast.weather.main} size="small" />
                <div className="flex space-x-2">
                  <span className="text-white font-medium">{Math.round(forecast.temp_max)}°</span>
                  <span className="text-white/60">{Math.round(forecast.temp_min)}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastSection;
