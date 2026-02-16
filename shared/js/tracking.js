(() => {
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  const dedupe = new Set();

  function clean(value, maxLength = 120) {
    if (typeof value !== "string") {
      return "";
    }
    return value.trim().slice(0, maxLength);
  }

  function track(eventName, props = {}) {
    const event = clean(eventName, 64);
    if (!event) {
      return;
    }

    const payload = {
      event,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      ...props,
    };

    dataLayer.push(payload);

    if (window.__ZD_DEBUG_TRACKING) {
      console.info("[zachday-track]", payload);
    }
  }

  function trackOnce(eventName, key, props = {}) {
    const event = clean(eventName, 64);
    const dedupeKey = `${event}:${clean(String(key || ""), 128)}`;
    if (!event || !dedupeKey || dedupe.has(dedupeKey)) {
      return;
    }
    dedupe.add(dedupeKey);
    track(event, props);
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-track-event]");
    if (!trigger) {
      return;
    }

    track(trigger.getAttribute("data-track-event"), {
      label: clean(trigger.getAttribute("data-track-label") || trigger.textContent || "", 120),
      href: clean(trigger.getAttribute("href") || "", 240),
    });
  });

  window.ZachSite = window.ZachSite || {};
  window.ZachSite.track = track;
  window.ZachSite.trackOnce = trackOnce;
})();
