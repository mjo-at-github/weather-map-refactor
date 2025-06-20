/* const axios = require('axios');

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
}; */

// api/geocode.js
const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://mjo-at-github.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {

    const { city } = req.query;

    /* const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
    ); */

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`,
      {
        headers: {
          'User-Agent': 'weather-map-refactor.vercel.app (markjamesohara@gmail.com)' // REQUIRED by Nominatim
        },
        timeout: 5000 // 5 second timeout
      }
    );





    res.json(response.data);

  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Error fetching geocoding data' });
  }

};