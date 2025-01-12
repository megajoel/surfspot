import { getSpotInterpretation } from './gptHelper';
import type { Beach, WeatherData, SurfSpot } from '../types';

export function calculateSpotRating(beach: Beach, weather: WeatherData): number {
  let rating = 5; // Start with average rating

  // Adjust for wind direction
  if (beach.bestConditions.some(cond => cond.includes(weather.windDirection))) {
    rating += 2;
  } else if (
    (weather.windDirection === 'W' && ['E', 'ENE'].includes(beach.direction)) ||
    (weather.windDirection === 'SW' && ['E', 'ENE', 'NE'].includes(beach.direction))
  ) {
    rating += 2;
  } else if (['E', 'SE', 'NE'].includes(weather.windDirection)) {
    rating -= 2;
  }

  // Adjust for swell direction
  if (beach.bestConditions.some(cond => cond.includes(weather.swellDirection))) {
    rating += 2;
  }

  // Adjust for wave height
  if (weather.waveHeight >= 1 && weather.waveHeight <= 2) {
    rating += 1;
  } else if (weather.waveHeight > 3) {
    rating -= 1;
  }

  // Ensure rating stays within 0-10
  return Math.max(0, Math.min(10, rating));
}

export function getRecommendation(rating: number, weather: WeatherData): string {
  if (rating >= 7) {
    return "Excellent conditions! Get out there!";
  } else if (rating >= 5) {
    return "Fair conditions - worth checking out.";
  } else {
    return "Conditions aren't ideal. Maybe try another spot or wait for better weather.";
  }
}

export async function getSurfSpotRecommendations(
  beaches: Beach[],
  weather: WeatherData
): Promise<SurfSpot[]> {
  const spots = await Promise.all(
    beaches.map(async (beach) => {
      const rating = calculateSpotRating(beach, weather);
      const { surfingInterpretation, beachInterpretation } = await getSpotInterpretation(beach, weather, rating);
      
      return {
        beach,
        rating,
        recommendation: getRecommendation(rating, weather),
        surfingInterpretation,
        beachInterpretation
      };
    })
  );

  return spots.sort((a, b) => b.rating - a.rating);
}