import { appState } from "./dashboard.js";
import { updateFavoritesCount, favorites } from "./holidays.js"; 
export async function LongWeekends() {
  const yearInput = document.getElementById("global-year");
  const lwContainer = document.getElementById("lw-content");

  if (!yearInput || !lwContainer) return;

  const year = yearInput.value || "2026";
  const countryCode = appState.country || "EG";

  try {
    const res = await fetch(`https://date.nager.at/api/v3/LongWeekend/${year}/${countryCode}`);
    if (!res.ok) throw new Error("Failed to fetch Long Weekends");

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      lwContainer.innerHTML = `<p class="error">No Long Weekends found for ${countryCode} ${year}</p>`;
      return;
    }

    let html = "";

    data.forEach((lw, index) => {
      const id = `${countryCode}-${lw.startDate}-${lw.endDate}`;
      const isFav = favorites.some(f => f.id === id);

      const startDate = new Date(lw.startDate);
      const endDate = new Date(lw.endDate);
      const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24) + 1);

      const infoClass = lw.extraDaysNeeded ? "warning" : "success";
      const infoText = lw.extraDaysNeeded ? "Requires taking a bridge day off" : "No extra days off needed!";
      let daysVisual = "";
      if (lw.dayOffs && lw.dayOffs.length > 0) {
        lw.dayOffs.forEach(d => {
          const dayClass = d.isWeekend ? "lw-day weekend" : "lw-day";
          const dayName = new Date(d.date).toLocaleString("default", { weekday: "short" });
          const dayNum = new Date(d.date).getDate();
          daysVisual += `
            <div class="${dayClass}">
              <span class="name">${dayName}</span>
              <span class="num">${dayNum}</span>
            </div>
          `;
        });
      }

      html += `
        <div class="lw-card">
          <div class="lw-card-header">
            <span class="lw-badge"><i class="fa-solid fa-calendar-days"></i> ${dayCount} Days</span>
            <button class="holiday-action-btn favorite-btn ${isFav ? "active" : ""}" 
              data-id="${id}" data-name="Long Weekend #${index + 1}" 
              data-date="${lw.startDate} to ${lw.endDate}">
              <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i>
            </button>
          </div>
          <h3>Long Weekend #${index + 1}</h3>
          <div class="lw-dates"><i class="fa-regular fa-calendar"></i> ${startDate.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("default", { month: "short", day: "numeric" })}, ${endDate.getFullYear()}</div>
          <div class="lw-info-box ${infoClass}"><i class="fa-solid fa-${infoClass === "success" ? "check-circle" : "info-circle"}"></i> ${infoText}</div>
          <div class="lw-days-visual">${daysVisual}</div>
        </div>
      `;
    });

    lwContainer.innerHTML = html;
    lwContainer.onclick = e => {
      const btn = e.target.closest(".favorite-btn");
      if (!btn) return;
      toggleFavorite(btn);
    };

  } catch (err) {
    console.error(err);
    lwContainer.innerHTML = `<p class="error">Error fetching Long Weekends for ${countryCode} ${year}</p>`;
  }
}
function toggleFavorite(btn) {
  const id = btn.dataset.id;
  const i = favorites.findIndex(f => f.id === id);

  if (i === -1) {
    favorites.push({ id });
    btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
    btn.classList.add("active");
  } else {
    favorites.splice(i, 1);
    btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
    btn.classList.remove("active");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCount();
}
