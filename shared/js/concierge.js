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

  function normalize(value, max) {
    if (typeof value !== "string") {
      return "";
    }
    return value.trim().slice(0, max);
  }

  function initConcierge(options) {
    const rootId = options?.rootId || "concierge";
    const noteId = options?.noteId || "concierge-note";
    const turnstileContainerId = options?.turnstileContainerId || "concierge-turnstile";
    const context = options?.eventContext || "home";
    const fallbackEmail = options?.fallbackEmail || "";

    const root = document.getElementById(rootId);
    const note = document.getElementById(noteId);
    const turnstileContainer = document.getElementById(turnstileContainerId);
    if (!root || !note) {
      return;
    }

    const track = getTracker();
    const siteKey = getSiteKey();
    const hasSiteKey = siteKey && siteKey !== "REPLACE_WITH_TURNSTILE_SITE_KEY";
    let turnstileWidgetId = null;
    let turnstileReady = !hasSiteKey;

    const sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const steps = [
      {
        id: "business_type",
        question: "What type of business are you operating?",
        type: "text",
        placeholder: "Example: Local services company",
      },
      {
        id: "primary_bottleneck",
        question: "What is the biggest process bottleneck right now?",
        type: "textarea",
        placeholder: "Example: Manual follow-up and inconsistent handoff",
      },
      {
        id: "current_tools",
        question: "Which tools do your operators use today?",
        type: "text",
        placeholder: "Example: Google Sheets, Gmail, HubSpot",
      },
      {
        id: "timeline",
        question: "What timeline are you targeting for a pilot?",
        type: "select",
        options: ["Within 2 weeks", "2-4 weeks", "1-2 months", "Exploring only"],
      },
      {
        id: "budget_band",
        question: "What budget range fits this project?",
        type: "select",
        options: ["Under $5k", "$5k-$10k", "$10k-$25k", "$25k+", "Need guidance"],
      },
      {
        id: "contact",
        question: "Where should scope options be sent?",
        type: "contact",
      },
    ];

    const state = {
      stepIndex: 0,
      answers: {},
      transcript: [],
      submitting: false,
    };

    function setNote(text) {
      note.textContent = text;
    }

    function addLine(role, text) {
      const value = normalize(text, 500);
      if (!value) {
        return;
      }
      state.transcript.push({ role, text: value });
    }

    function renderTranscript(container) {
      container.innerHTML = state.transcript
        .map((line) => `<div class="concierge-line"><strong>${line.role === "assistant" ? "Martin" : "You"}:</strong> ${line.text}</div>`)
        .join("");
      container.scrollTop = container.scrollHeight;
    }

    function renderTurnstile(attempt = 0) {
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
        setNote(`Spam protection did not load. Please email ${fallbackEmail}.`);
        return;
      }

      window.setTimeout(() => renderTurnstile(attempt + 1), TURNSTILE_RETRY_MS);
    }

    function renderStep() {
      const step = steps[state.stepIndex];
      const progress = state.stepIndex + 1;

      root.innerHTML = `
        <div class="concierge-progress">Step ${progress}/${steps.length}</div>
        <div class="concierge-transcript" id="concierge-transcript" aria-live="polite"></div>
        <div class="concierge-controls" id="concierge-controls"></div>
      `;

      const transcriptEl = root.querySelector("#concierge-transcript");
      const controlsEl = root.querySelector("#concierge-controls");
      renderTranscript(transcriptEl);

      if (!state.transcript.some((line) => line.text === step.question)) {
        addLine("assistant", step.question);
        renderTranscript(transcriptEl);
      }

      if (step.type === "text") {
        controlsEl.innerHTML = `
          <div>
            <label for="concierge-input">Answer</label>
            <input id="concierge-input" type="text" placeholder="${step.placeholder || ""}" />
          </div>
          <div class="concierge-actions">
            <button type="button" id="concierge-next">Continue</button>
            ${state.stepIndex > 0 ? '<button type="button" id="concierge-back">Edit Previous</button>' : ""}
            <button type="button" id="concierge-restart">Restart</button>
          </div>
        `;
      }

      if (step.type === "textarea") {
        controlsEl.innerHTML = `
          <div>
            <label for="concierge-input">Answer</label>
            <textarea id="concierge-input" placeholder="${step.placeholder || ""}"></textarea>
          </div>
          <div class="concierge-actions">
            <button type="button" id="concierge-next">Continue</button>
            ${state.stepIndex > 0 ? '<button type="button" id="concierge-back">Edit Previous</button>' : ""}
            <button type="button" id="concierge-restart">Restart</button>
          </div>
        `;
      }

      if (step.type === "select") {
        controlsEl.innerHTML = `
          <div>
            <label for="concierge-input">Choose one</label>
            <select id="concierge-input">
              <option value="" selected disabled>Select an option</option>
              ${step.options.map((option) => `<option value="${option}">${option}</option>`).join("")}
            </select>
          </div>
          <div class="concierge-actions">
            <button type="button" id="concierge-next">Continue</button>
            ${state.stepIndex > 0 ? '<button type="button" id="concierge-back">Edit Previous</button>' : ""}
            <button type="button" id="concierge-restart">Restart</button>
          </div>
        `;
      }

      if (step.type === "contact") {
        controlsEl.innerHTML = `
          <div>
            <label for="concierge-name">Name</label>
            <input id="concierge-name" type="text" autocomplete="name" />
          </div>
          <div>
            <label for="concierge-email">Email</label>
            <input id="concierge-email" type="email" autocomplete="email" />
          </div>
          <div>
            <label for="concierge-employee-band">Employees</label>
            <select id="concierge-employee-band">
              <option value="" selected disabled>Select a range</option>
              <option value="0-5">0-5</option>
              <option value="5-10">5-10</option>
              <option value="11-25">11-25</option>
              <option value="26-50">26-50</option>
              <option value="51-100">51-100</option>
              <option value="101-250">101-250</option>
              <option value="251+">251+</option>
            </select>
          </div>
          <div>
            <label for="concierge-notes">Extra notes (optional)</label>
            <textarea id="concierge-notes" placeholder="Constraints, priorities, or dependencies"></textarea>
          </div>
          <div class="concierge-actions">
            <button type="button" id="concierge-submit">Submit Scope</button>
            <button type="button" id="concierge-back">Edit Previous</button>
            <button type="button" id="concierge-restart">Restart</button>
          </div>
          <div id="concierge-turnstile-inline"></div>
        `;

        const turnstileInline = controlsEl.querySelector("#concierge-turnstile-inline");
        if (turnstileContainer && turnstileInline) {
          turnstileInline.replaceWith(turnstileContainer);
          turnstileContainer.classList.remove("hidden");
        }
      }

      const restart = controlsEl.querySelector("#concierge-restart");
      if (restart) {
        restart.addEventListener("click", () => {
          state.stepIndex = 0;
          state.answers = {};
          state.transcript = [];
          if (turnstileWidgetId !== null && window.turnstile && typeof window.turnstile.reset === "function") {
            window.turnstile.reset(turnstileWidgetId);
          }
          setNote("Conversation restarted.");
          renderStep();
        });
      }

      const back = controlsEl.querySelector("#concierge-back");
      if (back) {
        back.addEventListener("click", () => {
          if (state.stepIndex === 0) {
            return;
          }
          state.stepIndex -= 1;
          setNote("You can edit the previous answer.");
          renderStep();
        });
      }

      const next = controlsEl.querySelector("#concierge-next");
      if (next) {
        next.addEventListener("click", () => {
          const value = normalize(String(controlsEl.querySelector("#concierge-input")?.value || ""), 240);
          if (!value) {
            setNote("Please enter an answer before continuing.");
            return;
          }

          state.answers[step.id] = value;
          addLine("user", value);
          track("concierge_step_complete", {
            context,
            source_path: window.location.pathname,
            session_id: sessionId,
            step_id: step.id,
          });
          state.stepIndex += 1;
          setNote("Progress saved.");
          renderStep();
        });
      }

      const submit = controlsEl.querySelector("#concierge-submit");
      if (submit) {
        submit.addEventListener("click", async () => {
          if (state.submitting) {
            return;
          }

          const name = normalize(String(controlsEl.querySelector("#concierge-name")?.value || ""), 80);
          const email = normalize(String(controlsEl.querySelector("#concierge-email")?.value || ""), 254);
          const employeeBand = normalize(String(controlsEl.querySelector("#concierge-employee-band")?.value || ""), 20);
          const notes = normalize(String(controlsEl.querySelector("#concierge-notes")?.value || ""), 1000);
          const turnstileToken = normalize(
            String(document.querySelector("input[name='cf-turnstile-response']")?.value || ""),
            4096
          );

          if (!name || !email || !employeeBand) {
            setNote("Name, email, and employee range are required.");
            return;
          }

          if (hasSiteKey && (!turnstileReady || !turnstileToken)) {
            setNote("Please complete the spam check and submit again.");
            return;
          }

          state.answers.name = name;
          state.answers.email = email;
          state.answers.employee_band = employeeBand;
          state.answers.notes = notes;
          addLine("user", `Contact: ${name}, ${email}, team ${employeeBand}`);

          state.submitting = true;
          submit.disabled = true;
          setNote("Submitting scope...");

          track("concierge_submit_attempt", {
            context,
            source_path: window.location.pathname,
            session_id: sessionId,
          });

          try {
            const response = await fetch("/api/concierge-scope", {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                session_id: sessionId,
                source_path: window.location.pathname,
                name,
                email,
                employee_band: employeeBand,
                business_type: state.answers.business_type || "",
                primary_bottleneck: state.answers.primary_bottleneck || "",
                current_tools: state.answers.current_tools || "",
                timeline: state.answers.timeline || "",
                budget_band: state.answers.budget_band || "",
                notes,
                transcript: state.transcript,
                turnstile_token: turnstileToken,
              }),
            });

            const result = await response.json().catch(() => ({}));
            if (response.ok && result.ok) {
              setNote("Scope submitted. You will receive next-step options shortly.");
              track("concierge_submit_success", {
                context,
                source_path: window.location.pathname,
                session_id: sessionId,
              });
              return;
            }

            setNote(result.error || `Could not submit right now. Please email ${fallbackEmail}.`);
            track("concierge_submit_error", {
              context,
              source_path: window.location.pathname,
              session_id: sessionId,
              status: response.status,
            });
          } catch {
            setNote(`Could not submit right now. Please email ${fallbackEmail}.`);
            track("concierge_submit_error", {
              context,
              source_path: window.location.pathname,
              session_id: sessionId,
              reason: "network_or_runtime_error",
            });
          } finally {
            state.submitting = false;
            submit.disabled = false;
          }
        });
      }
    }

    if (hasSiteKey && turnstileContainer) {
      renderTurnstile();
    }

    track("concierge_open", {
      context,
      source_path: window.location.pathname,
      session_id: sessionId,
    });
    renderStep();
  }

  window.ZachSite = window.ZachSite || {};
  window.ZachSite.initConcierge = initConcierge;
})();
