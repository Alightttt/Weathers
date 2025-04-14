
// Import necessary modules and types
import { WeatherData, ForecastData } from '../types/weather';

// Define API endpoints
const API_URL = "https://api.openweathermap.org/data/2.5";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Get user's coordinates
export const getUserCoordinates = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location', error);
          reject(error);
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

// Generate Open-Meteo API URL with coordinates
export const generateApiUrl = (lat: number, lon: number): string => {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration,apparent_temperature_min,apparent_temperature_max,temperature_2m_min,temperature_2m_max,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,apparent_temperature,rain,showers,snowfall,snow_depth&current=temperature_2m,relative_humidity_2m,is_day,apparent_temperature,snowfall,showers,rain,precipitation,wind_speed_10m,wind_direction_10m&timezone=auto&past_days=7&forecast_days=14`;
};

// Get weather condition text from code
export const mapWeatherCode = (code: number): string => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return "Clear";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([56, 57].includes(code)) return "Freezing Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if (code === 77) return "Snow Grains";
  if ([80, 81, 82].includes(code)) return "Rain Showers";
  if ([85, 86].includes(code)) return "Snow Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
};

// Get city name from coordinates
export const getCityFromCoords = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const data = await response.json();
    
    // Extract city name from response
    const city = data.address?.city || 
                data.address?.town || 
                data.address?.village || 
                data.address?.county ||
                data.address?.state ||
                "Unknown Location";
    
    // Add country if available
    const country = data.address?.country || "";
    
    return city;
  } catch (error) {
    console.error('Error fetching city name:', error);
    return "Unknown Location";
  }
};

// Fetch current weather data
export const fetchCurrentWeather = async (city?: string, coords?: Coordinates): Promise<WeatherData> => {
  try {
    let apiUrl = '';
    let locationName = city || "New York";
    let countryCode = '';
    
    // If coordinates are provided, use them to generate API URL
    if (coords) {
      apiUrl = generateApiUrl(coords.latitude, coords.longitude);
      
      // Try to get the city name from coordinates
      try {
        locationName = await getCityFromCoords(coords.latitude, coords.longitude);
        
        // Try to get country from coordinates
        const reverseResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
        const reverseData = await reverseResponse.json();
        countryCode = reverseData.address?.country_code?.toUpperCase() || '';
      } catch (error) {
        console.warn('Could not get city name from coordinates:', error);
      }
    } else {
      // Use city name to generate coordinates and then API URL
      try {
        const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city || 'New York')}&format=json&limit=1`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        if (searchData && searchData.length > 0) {
          const { lat, lon, display_name } = searchData[0];
          apiUrl = generateApiUrl(parseFloat(lat), parseFloat(lon));
          
          // Extract city and country from display name
          const parts = display_name.split(', ');
          locationName = parts[0];
          
          // Extract country code if available
          if (searchData[0].address && searchData[0].address.country_code) {
            countryCode = searchData[0].address.country_code.toUpperCase();
          } else {
            const lastPart = parts[parts.length - 1];
            countryCode = lastPart.length <= 3 ? lastPart.toUpperCase() : lastPart;
          }
        } else {
          throw new Error('Location not found');
        }
      } catch (error) {
        console.error('Error searching location:', error);
        apiUrl = generateApiUrl(40.7128, -74.006); // Default to New York
      }
    }
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    
    const data = await response.json();
    
    // Add city name and country
    data.name = locationName;
    data.sys = {
      country: countryCode
    };
    
    // Add weather information in a format compatible with existing components
    const todayIndex = 7; // Today's index (since past_days=7)
    const weatherCode = data.daily.weather_code[todayIndex];
    const weatherCondition = mapWeatherCode(weatherCode);
    
    data.weather = [{
      main: weatherCondition,
      description: weatherCondition.toLowerCase(),
      icon: weatherCode === 0 ? "01d" : (weatherCode < 3 ? "02d" : (weatherCode < 50 ? "03d" : "09d"))
    }];
    
    // Add main section for compatibility with existing components
    if (!data.main) {
      data.main = {
        temp: data.current.temperature_2m,
        feels_like: data.current.apparent_temperature,
        temp_min: data.daily.temperature_2m_min[todayIndex],
        temp_max: data.daily.temperature_2m_max[todayIndex],
        pressure: 1013, // Default if not available
        humidity: data.current.relative_humidity_2m
      };
    }
    
    // Add wind data for compatibility
    if (!data.wind) {
      data.wind = {
        speed: data.current.wind_speed_10m,
        deg: data.current.wind_direction_10m
      };
    }
    
    // Add rainfall data
    data.rain = {
      '1h': data.current.rain || 0
    };
    
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// Fetch forecast data
export const fetchForecast = async (city?: string, coords?: Coordinates): Promise<ForecastData> => {
  // Since we're using Open-Meteo which returns both current and forecast data,
  // we can reuse the same call but make sure we process all the forecast data correctly
  const data = await fetchCurrentWeather(city, coords);
  
  // Enhance the forecast data by making sure all the forecast-specific fields are populated
  return data;
};

// Save and get last city from local storage
export const saveLastCity = (city: string): void => {
  localStorage.setItem('lastCity', city);
};

export const getLastCity = (): string => {
  return localStorage.getItem('lastCity') || 'New York';
};

// Get API key from local storage
export const getApiKey = (): string => {
  return localStorage.getItem('weatherApiKey') || 'demo';
};

// Save API key to local storage
export const saveApiKey = (key: string): void => {
  localStorage.setItem('weatherApiKey', key);
};
