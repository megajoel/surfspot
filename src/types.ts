export interface Beach {
  name: string;
  direction: string;
  bestConditions: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  beachAmenities: {
    swimming: string;
    shelter: string;
    facilities: string[];
  };
}

export interface WeatherData {
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  swellDirection: string;
  tide: {
    height: number;
    type: 'rising' | 'falling';
    state: 'low' | 'mid' | 'high';
  };
}

export interface SurfSpot {
  beach: Beach;
  rating: number;
  recommendation: string;
  surfingInterpretation: string;
  beachInterpretation: string;
}