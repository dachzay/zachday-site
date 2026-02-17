(() => {
  const gtmId = (document.querySelector('meta[name="gtm-id"]')?.content || "").trim();
  if (!/^GTM-[A-Z0-9]+$/i.test(gtmId)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(script);
})();
