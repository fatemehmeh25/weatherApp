const apiKey = 'bf599c94f8064a48a1b93419252007'; 
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const themeToggle = document.getElementById('themeToggle');

const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const desc = document.getElementById('desc');
const forecastEl = document.getElementById('forecast');

const errorMsg = document.getElementById('error');
const weatherResult = document.getElementById('weatherResult');

// Theme toggle
let isDark = false;
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.className = isDark ? 'dark' : 'light';
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Fetch current + 5-day forecast
async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');

    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    weatherResult.classList.add('hidden');
    errorMsg.classList.remove('hidden');
    console.error(err);
  }
}

function displayWeather(data) {
  const { location, current, forecast } = data;

  // Current weather
  cityName.textContent = `${location.name}, ${location.country}`;
  temp.textContent = `${current.temp_c}°C`;
  desc.textContent = current.condition.text;
  weatherIcon.src = `https:${current.condition.icon}`;

  // Background based on condition
  const condition = current.condition.text.toLowerCase();
  if (condition.includes('rain') || condition.includes('shower')) {
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?rain')";
  } else if (condition.includes('cloud')) {
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?cloudy')";
  } else if (condition.includes('snow')) {
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?snow')";
  } else {
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?sunny')";
  }

  // 5-day forecast
  forecastEl.innerHTML = '';
  forecast.forecastday.forEach(day => {
    const d = new Date(day.date);
    const div = document.createElement('div');
    div.className = 'day';
    div.innerHTML = `
      <h4>${d.toLocaleDateString(undefined, { weekday: 'short' })}</h4>
      <img src="https:${day.day.condition.icon}" />
      <p>${day.day.avgtemp_c}°C</p>
    `;
    forecastEl.appendChild(div);
  });

  weatherResult.classList.remove('hidden');
  errorMsg.classList.add('hidden');
}

// Event listeners
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') getWeather();
});

// Initialize theme
document.body.className = 'light';
