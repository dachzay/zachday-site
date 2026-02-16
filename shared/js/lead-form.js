(() => {
  const TURNSTILE_RETRY_MS = 150;
  const TURNSTILE_MAX_RETRIES = 40;

  function getSiteKey() {
    return (document.querySelector('meta[name="turnstile-site-key"]')?.content || "").trim();
  }

  function getTracker() {
    if (window.ZachSite && typeof window.ZachSite.track === "function") {
      return window.ZachSite.track;
    }
    return () => {};
  }

  function initLeadForm(options) {
    const {
      formId,
      noteId,
      turnstileContainerId,
      fallbackEmail = "",
      eventContext = "unknown",
      submitLoadingText = "Submitting...",
      successText = "Thanks. Your request was sent successfully.",
      turnstileMissingText = "Please complete the spam check and submit again.",
      turnstileUnavailableText = "Spam protection failed to load. Please email",
      genericErrorText = "Could not submit right now. Please email",
    } = options || {};

    const form = document.getElementById(formId);
    const note = document.getElementById(noteId);
    const turnstileContainer = document.getElementById(turnstileContainerId);
    if (!form || !note) {
      return;
    }

    if (form.dataset.leadInitialized === "true") {
      return;
    }
    form.dataset.leadInitialized = "true";

    const track = getTracker();
    const submitButton = form.querySelector("button[type='submit']");
    const siteKey = getSiteKey();
    const hasSiteKey = siteKey && siteKey !== "REPLACE_WITH_TURNSTILE_SITE_KEY";
    let turnstileWidgetId = null;
    let turnstileReady = !hasSiteKey;
    let hasStarted = false;

    const markStarted = () => {
      if (hasStarted) {
        return;
      }
      hasStarted = true;
      track("lead_form_start", { context: eventContext, form_id: formId });
    };

    form.addEventListener("focusin", markStarted, { once: true });
    form.addEventListener("input", markStarted, { once: true });

    const setFallbackNote = (prefixText) => {
      const fallback = fallbackEmail ? `${prefixText} ${fallbackEmail}.` : prefixText;
      note.textContent = fallback;
    };

    const renderTurnstile = (attempt = 0) => {
      if (!hasSiteKey || !turnstileContainer) {
        return;
      }

      if (window.turnstile && typeof window.turnstile.render === "function") {
        turnstileWidgetId = window.turnstile.render(turnstileContainer, {
          sitekey: siteKey,
          theme: "dark",
        });
        turnstileReady = true;
        return;
      }

      if (attempt >= TURNSTILE_MAX_RETRIES) {
        turnstileReady = false;
        setFallbackNote(`${turnstileUnavailableText}`);
        track("lead_form_turnstile_unavailable", { context: eventContext, form_id: formId });
        return;
      }

      window.setTimeout(() => renderTurnstile(attempt + 1), TURNSTILE_RETRY_MS);
    };

    if (hasSiteKey && turnstileContainer) {
      turnstileContainer.classList.remove("hidden");
      renderTurnstile();
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      markStarted();

      const name = (form.querySelector('input[name="name"]')?.value || "").trim();
      const email = (form.querySelector('input[name="email"]')?.value || "").trim();
      const employeeBand = form.querySelector('select[name="employee_band"]')?.value || "";
      const website = (form.querySelector('input[name="website"]')?.value || "").trim();
      const turnstileToken = (form.querySelector("input[name='cf-turnstile-response']")?.value || "").trim();

      track("lead_form_submit_attempt", {
        context: eventContext,
        form_id: formId,
        source_path: window.location.pathname,
      });

      if (hasSiteKey && (!turnstileReady || !turnstileToken)) {
        note.textContent = turnstileMissingText;
        track("lead_form_submit_error", {
          context: eventContext,
          form_id: formId,
          reason: turnstileReady ? "turnstile_token_missing" : "turnstile_unavailable",
        });
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }
      note.textContent = submitLoadingText;

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            employee_band: employeeBand,
            source_path: window.location.pathname,
            website,
            turnstile_token: turnstileToken,
          }),
        });

        const result = await response.json().catch(() => ({}));
        if (response.ok && result.ok) {
          note.textContent = successText;
          form.reset();
          if (
            hasSiteKey &&
            turnstileWidgetId !== null &&
            window.turnstile &&
            typeof window.turnstile.reset === "function"
          ) {
            window.turnstile.reset(turnstileWidgetId);
          }

          track("lead_form_submit_success", {
            context: eventContext,
            form_id: formId,
            source_path: window.location.pathname,
          });
          return;
        }

        if (response.status === 429) {
          note.textContent = "Too many attempts. Please try again shortly.";
        } else {
          setFallbackNote(result.error || genericErrorText);
        }

        track("lead_form_submit_error", {
          context: eventContext,
          form_id: formId,
          status: response.status,
          message: typeof result.error === "string" ? result.error.slice(0, 120) : "",
        });
      } catch {
        setFallbackNote(genericErrorText);
        track("lead_form_submit_error", {
          context: eventContext,
          form_id: formId,
          reason: "network_or_runtime_error",
        });
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  window.ZachSite = window.ZachSite || {};
  window.ZachSite.initLeadForm = initLeadForm;
})();
