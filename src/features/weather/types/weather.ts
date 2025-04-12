
export interface WeatherData {
  coord?: {
    lon: number;
    lat: number;
  };
  weather?: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base?: string;
  main?: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility?: number;
  wind?: {
    speed: number;
    deg: number;
  };
  clouds?: {
    all: number;
  };
  dt?: number;
  sys?: {
    type?: number;
    id?: number;
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  timezone?: number;
  id?: number;
  name?: string;
  cod?: number;
  
  // Added fields from Open-Meteo format
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    is_day?: number;
    precipitation?: number;
    rain?: number;
    showers?: number;
    snowfall?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    time?: string;
  };
  current_units?: {
    temperature_2m?: string;
    relative_humidity_2m?: string;
    wind_speed_10m?: string;
    wind_direction_10m?: string;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    apparent_temperature_max?: number[];
    apparent_temperature_min?: number[];
    sunrise?: string[];
    sunset?: string[];
    precipitation_sum?: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    apparent_temperature?: number[];
    precipitation_probability?: number[];
    precipitation?: number[];
    rain?: number[];
    showers?: number[];
    snowfall?: number[];
    relative_humidity_2m?: number[];
  };
}

export type ForecastData = WeatherData;

export interface HourlyForecast {
  dt: number;
  main: {
    temp: number;
  };
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
  temp_min: number;
  temp_max: number;
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
