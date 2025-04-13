
import { CloudRain, Cloud, Sun, CloudLightning, CloudSnow, CloudSun, CloudFog, Snowflake } from 'lucide-react';

interface WeatherIconProps {
  weatherCondition: string;
  size?: 'small' | 'medium' | 'large';
}

export const WeatherIcon = ({ weatherCondition, size = 'medium' }: WeatherIconProps) => {
  const condition = weatherCondition.toLowerCase();
  const sizeClass = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  if (condition.includes('rain') || condition.includes('drizzle')) {
    return <CloudRain className={`${sizeClass[size]} text-blue-400`} />;
  }

  if (condition.includes('cloud')) {
    return <Cloud className={`${sizeClass[size]} text-gray-300`} />;
  }

  if (condition.includes('sun') || condition.includes('clear')) {
    return <Sun className={`${sizeClass[size]} text-amber-300`} />;
  }

  if (condition.includes('lightning') || condition.includes('thunder')) {
    return <CloudLightning className={`${sizeClass[size]} text-yellow-300`} />;
  }

  if (condition.includes('snow')) {
    return <Snowflake className={`${sizeClass[size]} text-blue-100`} />;
  }
  
  if (condition.includes('fog') || condition.includes('mist')) {
    return <CloudFog className={`${sizeClass[size]} text-gray-400`} />;
  }

  return <CloudSun className={`${sizeClass[size]} text-gray-300`} />;
};

export const AnimatedWeatherIcon = ({ weatherCondition, size = 'medium' }: WeatherIconProps) => {
  const condition = weatherCondition.toLowerCase();
  
  // Size classes with extra styling
  const sizeClass = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-40 h-40' // Made the large size bigger
  };

  // Sunny weather
  if (condition.includes('sun') || condition.includes('clear')) {
    return (
      <div className={`weather-icon ${sizeClass[size]}`}>
        <Sun className="w-full h-full text-amber-300 animate-spin-slow" />
      </div>
    );
  }
  
  // Cloudy weather
  if (condition.includes('cloud') && !condition.includes('rain') && !condition.includes('thunder')) {
    return (
      <div className={`weather-icon ${sizeClass[size]}`}>
        <Cloud className="w-full h-full text-gray-300 animate-float" />
      </div>
    );
  }

  // Rainy weather
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return (
      <div className={`weather-icon ${sizeClass[size]}`}>
        <CloudRain className="w-full h-full text-blue-400 animate-pulse" />
      </div>
    );
  }

  // Thunderstorm
  if (condition.includes('thunder') || condition.includes('storm')) {
    return (
      <div className={`weather-icon ${sizeClass[size]} relative`}>
        <Cloud className="w-full h-full text-gray-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-1/2">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-0 w-1/3 h-1/2 bg-yellow-300 animate-lightning z-20" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Snow
  if (condition.includes('snow')) {
    return (
      <div className={`weather-icon ${sizeClass[size]}`}>
        <Snowflake className="w-full h-full text-blue-100 animate-float" />
      </div>
    );
  }
  
  // Foggy weather
  if (condition.includes('fog') || condition.includes('mist')) {
    return (
      <div className={`weather-icon ${sizeClass[size]}`}>
        <CloudFog className="w-full h-full text-gray-400 animate-pulse" />
      </div>
    );
  }

  // Default
  return (
    <div className={`weather-icon ${sizeClass[size]}`}>
      <CloudSun className="w-full h-full text-gray-300" />
    </div>
  );
};
