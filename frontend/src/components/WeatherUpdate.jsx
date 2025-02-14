import React, { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Wind, Droplets } from 'lucide-react';

function WeatherUpdate() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      setWeather(null);

      const response = await axios.get(`/api/weather/forecast/${encodeURIComponent(city)}`);

      // Validate response structure
      if (response.data && response.data.daily && Array.isArray(response.data.daily)) {
        setWeather(response.data.daily);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dt) => {
    return new Date(dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          7-Day Weather Forecast
        </h1>

        <div className="flex gap-2 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            />
            <MapPin className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            onClick={fetchWeather}
            disabled={loading || !city}
            className="px-6 py-2 bg-white/90 rounded-lg hover:bg-white/100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search size={20} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/90 text-white p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {weather ? (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weather.map((day) => (
              <div
                key={day.dt}
                className="bg-white/90 backdrop-blur-sm rounded-lg p-4 hover:transform hover:scale-105 transition-transform"
              >
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800">{formatDate(day.dt)}</h3>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    className="mx-auto w-16 h-16"
                  />
                  <p className="text-sm text-gray-600 capitalize">
                    {day.weather[0].description}
                  </p>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.round(day.temp.day)}°C
                    </p>
                    <p className="text-sm text-gray-600">
                      H: {Math.round(day.temp.max)}° L: {Math.round(day.temp.min)}°
                    </p>
                  </div>
                  <div className="mt-2 flex justify-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Wind size={16} />
                      <span className="text-sm">{Math.round(day.wind_speed)}m/s</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets size={16} />
                      <span className="text-sm">{day.humidity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">No weather data available</p>
        )}
      </div>
    </div>
  );
}

export default WeatherUpdate;
