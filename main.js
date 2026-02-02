import { initRouter } from "./routing.js";
import { infoCountry, getCityByCountry, appState } from "./dashboard.js";
import { Holidays, updateFavoritesCount } from "./holidays.js";
import { getPlans, savePlan } from "./plans.js";
import { LongWeekends } from "./longWeekends.js";
import { getWeather } from "./weather.js";
document.addEventListener("DOMContentLoaded", () => {
  Holidays();
  LongWeekends();
  updateFavoritesCount();
  initRouter();
});
const yearInput = document.getElementById("global-year");
if (yearInput) {
  yearInput.addEventListener("change", () => {
    Holidays();
    LongWeekends();
  });
}
const countrySelect = document.getElementById("country-select");
if (countrySelect) {
  countrySelect.addEventListener("change", async e => {
    appState.country = e.target.value;
    await getCityByCountry(appState.country); 
    Holidays();
    LongWeekends();
    getWeather();
  });
}
const citySelect = document.getElementById("global-city");
if (citySelect) {
  citySelect.addEventListener("change", e => {
    appState.city = e.target.value;
    getWeather();
  });
}
