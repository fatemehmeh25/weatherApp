const apiKey = 'bf599c94f8064a48a1b93419252007'; 
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const desc = document.getElementById('desc');
const errorMsg = document.getElementById('error');
const weatherResult = document.getElementById('weatherResult');

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') getWeather();
});

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;
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
  cityName.textContent = `${data.location.name}, ${data.location.country}`;
  temp.textContent = `${data.current.temp_c}°C`;
  desc.textContent = data.current.condition.text;
  weatherIcon.src = `https:${data.current.condition.icon}`;

  weatherResult.classList.remove('hidden');
  errorMsg.classList.add('hidden');
}
