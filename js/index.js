// Theme toggle
const THEME_KEY = "ck-theme";
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const storedTheme = localStorage.getItem(THEME_KEY);
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
const LANG_KEY = "ck-lang";
const storedLang = localStorage.getItem(LANG_KEY);
const initialLang = storedLang === "el" ? "el" : "en";

const applyTheme = (theme) => {
  document.body.classList.toggle("theme-dark", theme === "dark");
  document.body.classList.toggle("theme-light", theme === "light");
};

const applyLang = (lang) => {
  const normalized = lang === "el" ? "el" : "en";
  document.body.classList.toggle("lang-en", normalized === "en");
  document.body.classList.toggle("lang-el", normalized === "el");
  document.documentElement.setAttribute("lang", normalized === "el" ? "el" : "en");
};

applyTheme(initialTheme);
applyLang(initialLang);

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
    const nextLang = document.body.classList.contains("lang-en") ? "el" : "en";
    applyLang(nextLang);
    localStorage.setItem(LANG_KEY, nextLang);
  });
}

if (navToggleBtn && nav) {
  navToggleBtn.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close nav when clicking outside of the nav or toggle button
  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) return;

    const target = event.target;
    const clickedInsideNav = nav.contains(target);
    const clickedToggle = navToggleBtn.contains(target);

    if (!clickedInsideNav && !clickedToggle) {
      document.body.classList.remove("nav-open");
      navToggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200 && document.body.classList.contains("nav-open")) {
      document.body.classList.remove("nav-open");
      navToggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  nav.querySelectorAll("a[href^=\"#\"]").forEach((link) => {
    link.addEventListener("click", () => {
      if (document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        navToggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// Avatar modal
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

// Interactive spotlight backgrounds (with smoothing)
const spotlightTargets = document.querySelectorAll(".interactive-spotlight");

spotlightTargets.forEach((el) => {
  let currentX = 50;
  let currentY = 0;
  let targetX = 50;
  let targetY = 0;
  let rafId = null;

  const update = () => {
    const ease = 0.12; // smaller = slower/smoother
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
