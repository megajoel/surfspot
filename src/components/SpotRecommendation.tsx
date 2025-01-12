import React from 'react';
import { MapPin } from 'lucide-react';
import type { SurfSpot } from '../types';

interface SpotRecommendationProps {
  spots: SurfSpot[];
}

export function SpotRecommendation({ spots }: SpotRecommendationProps) {
  return (
    <div className="space-y-4">
      {spots.map((spot) => (
        <div 
          key={spot.beach.name}
          className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02]"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{spot.beach.name}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">Faces {spot.beach.direction}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${spot.rating >= 7 ? 'bg-green-100 text-green-800' : 
                  spot.rating >= 4 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}
              `}>
                {spot.rating}/10
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-gray-600">{spot.beach.description}</div>
            <div className="bg-blue-50 p-4 rounded-md space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Today's Surfing Conditions</h4>
                <p className="text-blue-800">{spot.surfingInterpretation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Today's Beach Conditions</h4>
                <p className="text-blue-800">{spot.beachInterpretation}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}