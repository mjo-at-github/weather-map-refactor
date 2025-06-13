const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
};