// src/js/storage.js
const STORAGE_KEY = "wanderlust_plans";

export function getPlans() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function savePlan(plan) {
  const plans = getPlans();
  const exists = plans.some(p => p.id === plan.id);
  if (exists) return;

  plans.push(plan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  updatePlansCount();
}

export function removePlan(id) {
  const plans = getPlans().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  updatePlansCount();
}

export function updatePlansCount() {
  const count = getPlans().length;
  const badge = document.getElementById("plans-count");
  const stat = document.getElementById("stat-saved");

  if (badge) {
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  }

  if (stat) stat.textContent = count;
}
