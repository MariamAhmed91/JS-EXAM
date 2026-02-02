import { appState } from "./dashboard.js";

export let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

export async function Holidays() {
  const yearInput = document.getElementById("global-year");
  const holidaysContainer = document.getElementById("holidays-content");

  if (!yearInput || !holidaysContainer) return;

  const year = yearInput.value;
  const countryCode = appState.country;

  if (!year || !countryCode) {
    alert("Select country & year");
    return;
  }

  const res = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
  );

  const data = await res.json();
  let cartona = "";

  data.forEach(h => {
    const id = `${countryCode}-${h.date}`;
    const isFav = favorites.some(f => f.id === id);

    const dateObj = new Date(h.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const weekday = dateObj.toLocaleString("default", { weekday: "long" });

    cartona += `
      <div class="holiday-card">

        <div class="holiday-card-header">
          <div class="holiday-date-box">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
          </div>

          <button 
            class="holiday-action-btn favorite-btn ${isFav ? "active" : ""}"
            data-id="${id}"
            data-name="${h.name}"
            data-local="${h.localName}"
            data-date="${h.date}"
          >
            <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i>
          </button>
        </div>

        <h3>${h.localName}</h3>

        <p class="holiday-name">${h.name}</p>

        <div class="holiday-card-footer">
          <span class="holiday-day-badge">
            <i class="fa-regular fa-calendar"></i>
            ${weekday}
          </span>

          <span class="holiday-type-badge">
            ${h.types?.[0] || "Public"}
          </span>
        </div>

      </div>
    `;
  });

  holidaysContainer.innerHTML = cartona;

  holidaysContainer.onclick = e => {
    const btn = e.target.closest(".favorite-btn");
    if (!btn) return;
    toggleFavorite(btn);
  };

  updateFavoritesCount();
}


function toggleFavorite(btn) {
  const id = btn.dataset.id;
  const i = favorites.findIndex(f => f.id === id);

  if (i === -1) {
    favorites.push({ id });
    btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
  } else {
    favorites.splice(i, 1);
    btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCount();
}

export function updateFavoritesCount() {
  const el = document.getElementById("plans-count");
  if (!el) return;

  el.textContent = favorites.length;
  el.classList.toggle("hidden", favorites.length === 0);
}


