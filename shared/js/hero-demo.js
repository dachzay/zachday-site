(() => {
  const REDUCED_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getTracker() {
    if (window.ZachSite && typeof window.ZachSite.track === "function") {
      return window.ZachSite.track;
    }
    return () => {};
  }

  function initHeroDemo() {
    const root = document.querySelector("[data-hero-demo]");
    if (!root) {
      return;
    }

    const list = root.querySelector("ul");
    if (!list) {
      return;
    }

    const track = getTracker();
    const lines = [
      "[martin] Intake parsed and validated",
      "[martin] Routing priority set to HIGH",
      "[martin] Draft response generated",
      "[martin] Ops checklist attached",
      "[martin] Human QA checkpoint passed",
      "[martin] Deployment package shipped"
    ];

    list.innerHTML = lines.map((line) => `<li>${line}</li>`).join("");
    const items = Array.from(list.querySelectorAll("li"));

    let index = 0;
    let hasStarted = false;

    const cycle = () => {
      items.forEach((item, itemIndex) => {
        item.classList.toggle("visible", itemIndex <= index);
        item.classList.toggle("active", itemIndex === index);
      });

      if (!hasStarted) {
        hasStarted = true;
        track("hero_demo_start", { context: "home", source_path: window.location.pathname });
      }

      index += 1;
      if (index >= items.length) {
        track("hero_demo_complete", { context: "home", source_path: window.location.pathname });
        index = 0;
        items.forEach((item) => {
          item.classList.remove("visible", "active");
        });
      }
    };

    if (REDUCED_MOTION) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry || !entry.isIntersecting) {
        return;
      }

      cycle();
      window.setInterval(cycle, 1450);
      observer.disconnect();
    }, { threshold: 0.4 });

    observer.observe(root);
  }

  document.addEventListener("DOMContentLoaded", initHeroDemo);
})();
