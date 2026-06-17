const yearEl = document.getElementById("year");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

function showPanel(name) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.panel === name;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isVisible = panel.id === `panel-${name}`;
    panel.classList.toggle("is-visible", isVisible);
    panel.hidden = !isVisible;
  });

  history.replaceState(null, "", `#${name}`);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => showPanel(tab.dataset.panel));
});

const initial = location.hash.replace("#", "");
if (initial && document.getElementById(`panel-${initial}`)) {
  showPanel(initial);
}
