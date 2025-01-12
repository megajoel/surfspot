# 🏄‍♂️ SurfSpot

A modern web application that provides personalized surf spot recommendations and real-time weather conditions for surfers.

## Features

- 🌊 Real-time wave and weather conditions using StormGlass API
- 🎯 Smart spot recommendations based on current conditions
- 🤖 AI-powered interpretations of surf conditions for beginners and experts
- 📍 Detailed beach information and amenities
- 🎨 Modern, responsive UI

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/surfspot.git
cd surfspot
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following:
```env
# Get your API key from https://stormglass.io
VITE_STORMGLASS_API_KEY=your_stormglass_api_key

# Get your API key from https://platform.openai.com
VITE_GPT_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm run dev
```

## API Keys

This project requires two API keys:

1. **StormGlass API**: Sign up at [stormglass.io](https://stormglass.io) to get your API key
2. **OpenAI API**: Get your API key from [platform.openai.com](https://platform.openai.com)

## Tech Stack

- React + TypeScript
- Vite
- StormGlass API for weather data
- OpenAI GPT for surf condition interpretations
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 