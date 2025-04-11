
export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone_offset: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  pop: number;
}

export interface DailyForecast {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  pop: number;
}

export type WeatherCondition = 
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Thunderstorm'
  | 'Drizzle'
  | 'Snow'
  | 'Mist'
  | 'Fog'
  | 'Haze'
  | 'Dust'
  | 'Smoke'
  | 'Tornado';
