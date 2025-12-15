const THEME_KEY = "ck-theme";
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const storedTheme = localStorage.getItem(THEME_KEY);
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
const applyTheme = (theme) => {
  document.body.classList.toggle("theme-dark", theme === "dark");
  document.body.classList.toggle("theme-light", theme === "light");
};
applyTheme(initialTheme);
const themeToggleBtn = document.querySelector(".theme-toggle");
const langToggleBtn = document.querySelector(".lang-toggle");
const navToggleBtn = document.querySelector(".nav-toggle");
const nav = document.getElementById("primary-nav");
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", () => {
    const currentPath = window.location.pathname;
    const basePath = '/Chrsitos-Kontousias';
    if (currentPath.includes('/el/')) {
      window.location.href = 'https://ckont.github.io' + basePath + '/en/';
    } else {
      window.location.href = 'https://ckont.github.io' + basePath + '/el/';
    }
  });
}
if (navToggleBtn && nav) {
  const closeMenu = () => {
    if (!document.body.classList.contains("nav-open")) return;
    document.body.classList.add("nav-closing");
    navToggleBtn.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      document.body.classList.remove("nav-open", "nav-closing");
    }, 350);
  };
  navToggleBtn.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("nav-open");
    if (isOpen) {
      closeMenu();
    } else {
      document.body.classList.remove("nav-closing");
      document.body.classList.add("nav-open");
      navToggleBtn.setAttribute("aria-expanded", "true");
    }
  });
  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) return;
    const target = event.target;
    const clickedInsideNav = nav.contains(target);
    const clickedToggle = navToggleBtn.contains(target);
    if (!clickedInsideNav && !clickedToggle) {
      closeMenu();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200 && document.body.classList.contains("nav-open")) {
      closeMenu();
    }
  });
  nav.querySelectorAll("a[href^=\"#\"]").forEach((link) => {
    link.addEventListener("click", () => {
      if (document.body.classList.contains("nav-open")) {
        closeMenu();
      }
    });
  });
}
const avatar = document.querySelector(".hero__avatar");
const modal = document.querySelector('.image-modal[data-modal="avatar"]');
if (avatar && modal) {
  const backdrop = modal.querySelector("[data-modal-close]");
  const openModal = () => {
    modal.classList.add("image-modal--open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };
  const closeModal = () => {
    modal.classList.remove("image-modal--open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };
  avatar.addEventListener("click", openModal);
  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
const spotlightTargets = document.querySelectorAll(".interactive-spotlight");
spotlightTargets.forEach((el) => {
  let currentX = 50;
  let currentY = 0;
  let targetX = 50;
  let targetY = 0;
  let rafId = null;
  const update = () => {
    const ease = 0.12;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    el.style.setProperty("--spotlight-x", `${currentX}%`);
    el.style.setProperty("--spotlight-y", `${currentY}%`);
    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      rafId = requestAnimationFrame(update);
    } else {
      rafId = null;
    }
  };
  el.addEventListener("pointerenter", () => {
    el.classList.add("is-active");
  });
  el.addEventListener("pointerleave", () => {
    el.classList.remove("is-active");
  });
  el.addEventListener("pointermove", (event) => {
    const rect = el.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width) * 100;
    targetY = ((event.clientY - rect.top) / rect.height) * 100;
    if (!rafId) {
      rafId = requestAnimationFrame(update);
    }
  });
});

// Initialize scroll animations
import './components/scrollAnimations.js';

// Initialize projects slider
import './components/projectsSlider.js';