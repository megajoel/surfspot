import React, { useState, useEffect } from 'react';
import { Compass, Loader2 } from 'lucide-react';
import { WeatherDisplay } from './components/WeatherDisplay';
import { SpotRecommendation } from './components/SpotRecommendation';
import { beaches } from './data/beaches';
import { getSurfSpotRecommendations } from './utils/surfLogic';
import { getWeatherData } from './utils/weatherApi';
import type { WeatherData, SurfSpot } from './types';

const FALLBACK_WEATHER: WeatherData = {
  windSpeed: 8,
  windDirection: 'W',
  waveHeight: 1.5,
  swellDirection: 'SE',
  tide: 'Mid'
};

function App() {
  const [weather, setWeather] = useState<WeatherData>(FALLBACK_WEATHER);
  const [spots, setSpots] = useState<SurfSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const weatherData = await getWeatherData();
        const recommendations = await getSurfSpotRecommendations(beaches, weatherData);
        
        if (mounted) {
          setWeather(weatherData);
          setSpots(recommendations);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          const error = err as Error;
          setError(error.message || 'Failed to fetch data. Please try again later.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin text-blue-600" />
          <span className="text-gray-600">Loading surf conditions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Compass className="text-blue-600 w-8 h-8 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Thirroul Surf Finder</h1>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 text-red-800 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        <WeatherDisplay weather={weather} />
        
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Spot Recommendations</h2>
          <SpotRecommendation spots={spots} />
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          Weather data and interpretations update every 30 minutes
        </div>
      </div>
    </div>
  );
}

export default App;