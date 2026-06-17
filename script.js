const yearEl = document.getElementById("year");
const shell = document.getElementById("shell");
const indexRail = document.getElementById("index-rail");
const stageSpotlight = document.getElementById("stage-spotlight");
const navItems = document.querySelectorAll(".nav-item");
const dockItems = document.querySelectorAll(".dock-item");
const panels = document.querySelectorAll(".panel");
const indicator = document.getElementById("nav-indicator");
const focusToggle = document.getElementById("focus-toggle");
const focusDock = document.getElementById("focus-dock");
const focusExit = document.getElementById("focus-exit");

let deepFocus = false;
let pulseTimer = null;

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

function pulseFocus() {
  if (!shell) return;
  shell.classList.add("is-pulse");
  clearTimeout(pulseTimer);
  pulseTimer = setTimeout(() => shell.classList.remove("is-pulse"), 600);
}

function setDeepFocus(on) {
  deepFocus = on;
  shell.classList.toggle("is-deep-focus", on);
  focusToggle.setAttribute("aria-pressed", String(on));
  focusToggle.setAttribute("aria-label", on ? "Exit focus mode" : "Enter focus mode");
  focusToggle.querySelector(".focus-toggle-text").textContent = on ? "Exit focus" : "Focus";

  if (focusDock) {
    focusDock.hidden = !on;
    focusDock.classList.toggle("is-visible", on);
  }

  document.body.style.overflow = on ? "hidden" : "";
}

function showPanel(name) {
  navItems.forEach((btn) => {
    const isActive = btn.dataset.panel === name;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
    if (isActive) moveIndicator(btn);
  });

  dockItems.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.panel === name);
  });

  panels.forEach((panel) => {
    const isActive = panel.id === `panel-${name}`;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  shell.classList.add("is-reading");
  pulseFocus();
  history.replaceState(null, "", `#${name}`);
}

function toggleDeepFocus() {
  setDeepFocus(!deepFocus);
}

navItems.forEach((btn) => {
  btn.addEventListener("click", () => showPanel(btn.dataset.panel));
});

dockItems.forEach((btn) => {
  btn.addEventListener("click", () => showPanel(btn.dataset.panel));
});

if (focusToggle) {
  focusToggle.addEventListener("click", toggleDeepFocus);
}

if (focusExit) {
  focusExit.addEventListener("click", () => setDeepFocus(false));
}

if (indexRail) {
  indexRail.addEventListener("mouseenter", () => shell.classList.add("is-rail-hover"));
  indexRail.addEventListener("mouseleave", () => shell.classList.remove("is-rail-hover"));
  indexRail.addEventListener("focusin", () => shell.classList.add("is-rail-hover"));
  indexRail.addEventListener("focusout", () => shell.classList.remove("is-rail-hover"));
}

window.addEventListener("resize", () => {
  const active = document.querySelector(".nav-item.is-active");
  if (active) moveIndicator(active);
});

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea")) return;

  if (e.key === "f" || e.key === "F") {
    e.preventDefault();
    toggleDeepFocus();
    return;
  }

  if (e.key === "Escape" && deepFocus) {
    e.preventDefault();
    setDeepFocus(false);
    return;
  }

  const panelMap = { "1": "about", "2": "resume", "3": "projects" };
  if (panelMap[e.key]) {
    e.preventDefault();
    showPanel(panelMap[e.key]);
  }
});

const initial = location.hash.replace("#", "");
const start = initial && document.getElementById(`panel-${initial}`) ? initial : "about";
showPanel(start);
