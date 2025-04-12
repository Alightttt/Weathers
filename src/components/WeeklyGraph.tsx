
import { ForecastData } from '@/features/weather/types/weather';
import { getDailyForecasts } from '@/lib/weather-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface WeeklyGraphProps {
  data: ForecastData | null;
  isLoading: boolean;
}

const WeeklyGraph = ({ data, isLoading }: WeeklyGraphProps) => {
  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-0">
        <CardHeader className="pb-2 pt-4">
          <Skeleton className="h-5 w-32 bg-white/10" />
        </CardHeader>
        <CardContent className="pb-4">
          <Skeleton className="h-40 w-full bg-white/10" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  // Get daily forecast data
  const dailyForecasts = getDailyForecasts(data);
  
  if (!dailyForecasts || dailyForecasts.length === 0) {
    return null;
  }

  // Format data for the chart
  const chartData = dailyForecasts.map(day => ({
    name: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    max: Math.round(day.temp_max),
    min: Math.round(day.temp_min),
  }));

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/10">
      <CardHeader className="pb-2 pt-4">
        <h3 className="text-white/90 font-medium text-sm">Weekly Temperature</h3>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#fff', fontSize: 12 }} 
                axisLine={{ stroke: '#ffffff30' }}
                tickLine={{ stroke: '#ffffff30' }}
              />
              <YAxis 
                tick={{ fill: '#fff', fontSize: 12 }} 
                axisLine={{ stroke: '#ffffff30' }}
                tickLine={{ stroke: '#ffffff30' }}
                width={25}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', color: '#333' }}
              />
              <Line 
                type="monotone" 
                dataKey="max" 
                stroke="#FF8C00" 
                strokeWidth={2}
                dot={{ stroke: '#FF8C00', strokeWidth: 2, fill: '#FFF' }}
              />
              <Line 
                type="monotone" 
                dataKey="min" 
                stroke="#1E90FF" 
                strokeWidth={2} 
                dot={{ stroke: '#1E90FF', strokeWidth: 2, fill: '#FFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGraph;
