require('dotenv').config();

const express = require('express');

const cors = require('cors');

const axios = require('axios');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Proxy endpoint for geocoding

app.get('/api/geocode', async (req, res) => {
    try {
        const { city } = req.query;
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Geocoding error:', error);
        res.status(500).json({ error: 'Error fetching geocoding data' });
    }
});

// Proxy endpoint for weather data

app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});