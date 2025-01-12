import axios from 'axios';
import type { WeatherData, Beach } from '../types';

const GPT_API_KEY = import.meta.env.VITE_GPT_API_KEY;

export async function getSpotInterpretation(
  beach: Beach,
  weather: WeatherData,
  rating: number
): Promise<{ surfingInterpretation: string; beachInterpretation: string }> {
  try {
    const surfPrompt = `
      Act as a friendly local surfer explaining the current surfing conditions at ${beach.name} to a beginner. Use surf lingo and make it fun!
      Here are the conditions:
      - Wind: ${weather.windSpeed} knots from ${weather.windDirection}
      - Wave height: ${weather.waveHeight}m
      - Swell direction: ${weather.swellDirection}
      - Tide: ${weather.tide}
      - Beach faces: ${beach.direction}
      - Overall rating: ${rating}/10

      The beach is known for: ${beach.description}
      Best conditions are: ${beach.bestConditions.join(', ')}

      Please provide a brief, easy to understand explanation of what these conditions mean for surfing. Include ideal surf boards for these conditions. Keep it under 100 words.
    `;

    console.log('Sending surf prompt:', surfPrompt);

    const beachPrompt = `
      Act as a friendly local explaining the current beach conditions at ${beach.name} for beach-goers and families. Make it informative and welcoming!
      Here are the conditions:
      - Wind: ${weather.windSpeed} knots from ${weather.windDirection}
      - Wave height: ${weather.waveHeight}m
      - Tide: ${weather.tide}

      Beach amenities: ${beach.beachAmenities ? JSON.stringify(beach.beachAmenities) : 'Not specified'}

      Please provide a brief, friendly explanation of what these conditions mean for swimming, sunbathing, and general beach activities. Include safety tips if relevant. Keep it under 100 words.
    `;

    console.log('Sending beach prompt:', beachPrompt);

    const [surfResponse, beachResponse] = await Promise.all([
      axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: surfPrompt }],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${GPT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      ),
      axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: beachPrompt }],
          temperature: 0.7,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${GPT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
    ]);

    console.log('Surf Response:', surfResponse.data);
    console.log('Beach Response:', beachResponse.data);

    return {
      surfingInterpretation: surfResponse.data.choices[0].message.content.trim(),
      beachInterpretation: beachResponse.data.choices[0].message.content.trim()
    };
  } catch (err) {
    console.error('Failed to get GPT interpretation:', err);
    if (axios.isAxiosError(err)) {
      console.error('API Error Details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    }
    return generateFallbackInterpretation(beach, weather, rating);
  }
}

function generateFallbackInterpretation(
  beach: Beach,
  weather: WeatherData,
  rating: number
): { surfingInterpretation: string; beachInterpretation: string } {
  const conditions = rating >= 7 ? 'great' : rating >= 5 ? 'fair' : 'challenging';
  const safetyLevel = weather.waveHeight <= 1 ? 'suitable for beginners'
    : weather.waveHeight <= 2 ? 'intermediate conditions'
    : 'better suited for experienced surfers';

  return {
    surfingInterpretation: `Current surfing conditions at ${beach.name} are ${conditions}. 
      With ${weather.waveHeight}m waves, it's ${safetyLevel}. 
      Check with the lifeguards and surf within your ability level.`,
    beachInterpretation: `Beach conditions are ${weather.waveHeight <= 1 ? 'calm' : 'moderate'}. 
      Please swim between the flags and follow lifeguard instructions. 
      Current wind conditions may affect beach activities.`
  };
}