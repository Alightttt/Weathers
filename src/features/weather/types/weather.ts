
// Weather API types

export interface WeatherData {
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
  name?: string;
  sys?: {
    country?: string;
  };
  weather?: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  coord?: {
    lon: number;
    lat: number;
  };
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
  timezone?: number;
  id?: number;
  cod?: number;
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
}

export type ForecastData = WeatherData;
