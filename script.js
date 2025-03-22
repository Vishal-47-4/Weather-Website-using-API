document.getElementById('searchBtn').addEventListener('click', function () {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Please enter a city name.');
    }
});

function fetchWeather(city) {
    const apiKey = '701f330ad129468fb8190653252203'; // Replace with your API key
    const currentWeatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
    const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=no&alerts=no`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            updateBackground(data.current.condition.text);
        })
        .catch(error => {
            showError(error.message);
        });

    // Fetch 10-day forecast
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data not available.');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data.forecast.forecastday);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function displayCurrentWeather(data) {
    const weatherInfo = document.querySelector('.weather-info');
    const errorMessage = document.getElementById('errorMessage');

    document.getElementById('temperature').textContent = `${data.current.temp_c}°C`;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('wind').textContent = `${data.current.wind_kph} kph`;
    document.getElementById('condition').textContent = data.current.condition.text;
    document.getElementById('uv').textContent = data.current.uv;
    document.getElementById('feelsLike').textContent = `${data.current.feelslike_c}°C`;
  
    const conditionIcon = document.getElementById('conditionIcon');
    conditionIcon.className = getWeatherIcon(data.current.condition.text);

    weatherInfo.style.display = 'grid';
    errorMessage.style.display = 'none';
}

function displayForecast(forecastDays) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = ''; 

    forecastDays.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';

        forecastCard.innerHTML = `
            <i class="${getWeatherIcon(day.day.condition.text)}"></i>
            <h3>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</h3>
            <p>${day.day.avgtemp_c}°C</p>
            <p>${day.day.condition.text}</p>
        `;

        forecastCards.appendChild(forecastCard);
    });
}

function getWeatherIcon(condition) {
    if (condition.toLowerCase().includes('sunny')) {
        return 'fas fa-sun';
    } else if (condition.toLowerCase().includes('cloud')) {
        return 'fas fa-cloud';
    } else if (condition.toLowerCase().includes('rain')) {
        return 'fas fa-cloud-rain';
    } else if (condition.toLowerCase().includes('snow')) {
        return 'fas fa-snowflake';
    } else if (condition.toLowerCase().includes('thunder')) {
        return 'fas fa-bolt';
    } else {
        return 'fas fa-cloud-sun';
    }
}

function updateBackground(condition) {
    const body = document.body;
    let background = '';

    if (condition.toLowerCase().includes('sunny')) {
        background = 'url("sunny.jpg")';
    } else if (condition.toLowerCase().includes('cloud')) {
        background = 'url("cloudy.jpg")';
    } else if (condition.toLowerCase().includes('rain')) {
        background = 'url("rainy.jpg")';
    } else if (condition.toLowerCase().includes('snow')) {
        background = 'url("snowy.jpg")';
    } else {
        background = 'url("default.jpg")';
    }

    body.style.backgroundImage = background;
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const weatherInfo = document.querySelector('.weather-info');

    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.style.display = 'none';
}
