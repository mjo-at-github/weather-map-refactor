// Initialize map
const map = L.map('map').setView([51.505, -0.09], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Marker variables
let cityMarker = null;
let weatherCircle = null;

// Handle form submission
document.getElementById('cityForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const cityName = document.getElementById('cityInput').value.trim();
    
    if (!cityName) return;
    
    try {
        showLoading();
        
        // Get coordinates from our backend
        const geoData = await fetchGeocode(cityName);
        
        if (geoData && geoData.length > 0) {
            const lat = parseFloat(geoData[0].lat);
            const lon = parseFloat(geoData[0].lon);
            const displayName = geoData[0].display_name.split(',')[0];
            
            // Update map
            updateMap(lat, lon, displayName);
            
            // Get weather data from our backend
            const weatherData = await fetchWeather(lat, lon);
            
            if (weatherData) {
                displayWeather(weatherData, displayName);
            }
        } else {
            showError('Location not found. Please try another location.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error getting weather data. Please try again.');
    }
});

// Helper functions
async function fetchGeocode(cityName) {
    const response = await fetch(`/api/geocode?city=${encodeURIComponent(cityName)}`);
    return await response.json();
}

async function fetchWeather(lat, lon) {
    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    return await response.json();
}

function showLoading() {
    document.getElementById('weatherResult').innerHTML = `
        <svg width="48" height="48" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#9DB4C0">
            <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)" stroke-width="2">
                    <circle stroke-opacity=".3" cx="18" cy="18" r="18"/>
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="1s"
                            repeatCount="indefinite"/>
                    </path>
                </g>
            </g>
        </svg>
        <span>Loading weather data...</span>
    `;
}

function showError(message) {
    document.getElementById('weatherResult').innerHTML = `
        <span style="color:#9DB4C0">${message}</span>
    `;
}

function displayWeather(weatherData, displayName) {
    const temp = Math.round(weatherData.main.temp);
    const weatherDesc = weatherData.weather[0].description;
    const iconCode = weatherData.weather[0].icon;
    
    document.getElementById('weatherResult').innerHTML = `
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" class="weather-icon" alt="${weatherDesc}">
        <span>${displayName}: ${temp}°C • ${capitalizeFirstLetter(weatherDesc)}</span>
    `;
    
    if (cityMarker) {
        cityMarker.setPopupContent(`
            <div style="text-align:center;padding:8px">
                <b style="color:#5E6B7E;font-size:1.1rem">${displayName}</b><br>
                <span style="font-size:1.4rem;font-weight:600;color:#9DB4C0">${temp}°C</span><br>
                <span style="color:#A3B1C6">${capitalizeFirstLetter(weatherDesc)}</span>
            </div>
        `).openPopup();
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateMap(lat, lon, cityName) {
    if (cityMarker) {
        map.removeLayer(cityMarker);
    }
    if (weatherCircle) {
        map.removeLayer(weatherCircle);
    }
    
    map.flyTo([lat, lon], 12, {
        duration: 1
    });
   
    cityMarker = L.marker([lat, lon], {
        icon: L.divIcon({
            html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9DB4C0" width="32px" height="32px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
            iconSize: [32, 32],
            className: 'custom-marker'
        })
    }).addTo(map)
    .bindPopup(`<b>${cityName}</b><br>Loading weather...`)
    .openPopup();
    
    weatherCircle = L.circle([lat, lon], {
        color: '#B8D0EB',
        fillColor: '#E2CFEA',
        fillOpacity: 0.2,
        radius: 2000
    }).addTo(map);
}