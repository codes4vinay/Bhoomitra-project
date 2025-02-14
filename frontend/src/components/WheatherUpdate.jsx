import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const apiKey = "c431bce09aa6e439aa255b626851739b";

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://conversations-widget.brevo.com/brevo-conversations.js";
    document.body.appendChild(script);
  }, []);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        setError("City not found. Please try again.");
        setWeatherData(null);
        return;
      }
      setError("");
      setWeatherData(data);
      checkWeatherAlerts(data);
    } catch (error) {
      setError("Error fetching weather data.");
    }
  };

  const checkWeatherAlerts = async (data) => {
    const tempThreshold = 35;
    const severeConditions = ["clear-sky", "rain", "storm", "snow", "smoke", "haze"];
    const currentCondition = data.weather[0].main.toLowerCase();

    if (data.main.temp > tempThreshold || severeConditions.includes(currentCondition)) {
      await sendWeatherAlert(data.name, data.main.temp, currentCondition);
    }
  };

  const sendWeatherAlert = async (city, temp, condition) => {
    try {
      await fetch("http://localhost:3000/send-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, temp, condition }),
      });
      console.log("Weather alert sent via SMS!");
    } catch (error) {
      console.error("Failed to send SMS alert.");
    }
  };

  return (
    <div className="flex  flex-col min-h-screen bg-gradient-to-r bg text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow p-10">
        <h1 className="text-5xl mt-20 font-extrabold mb-8">WeatherUpdates</h1>
        <div className="bg-white p-10 rounded-lg shadow-2xl text-gray-800 max-w-lg w-full">
          <input
            type="text"
            placeholder="Enter city name"
            className="p-4 border border-gray-300 rounded-lg mb-6 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={fetchWeather}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full hover:bg-blue-700 transition"
          >
            Get Weather
          </button>
          {error && <p className="text-red-500 mt-4 text-lg font-semibold">{error}</p>}
          {weatherData && (
            <div className="mt-6 text-xl text-center">
              <h2 className="text-2xl font-bold">{weatherData.name}</h2>
              <p className="mt-2">🌡 Temperature: <span className="font-semibold">{weatherData.main.temp}°C</span></p>
              <p>💧 Humidity: <span className="font-semibold">{weatherData.main.humidity}%</span></p>
              <p>🌥 Condition: <span className="font-semibold capitalize">{weatherData.weather[0].description}</span></p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WeatherApp;
