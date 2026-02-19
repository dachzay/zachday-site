(() => {
  function normalizePath(path) {
    if (!path || path === "/index.html") {
      return "/";
    }

    const cleaned = path.replace(/\/+$/, "");
    return cleaned || "/";
  }

  function initNavState() {
    const nav = document.querySelector(".site-nav");
    if (!nav) {
      return;
    }

    const currentPath = normalizePath(window.location.pathname);
    const links = nav.querySelectorAll("a[href]");

    links.forEach((link) => {
      link.removeAttribute("aria-current");
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.includes("#")) {
        return;
      }

      let targetPath = "";
      try {
        targetPath = normalizePath(new URL(href, window.location.origin).pathname);
      } catch {
        return;
      }

      if (targetPath === currentPath) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) {
      return;
    }

    const toggle = () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  function initYear() {
    const year = document.getElementById("year");
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  function initPresenceDots() {
    const dots = document.querySelectorAll(".dot");
    if (!dots.length) {
      return;
    }

    const setDot = () => {
      const online = navigator.onLine;
      dots.forEach((dot) => {
        dot.style.background = online ? "var(--accent)" : "var(--danger)";
        dot.style.boxShadow = online
          ? "0 0 12px rgba(44, 200, 161, 0.7)"
          : "0 0 12px rgba(239, 68, 68, 0.7)";
        dot.title = online ? "Online" : "Offline";
      });
    };

    setDot();
    window.addEventListener("online", setDot);
    window.addEventListener("offline", setDot);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initNavState();
    initYear();
    initPresenceDots();
  });
})();
