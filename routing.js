export function showView(viewId) {
  document.querySelectorAll(".view").forEach(view => {
    view.classList.remove("active");
  });

  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");
}

export function initRouter() {
  const navLinks = document.querySelectorAll(".nav-item");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const viewName = link.dataset.view;
      const viewId = `${viewName}-view`;

      showView(viewId);
      history.pushState({ viewId }, "", `/${viewName}`);

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  window.addEventListener("popstate", e => {
    if (e.state?.viewId) {
      showView(e.state.viewId);
    }
  });
}
