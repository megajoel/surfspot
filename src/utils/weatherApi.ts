import axios from 'axios';
import type { WeatherData } from '../types';

const THIRROUL_LAT = -34.3199;
const THIRROUL_LNG = 150.9240;
const STORMGLASS_API_KEY = import.meta.env.VITE_STORMGLASS_API_KEY;

function degreesToDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees + 22.5) % 360) / 45);
  return directions[index % 8];
}

function msToKnots(ms: number): number {
  return Math.round(ms * 1.944);
}

function getTideState(height: number, previousHeight: number): WeatherData['tide'] {
  const type = height > previousHeight ? 'rising' : 'falling';
  
  // These thresholds should be adjusted based on local tide data
  let state: 'low' | 'mid' | 'high';
  if (height < 0.5) state = 'low';
  else if (height > 1.5) state = 'high';
  else state = 'mid';

  return {
    height,
    type,
    state
  };
}

export async function getWeatherData(): Promise<WeatherData> {
  try {
    // Fetch weather, marine, and tide data in parallel
    const [weatherResponse, marineResponse, tideResponse] = await Promise.all([
      axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${THIRROUL_LAT}&longitude=${THIRROUL_LNG}&current=temperature,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms`
      ),
      axios.get(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${THIRROUL_LAT}&longitude=${THIRROUL_LNG}&current=wave_height,wave_direction`
      ),
      axios.get(
        `https://api.stormglass.io/v2/tide/extremes/point?lat=${THIRROUL_LAT}&lng=${THIRROUL_LNG}`,
        {
          headers: {
            'Authorization': STORMGLASS_API_KEY
          }
        }
      )
    ]);

    const weatherData = weatherResponse.data.current;
    const marineData = marineResponse.data.current;
    const tideData = tideResponse.data.data;

    // Find the current tide state by comparing with the nearest extreme
    const now = new Date().getTime();
    const currentAndNextExtreme = tideData
      .sort((a: any, b: any) => Math.abs(new Date(a.time).getTime() - now) - Math.abs(new Date(b.time).getTime() - now))
      .slice(0, 2);

    const tide = getTideState(
      currentAndNextExtreme[0].height,
      currentAndNextExtreme[1].height
    );

    return {
      windSpeed: msToKnots(weatherData.wind_speed_10m),
      windDirection: degreesToDirection(weatherData.wind_direction_10m),
      waveHeight: marineData.wave_height,
      swellDirection: degreesToDirection(marineData.wave_direction),
      tide
    };
  } catch (err) {
    console.warn('Failed to fetch weather data:', err);
    // Return fallback data instead of throwing
    return {
      windSpeed: 8,
      windDirection: 'W',
      waveHeight: 1.5,
      swellDirection: 'SE',
      tide: {
        height: 1.0,
        type: 'rising',
        state: 'mid'
      }
    };
  }
}