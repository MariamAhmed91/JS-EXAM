import { appState } from "./dashboard.js";
const forecastList = document.querySelector(".forecast-list");

export async function getWeather() {
  const { lat, lon, city, countryName } = appState;

  if (!lat || !lon) {
    console.warn("Select country & city first to get weather.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    );

    if (!response.ok) throw new Error("Weather API request failed");

    const data = await response.json();
    renderForecast(data.daily);

    updateWeatherHero(data.daily, city, countryName);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

function getWeatherIcon(code) {
  const map = {
    0: "fa-sun",
    1: "fa-sun",
    2: "fa-cloud-sun",
    3: "fa-cloud",
    45: "fa-smog",
    48: "fa-smog",
    51: "fa-cloud-rain",
    53: "fa-cloud-rain",
    55: "fa-cloud-showers-heavy",
    61: "fa-cloud-showers-heavy",
    63: "fa-cloud-showers-heavy",
    65: "fa-cloud-showers-heavy",
    71: "fa-snowflake",
    73: "fa-snowflake",
    75: "fa-snowflake",
    80: "fa-cloud-showers-heavy",
    81: "fa-cloud-showers-heavy",
    82: "fa-cloud-showers-heavy",
    95: "fa-bolt",
    96: "fa-bolt",
    99: "fa-bolt",
  };
  return map[code] || "fa-sun";
}

function renderForecast(daily) {
  let cartona = "";

  daily.time.forEach((date, i) => {
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
    const fullDate = new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

    cartona += `
      <div class="forecast-day ${i === 0 ? "today" : ""}">
        <div class="forecast-day-name">
          <span class="day-label">${i === 0 ? "Today" : dayName}</span>
          <span class="day-date">${fullDate}</span>
        </div>
        <div class="forecast-icon">
          <i class="fa-solid ${getWeatherIcon(daily.weathercode[i])}"></i>
        </div>
        <div class="forecast-temps">
          <span class="temp-max">${Math.round(daily.temperature_2m_max[i])}°</span>
          <span class="temp-min">${Math.round(daily.temperature_2m_min[i])}°</span>
        </div>
        <div class="forecast-precip"></div>
      </div>
    `;
  });

  forecastList.innerHTML = cartona;
}

function updateWeatherHero(daily, city, countryName) {
  const heroTemp = document.querySelector(".weather-hero-temp .temp-value");
  const heroCondition = document.querySelector(".weather-condition");
  const heroLocation = document.querySelector(".weather-location span");

  if (!heroTemp || !heroCondition || !heroLocation) return;

  heroTemp.textContent = Math.round(daily.temperature_2m_max[0]);
  heroCondition.textContent = "Clear Sky"; 
  heroLocation.textContent = `${city || ""}, ${countryName || ""}`;
}
