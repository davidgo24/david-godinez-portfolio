const yearEl = document.getElementById("year");
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".panel");
const indicator = document.getElementById("nav-indicator");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

function moveIndicator(activeBtn) {
  if (!indicator || !activeBtn) return;
  const nav = activeBtn.parentElement;
  const navRect = nav.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  indicator.style.transform = `translateY(${btnRect.top - navRect.top + (btnRect.height - indicator.offsetHeight) / 2}px)`;
  indicator.style.opacity = "1";
}

function showPanel(name) {
  navItems.forEach((btn) => {
    const isActive = btn.dataset.panel === name;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
    if (isActive) moveIndicator(btn);
  });

  panels.forEach((panel) => {
    const isActive = panel.id === `panel-${name}`;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  history.replaceState(null, "", `#${name}`);
}

navItems.forEach((btn) => {
  btn.addEventListener("click", () => showPanel(btn.dataset.panel));
});

window.addEventListener("resize", () => {
  const active = document.querySelector(".nav-item.is-active");
  if (active) moveIndicator(active);
});

const initial = location.hash.replace("#", "");
const start = initial && document.getElementById(`panel-${initial}`) ? initial : "about";
showPanel(start);
