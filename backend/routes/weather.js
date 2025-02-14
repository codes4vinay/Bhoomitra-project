const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = fb392ccd89485fd4c4605008990cfd22 ; // Add this to your .env file

router.get('/forecast/:city', async (req, res) => {
    try {
        const { city } = req.params;

        // Get coordinates
        const geoResponse = await axios.get(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );

        if (geoResponse.data.length === 0) {
            return res.status(404).json({ message: 'City not found' });
        }

        const { lat, lon } = geoResponse.data[0];

        // Get weather forecast
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        // Process the forecast data
        const dailyData = weatherResponse.data.list.reduce((acc, curr) => {
            const date = new Date(curr.dt * 1000).toDateString();

            if (!acc.find(item => new Date(item.dt * 1000).toDateString() === date)) {
                acc.push({
                    dt: curr.dt,
                    temp: {
                        min: curr.main.temp_min,
                        max: curr.main.temp_max,
                        day: curr.main.temp
                    },
                    weather: [{
                        main: curr.weather[0].main,
                        description: curr.weather[0].description,
                        icon: curr.weather[0].icon
                    }],
                    humidity: curr.main.humidity,
                    wind_speed: curr.wind.speed
                });
            }
            return acc;
        }, []).slice(0, 7);

        res.json(dailyData);
    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({ message: 'Failed to fetch weather data' });
    }
});

module.exports = router;