// src/js/dashboard.js

export var appState = {
  country: null,
  countryName: null,
  city: null,
  year: null,
  lat: null,  
  lon: null    
};

document.addEventListener("DOMContentLoaded", function () {
  var wrapper = document.getElementById("global-country-custom");
  var trigger = wrapper.querySelector(".custom-select-trigger");
  var dropdown = wrapper.querySelector(".custom-select-dropdown");
  var optionsContainer = wrapper.querySelector(".custom-select-options");
  var searchInput = wrapper.querySelector(".custom-select-search input");
  var selectedFlag = trigger.querySelector(".flag img");

  var selectedText = trigger.querySelector(".selected-text");
  var citySelect = document.getElementById("global-city");

  trigger.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("open");
    searchInput.focus();
  });

  async function getCountry() {
    var response = await fetch("https://date.nager.at/api/v3/AvailableCountries");
    if (response.ok) {
      var data = await response.json();
      var cartona = "";

      data.forEach(c => {
        cartona += `
          <div class="custom-select-option" data-code="${c.countryCode}" data-name="${c.name}">
            <img src="https://flagcdn.com/w40/${c.countryCode.toLowerCase()}.png" class="flag-img" onerror="this.style.display='none'">
            <span class="country-name">${c.name}</span>
            <span class="country-code">${c.countryCode}</span>
          </div>
        `;
      });

      optionsContainer.innerHTML = cartona;

      var options = wrapper.querySelectorAll(".custom-select-option");
      options.forEach(option => {
        option.addEventListener("click", function () {
          var code = this.dataset.code;
          var name = this.dataset.name;

          selectedFlag.src = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
          selectedText.textContent = name;

          appState.country = code;
          appState.countryName = name;

          getCityByCountry(code); 
          dropdown.classList.remove("open");
        });
      });
    }
  }

  getCountry();

  searchInput.addEventListener("input", function () {
    var value = this.value.toLowerCase();
    var options = optionsContainer.querySelectorAll(".custom-select-option");
    options.forEach(opt => {
      var name = opt.dataset.name.toLowerCase();
      opt.style.display = name.includes(value) ? "flex" : "none";
    });
  });

  document.addEventListener("click", function (e) {
    if (!wrapper.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
});



async function getCityByCountry(countryCode) {
  if (!countryCode) return;

  var response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
  if (response.ok) {
    var data = await response.json();
    if (data[0].latlng) {
      appState.lat = data[0].latlng[0];
      appState.lon = data[0].latlng[1];
    }

    var cartona = "";
    if (data[0].capital && data[0].capital.length > 0) {
      var capital = data[0].capital[0];
      appState.city = capital;
      updateSelectedDestination();

      cartona = `<option value="${capital}" selected>${capital}</option>`;
      document.getElementById("global-city").innerHTML = cartona;
    } else {
      document.getElementById("global-city").innerHTML = `<option value="">No Capital Found</option>`;
    }
  }
}


var selectedDestinationBox = document.getElementById("selected-destination");
function updateSelectedDestination() {
  if (!appState.country) return;

  var cartona = `
    <div class="selected-flag">
      <img src="https://flagcdn.com/w80/${appState.country.toLowerCase()}.png" alt="${appState.countryName}">
    </div>
    <div class="selected-info">
      <span class="selected-country-name">${appState.countryName || ""}</span>
      <span class="selected-city-name">${appState.city ? "• " + appState.city : ""}</span>
    </div>
    <button class="clear-selection-btn" id="clear-selection-btn">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  selectedDestinationBox.innerHTML = cartona;
  selectedDestinationBox.style.display = "flex";
  selectedDestinationBox.classList.remove("hidden");

  var deletSelect = document.getElementById("clear-selection-btn");
  deletSelect.addEventListener("click", function () {
    appState.country = null;
    appState.countryName = null;
    appState.city = null;
    appState.lat = null;
    appState.lon = null;
    selectedDestinationBox.style.display = "none";
  });
}


async function infoCountry(countryCode) {
  var response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
  if (!response.ok) return;

  var data = await response.json();
  var c = data[0];
  var currencies = c.currencies ? Object.values(c.currencies).map(cur => `${cur.name} (${cur.symbol || ""})`).join(", ") : "N/A";
  var languages = c.languages ? Object.values(c.languages).join(", ") : "N/A";
  var callingCode = c.idd?.root ? c.idd.root + (c.idd.suffixes?.[0] || "") : "N/A";
  var neighbors = c.borders && c.borders.length > 0 ? c.borders.map(code => `<span class="extra-tag border-tag">${code}</span>`).join("") : "N/A";

  var cartona = `
    <div class="section-card country-info-section" id="dashboard-country-info-section">
      <div class="section-header">
        <h2><i class="fa-solid fa-flag"></i> Country Information</h2>
      </div>
      <div id="dashboard-country-info" class="dashboard-country-info">
        <div class="dashboard-country-header">
          <img src="https://flagcdn.com/w160/${c.cca2.toLowerCase()}.png" alt="${c.name.common}" class="dashboard-country-flag">
          <div class="dashboard-country-title">
            <h3>${c.name.common}</h3>
            <p class="official-name">${c.name.official}</p>
            <span class="region"><i class="fa-solid fa-location-dot"></i> ${c.region} • ${c.subregion || ""}</span>
          </div>
        </div>
        <div class="dashboard-local-time">
          <div class="local-time-display">
            <i class="fa-solid fa-clock"></i>
            <span class="local-time-value" id="country-local-time">08:30:45 AM</span>
            <span class="local-time-zone">UTC+02:00</span>
          </div>
        </div>
        <div class="dashboard-country-grid">
          <div class="dashboard-country-detail"><i class="fa-solid fa-building-columns"></i><span class="label">Capital</span><span class="value">${c.capital?.[0] || "N/A"}</span></div>
          <div class="dashboard-country-detail"><i class="fa-solid fa-users"></i><span class="label">Population</span><span class="value">${c.population.toLocaleString()}</span></div>
          <div class="dashboard-country-detail"><i class="fa-solid fa-ruler-combined"></i><span class="label">Area</span><span class="value">${c.area.toLocaleString()} km²</span></div>
          <div class="dashboard-country-detail"><i class="fa-solid fa-globe"></i><span class="label">Continent</span><span class="value">${c.continents[0]}</span></div>
          <div class="dashboard-country-detail"><i class="fa-solid fa-phone"></i><span class="label">Calling Code</span><span class="value">${callingCode}</span></div>
          <div class="dashboard-country-detail"><i class="fa-solid fa-car"></i><span class="label">Driving Side</span><span class="value">${c.car.side}</span></div>
          <div class="dashboard-country-detail"><i class="fa-solid fa-calendar-week"></i><span class="label">Week Starts</span><span class="value">${c.startOfWeek}</span></div>
        </div>
        <div class="dashboard-country-extras">
          <div class="dashboard-country-extra"><h4><i class="fa-solid fa-coins"></i> Currency</h4><div class="extra-tags"><span class="extra-tag">${currencies}</span></div></div>
          <div class="dashboard-country-extra"><h4><i class="fa-solid fa-language"></i> Languages</h4><div class="extra-tags"><span class="extra-tag">${languages}</span></div></div>
          <div class="dashboard-country-extra"><h4><i class="fa-solid fa-map-location-dot"></i> Neighbors</h4><div class="extra-tags">${neighbors}</div></div>
        </div>
        <div class="dashboard-country-actions">
          <a href="https://www.google.com/maps/place/${c.name.common}" target="_blank" class="btn-map-link"><i class="fa-solid fa-map"></i> View on Google Maps</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("dashboard-country-info-section").innerHTML = cartona;

  if (c.timezones && c.timezones.length > 0) {
    updateLocalTime(c.timezones[0]);
  }
}

var exploreBtn = document.getElementById("global-search-btn");
exploreBtn.addEventListener("click", function () {
  if (!appState.country) {
    alert("Please select a country first");
    return;
  }
  infoCountry(appState.country);
});

// ----------------- Local Time -----------------
export function updateLocalTime(utcString) {
  const timeEl = document.getElementById("country-local-time");
  const zoneEl = document.querySelector(".local-time-zone");

  const match = utcString.match(/UTC([+-]\d+)/);
  if (!match) {
    timeEl.textContent = "N/A";
    zoneEl.textContent = utcString;
    return;
  }

  const offset = -parseInt(match[1], 10);
  const timeZone = `Etc/GMT${offset >= 0 ? "+" : ""}${offset}`;

  function tick() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    timeEl.textContent = formatter.format(now);
    zoneEl.textContent = utcString;
  }

  tick();
  setInterval(tick, 1000);
}

export {
  infoCountry,
  getCityByCountry
};
