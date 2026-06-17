const yearEl = document.getElementById("year");
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".panel");
const indicator = document.getElementById("nav-indicator");
const resumeEntries = document.querySelectorAll(".resume-entry");
const projectSlides = document.querySelectorAll(".project-slide");
const projectDots = document.querySelectorAll(".step-dot");
const projectCount = document.getElementById("project-count");
const projectPrev = document.getElementById("project-prev");
const projectNext = document.getElementById("project-next");

let projectIndex = 0;

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
    if (isActive && !panel.classList.contains("is-active")) {
      panel.classList.remove("is-entering");
      void panel.offsetWidth;
      panel.classList.add("is-entering");
    }
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  history.replaceState(null, "", `#${name}`);
}

function openResumeEntry(entry) {
  resumeEntries.forEach((item) => {
    const isOpen = item === entry;
    item.classList.toggle("is-open", isOpen);
    const trigger = item.querySelector(".resume-trigger");
    const panel = item.querySelector(".resume-panel");
    if (trigger) trigger.setAttribute("aria-expanded", String(isOpen));
    if (panel) panel.hidden = !isOpen;
  });
}

function showProject(index) {
  const total = projectSlides.length;
  if (total === 0) return;
  projectIndex = (index + total) % total;

  projectSlides.forEach((slide, i) => {
    const isActive = i === projectIndex;
    slide.classList.toggle("is-active", isActive);
    slide.hidden = !isActive;
  });

  projectDots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === projectIndex);
  });

  if (projectCount) {
    projectCount.textContent = `${projectIndex + 1} / ${total}`;
  }

  if (projectPrev) projectPrev.disabled = projectIndex === 0;
  if (projectNext) projectNext.disabled = projectIndex === total - 1;
}

navItems.forEach((btn) => {
  btn.addEventListener("click", () => showPanel(btn.dataset.panel));
});

resumeEntries.forEach((entry) => {
  const trigger = entry.querySelector(".resume-trigger");
  if (!trigger) return;
  trigger.addEventListener("click", () => {
    if (entry.classList.contains("is-open")) return;
    openResumeEntry(entry);
  });
});

if (projectPrev) {
  projectPrev.addEventListener("click", () => showProject(projectIndex - 1));
}

if (projectNext) {
  projectNext.addEventListener("click", () => showProject(projectIndex + 1));
}

projectDots.forEach((dot, i) => {
  dot.addEventListener("click", () => showProject(i));
});

window.addEventListener("resize", () => {
  const active = document.querySelector(".nav-item.is-active");
  if (active) moveIndicator(active);
});

const initial = location.hash.replace("#", "");
const start = initial && document.getElementById(`panel-${initial}`) ? initial : "about";
showPanel(start);
showProject(0);
