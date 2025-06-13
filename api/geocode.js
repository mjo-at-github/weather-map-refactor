const axios = require('axios');

module.exports = async (req, res) => {
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
};