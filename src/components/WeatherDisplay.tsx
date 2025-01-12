import React from 'react';
import { Wind, Waves, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherDisplayProps {
  weather: WeatherData;
}

export function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const getTideIcon = () => {
    if (weather.tide.type === 'rising') return <ArrowUp className="text-blue-500" />;
    return <ArrowDown className="text-blue-500" />;
  };

  const formatTideHeight = (height: number) => height.toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Current Conditions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <Wind className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Wind</p>
            <p className="font-medium">{weather.windSpeed}kts {weather.windDirection}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Waves className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Waves</p>
            <p className="font-medium">{weather.waveHeight}m {weather.swellDirection}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="text-blue-500" />
          <div className="flex items-center">
            <div>
              <p className="text-sm text-gray-600">Tide</p>
              <p className="font-medium">{weather.tide.state} ({formatTideHeight(weather.tide.height)}m)</p>
            </div>
            <div className="ml-2" title={`Tide is ${weather.tide.type}`}>
              {getTideIcon()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}