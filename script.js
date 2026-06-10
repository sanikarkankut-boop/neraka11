(function () {
  "use strict";

  const BRAND_NAME = "NERAKA11";
  const ALLOWED_SERVERS = [
    { value: "jepang", label: "Server Jepang" },
    { value: "thailand", label: "Server Thailand" },
    { value: "filipina", label: "Server Filipina" },
    { value: "kamboja", label: "Server Kamboja" },
    { value: "vietnam", label: "Server Vietnam" },
    { value: "china", label: "Server China" },
    { value: "rusia", label: "Server Rusia" }
  ];

  const TARGET_SELECTORS = [
    ".progressive-jackpot-text-wrapper",
    ".progressive-jackpot-text",
    ".jackpot",
    ".main-menu-outer-container"
  ];

  const STORAGE_KEY = "selectedServerEvent";
  const MAX_ATTEMPTS = 20;
  const DELAY_MS = 500;
  const MOBILE_BREAKPOINT = 768;
  const INSERT_POSITION = "afterend";

  function injectStyle() {
    if (document.getElementById("server-selector-style")) return;

    const style = document.createElement("style");
    style.id = "server-selector-style";
    style.textContent = `
      .server-selector-ui {
        width: calc(100% - 20px);
        max-width: 100%;
        margin: 12px auto 14px;
        padding: 14px;
        border-radius: 18px;
        background:
          radial-gradient(circle at top left, rgba(190, 42, 42, .18), transparent 34%),
          radial-gradient(circle at bottom right, rgba(180, 25, 25, .10), transparent 30%),
          linear-gradient(180deg, #330707 0%, #260505 58%, #1b0404 100%);
        border: 1px solid rgba(230, 42, 42, .70);
        box-shadow:
          0 0 0 1px rgba(255,90,90,.08) inset,
          0 0 16px rgba(190, 26, 26, .20),
          0 8px 24px rgba(0,0,0,.35);
        font-family: Montserrat,sans-serif;
        position: relative;
        overflow: hidden;
        z-index: 99;
      }

      .server-selector-ui::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent 0%, rgba(255, 76, 76, 0.308) 50%, transparent 100%);
        transform: translateX(-120%);
        animation: serverSelectorShine 3.8s linear infinite;
        pointer-events: none;
      }

      .server-selector-ui::after {
        content: "";
        position: absolute;
        left: 12px;
        right: 12px;
        top: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(253, 9, 9, 0.493), transparent);
        pointer-events: none;
      }

      @keyframes serverSelectorShine {
        to { transform: translateX(120%); }
      }

      .server-selector-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
        position: relative;
        z-index: 1;
      }

      .server-selector-title {
        color: #ffd700;
        font-size: 14px;
        font-weight: 800;
        letter-spacing: .4px;
        text-transform: uppercase;
        text-shadow:
          0 0 6px rgba(255, 215, 0, 0.35),
          0 0 12px rgba(255, 200, 50, 0.18);
      }

      .server-selector-badge {
        flex: 0 0 auto;
        padding: 6px 11px;
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(132, 16, 16, 0.58), rgba(104, 10, 10, 0.72));
        border: 1px solid rgba(235, 58, 58, 0.48);
        color: #ffd700;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow:
          0 0 10px rgba(189, 26, 26, 0.336),
          0 0 0 1px rgba(110, 1, 1, 0.555) inset;
        text-shadow:
          0 0 6px rgba(255, 215, 0, 0.35),
          0 0 10px rgba(255, 200, 50, 0.18);
      }

      .server-selector-field {
        position: relative;
        z-index: 1;
      }

      .server-selector-select {
        width: 100%;
        height: 46px;
        padding: 0 42px 0 14px;
        border-radius: 14px;
        border: 1px solid rgba(230, 60, 60, 0.48);
        outline: none;
        background: linear-gradient(180deg, rgba(90, 5, 5, 0.94), rgba(88, 5, 5, 0.98));
        color: #ffd700;
        font-size: 13px;
        font-weight: 700;
        box-shadow:
          0 0 0 1px rgb(134, 0, 0) inset,
          0 6px 14px rgba(141, 1, 1, 0.644);
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
        transition: .25s ease;
        text-shadow:
          0 0 4px rgba(255, 215, 0, 0.25);
      }

      .server-selector-select:focus {
        border-color: rgba(145, 0, 0, 0.88);
        box-shadow:
          0 0 0 3px rgba(215, 44, 44, 0.288),
          0 0 12px rgba(196, 27, 27, 0.329);
      }

      .server-selector-select option {
        color: #6b4b00;
        background: #fff3c4;
      }

      .server-selector-arrow {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #ffd700;
        font-size: 15px;
        line-height: 1;
        pointer-events: none;
        text-shadow:
          0 0 6px rgba(255, 215, 0, 0.35),
          0 0 10px rgba(255, 200, 50, 0.18);
      }

      .server-terminal-inline {
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: linear-gradient(180deg, rgba(95, 3, 3, 0.95), rgba(104, 2, 2, 0.98));
        border: 1px solid rgba(210, 56, 56, 0.3);
        box-shadow:
          0 0 0 1px rgba(100, 1, 1, 0.747) inset,
          0 6px 14px rgba(116, 0, 0, 0.637);
        display: none;
        position: relative;
        z-index: 1;
      }

      .server-terminal-inline.show {
        display: block;
      }

      .server-terminal-inline-box {
        color: #ffd700;
        font-family: Consolas, Monaco, monospace;
        font-size: 12px;
        line-height: 1.7;
        white-space: pre-wrap;
        text-shadow:
          0 0 6px rgba(255, 215, 0, 0.30),
          0 0 10px rgba(255, 200, 50, 0.15);
      }

      .server-terminal-inline-box div {
        opacity: .96;
      }

      .server-status {
        margin-top: 12px;
        padding: 12px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(180deg, rgba(87, 1, 1, 0.94), rgba(83, 1, 1, 0.97));
        border: 1px solid rgba(210, 56, 56, 0.28);
        box-shadow: 0 0 0 1px rgba(122, 0, 0, 0.411) inset;
        position: relative;
        z-index: 1;
      }

      .server-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex: 0 0 10px;
        background: #946d6d;
        transition: .25s ease;
      }

      .server-dot.active {
        background: #ff0000;
        box-shadow:
          0 0 8px rgba(255, 45, 45, 0.65),
          0 0 14px rgba(255, 45, 45, 0.308);
      }

      .server-dot.pending {
        background: #ff7f7f;
        box-shadow:
          0 0 8px rgba(255, 127, 127, 0.45),
          0 0 14px rgba(250, 121, 121, 0.233);
        animation: serverPulse 1s infinite ease-in-out;
      }

      @keyframes serverPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: .7; }
      }

      .server-status-text {
        color: #ffd76a;
        font-size: 12.5px;
        line-height: 1.45;
        text-shadow:
          0 0 5px rgba(255, 215, 0, 0.20);
      }

      .server-status-text strong {
        color: #ffe9a8;
        font-weight: 700;
        text-shadow:
          0 0 6px rgba(255, 215, 0, 0.28);
      }
    `;
    document.head.appendChild(style);
  }

  let isConnecting = false;
  let activeConnectionToken = 0;

  function getSavedServer() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setSavedServer(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function removeSavedServer() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function findTarget() {
    for (var i = 0; i < TARGET_SELECTORS.length; i++) {
      var el = document.querySelector(TARGET_SELECTORS[i]);
      if (el) return el;
    }
    return document.body;
  }

  function getServerLabel(value) {
    for (var i = 0; i < ALLOWED_SERVERS.length; i++) {
      if (ALLOWED_SERVERS[i].value === value) return ALLOWED_SERVERS[i].label;
    }
    return "";
  }

  function setPendingState(label) {
    var dot = document.getElementById("serverDot");
    var statusText = document.getElementById("serverStatusText");

    if (!dot || !statusText) return;

    dot.classList.remove("active");
    dot.classList.add("pending");
    statusText.innerHTML = 'Menghubungkan ke <strong>' + label + '</strong>...';
  }

  function setConnectedState(label) {
    var dot = document.getElementById("serverDot");
    var statusText = document.getElementById("serverStatusText");

    if (!dot || !statusText) return;

    dot.classList.remove("pending");
    dot.classList.add("active");
    statusText.innerHTML = 'Terhubung ke <strong>' + label + '</strong>. Selamat bermain di ' + BRAND_NAME + '!';
  }

  function setDisconnectedState() {
    var dot = document.getElementById("serverDot");
    var statusText = document.getElementById("serverStatusText");
    var select = document.getElementById("serverDropdown");

    if (dot) {
      dot.classList.remove("active");
      dot.classList.remove("pending");
    }

    if (statusText) {
      statusText.textContent = "Status: Belum terhubung ke server";
    }

    if (select) {
      select.value = "";
    }
  }

  function updateUIState() {
    if (isConnecting) return;

    var savedValue = getSavedServer();
    var savedLabel = getServerLabel(savedValue);
    var select = document.getElementById("serverDropdown");

    if (select) {
      select.value = savedValue || "";
    }

    if (savedValue && savedLabel) {
      setConnectedState(savedLabel);
    } else {
      setDisconnectedState();
    }
  }

  function clearTerminal() {
    var terminalWrap = document.getElementById("serverTerminalInline");
    var terminalBox = document.getElementById("serverTerminalInlineBox");
    if (terminalWrap) terminalWrap.classList.remove("show");
    if (terminalBox) terminalBox.innerHTML = "";
  }

  function showTerminalSequence(lines, onComplete, token) {
    var terminalWrap = document.getElementById("serverTerminalInline");
    var terminalBox = document.getElementById("serverTerminalInlineBox");

    if (!terminalWrap || !terminalBox) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    terminalBox.innerHTML = "";
    terminalWrap.classList.add("show");

    var lineIndex = 0;

    function typeLine(text, done) {
      if (token !== activeConnectionToken) return;

      var i = 0;
      var line = document.createElement("div");
      terminalBox.appendChild(line);

      function tick() {
        if (token !== activeConnectionToken) return;
        if (i < text.length) {
          line.textContent += text.charAt(i++);
          setTimeout(tick, 14);
        } else {
          setTimeout(done, 170);
        }
      }

      tick();
    }

    function next() {
      if (token !== activeConnectionToken) return;

      if (lineIndex < lines.length) {
        typeLine(lines[lineIndex++], next);
      } else {
        setTimeout(function () {
          if (token !== activeConnectionToken) return;
          terminalWrap.classList.remove("show");
          terminalBox.innerHTML = "";
          if (typeof onComplete === "function") onComplete();
        }, 700);
      }
    }

    next();
  }

  function createUI() {
    var existing = document.getElementById("server-selector-ui");
    if (existing) return existing;

    var savedValue = getSavedServer();
    var savedLabel = getServerLabel(savedValue);
    var connected = !!savedValue && !!savedLabel;

    var wrap = document.createElement("div");
    wrap.className = "server-selector-ui";
    wrap.id = "server-selector-ui";

    wrap.innerHTML = `
      <div class="server-selector-head">
        <div class="server-selector-title">Pilih Server Gacor</div>
        <div class="server-selector-badge">${BRAND_NAME}</div>
      </div>

      <div class="server-selector-field">
        <select class="server-selector-select" id="serverDropdown">
          <option value="">Pilih Server</option>
          ${ALLOWED_SERVERS.map(function (item) {
            return '<option value="' + item.value + '"' + (item.value === savedValue ? " selected" : "") + '>' + item.label + '</option>';
          }).join("")}
        </select>
        <span class="server-selector-arrow">▼</span>
      </div>

      <div class="server-terminal-inline" id="serverTerminalInline">
        <div class="server-terminal-inline-box" id="serverTerminalInlineBox"></div>
      </div>

      <div class="server-status">
        <span class="server-dot ${connected ? "active" : ""}" id="serverDot"></span>
        <div class="server-status-text" id="serverStatusText">
          ${connected
            ? 'Terhubung ke <strong>' + savedLabel + '</strong>. Selamat bermain di ' + BRAND_NAME + '!'
            : 'Status: Belum terhubung ke server'}
        </div>
      </div>
    `;

    var select = wrap.querySelector("#serverDropdown");

    select.addEventListener("change", function () {
      var value = this.value;
      var label = getServerLabel(value);

      activeConnectionToken++;

      if (value && label) {
        isConnecting = true;
        setPendingState(label);

        var currentToken = activeConnectionToken;

        showTerminalSequence([
          "> Initializing: " + label,
          "> Validating routing credentials...",
          "> Gateway response accepted",
          "> Establishing encrypted tunnel...",
          "> Syncing session parameters...",
          "> Connection SUCCESS — Welcome to " + BRAND_NAME
        ], function () {
          if (currentToken !== activeConnectionToken) return;
          setSavedServer(value);
          isConnecting = false;
          setConnectedState(label);
        }, currentToken);

      } else {
        isConnecting = false;
        removeSavedServer();
        clearTerminal();
        setDisconnectedState();
      }
    });

    return wrap;
  }

  function mountUI() {
    injectStyle();

    var target = findTarget();
    var ui = createUI();

    if (!target || !ui) return false;

    if (target === document.body) {
      if (!ui.parentNode) {
        document.body.insertAdjacentElement("afterbegin", ui);
      }
    } else {
      if (!ui.parentNode) {
        target.insertAdjacentElement(INSERT_POSITION, ui);
      }
    }

    updateUIState();
    return true;
  }

  function init() {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;

    var attempts = 0;
    var timer = setInterval(function () {
      attempts++;
      var mounted = mountUI();

      if (mounted || attempts >= MAX_ATTEMPTS) {
        clearInterval(timer);
      }
    }, DELAY_MS);

    window.addEventListener("storage", updateUIState);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
