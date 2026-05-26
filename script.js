/* ============================================================
   QURBANI FOR ALLAH — script.js
   Tahsin Jawad
   ============================================================ */

const STORE_KEY = "qurbaniForAllahV2";

const defaultState = {
  theme: "dark",
  expenses: {
    animal: 0,
    butcher: 0,
    transport: 0,
    other: 0,
    shareholderCount: 1,
    names: []
  },
  recipients: [
    { id: uid(), name: "Mother's home", group: "Family", share: 1, status: "Completed" },
    { id: uid(), name: "Neighbour block A", group: "Neighbours", share: 0.75, status: "Partially Delivered" },
    { id: uid(), name: "Local needy families", group: "Needy People", share: 2, status: "Pending" }
  ],
  activities: ["Dashboard prepared", "Default recipient plan added"],
  greetingHidden: false
};

const masail = [
  {
    icon: "⭐",
    title: "কার উপর কুরবানি ওয়াজিব",
    lines: [
      "প্রাপ্তবয়স্ক, মুসলিম ও সুস্থ মস্তিষ্কের ব্যক্তির উপর কুরবানি ওয়াজিব",
      "১০ জিলহজ ফজর থেকে ১২ জিলহজ সূর্যাস্ত পর্যন্ত সময়ের মধ্যে নিসাব পরিমাণ সম্পদের মালিক হলে কুরবানি ওয়াজিব",
      "নিসাব = প্রয়োজনের অতিরিক্ত সম্পদ (প্রায় ৫২.৫ তোলা রূপার সমমূল্য)"
    ]
  },
  {
    icon: "🐄",
    title: "কোন পশু দিয়ে কুরবানি করা যাবে",
    lines: [
      "গরু, ছাগল, ভেড়া, উট ও মহিষ দ্বারা কুরবানি জায়েজ",
      "হরিণ বা বন্য পশু দ্বারা কুরবানি হবে না"
    ]
  },
  {
    icon: "📏",
    title: "পশুর বয়স শর্ত",
    lines: [
      "উট: কমপক্ষে ৫ বছর",
      "গরু/মহিষ: কমপক্ষে ২ বছর",
      "ছাগল/ভেড়া: কমপক্ষে ১ বছর",
      "ভেড়া হৃষ্টপুষ্ট হলে ৬ মাস হলেও চলবে"
    ]
  },
  {
    icon: "🩺",
    title: "দুর্বল বা অসুস্থ পশু",
    lines: [
      "খুব দুর্বল বা হাঁটতে না পারা পশু দ্বারা কুরবানি হবে না"
    ]
  },
  {
    icon: "🦷",
    title: "দাঁত নেই এমন পশু",
    lines: [
      "ঘাস চিবিয়ে খেতে পারলে কুরবানি জায়েজ",
      "না পারলে কুরবানি হবে না"
    ]
  },
  {
    icon: "🐐",
    title: "শিং, কান বা লেজ কাটা পশু",
    lines: [
      "অর্ধেক বা তার বেশি কাটা হলে কুরবানি হবে না",
      "অর্ধেকের কম হলে জায়েজ",
      "জন্মগতভাবে ছোট কান হলে সমস্যা নেই"
    ]
  },
  {
    icon: "👥",
    title: "ভাগ (Share) নিয়ম",
    lines: [
      "গরু/উট/মহিষে সর্বোচ্চ ৭ জন শরীক হতে পারে",
      "১ থেকে ৭ পর্যন্ত যেকোনো ভাগ করা যায়",
      "সমান ভাগ হওয়া জরুরি নয়"
    ]
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "আকীকার অংশ কুরবানিতে",
    lines: [
      "কুরবানির পশুতে আকীকা করা জায়েজ",
      "একই পশুতে কুরবানি ও আকীকা সহীহ"
    ]
  },
  {
    icon: "💰",
    title: "হারাম উপার্জন সংক্রান্ত",
    lines: [
      "শরীকদের অধিকাংশ টাকা হারাম হলে কুরবানি সহীহ হবে না"
    ]
  },
  {
    icon: "🐄",
    title: "একা পশু কিনে পরে শরীক করা",
    lines: [
      "ধনী ব্যক্তি চাইলে পরে অন্যকে শরীক করতে পারে",
      "তবে একা কুরবানি করা উত্তম"
    ]
  },
  {
    icon: "⚰️",
    title: "মৃত ব্যক্তির পক্ষ থেকে কুরবানি",
    lines: [
      "জায়েজ",
      "ওসিয়ত না থাকলে নফল",
      "ওসিয়ত থাকলে গোশত সদকা করতে হবে"
    ]
  },
  {
    icon: "🕌",
    title: "কুরবানির অংশ বিক্রি করা",
    lines: [
      "কুরবানির কোনো অংশ বিক্রি করা জায়েজ নয়",
      "বিক্রি করলে মূল্য সদকা করতে হবে"
    ]
  },
  {
    icon: "👨‍🍳",
    title: "জবাইকারীর পারিশ্রমিক",
    lines: [
      "পারিশ্রমিক দেওয়া জায়েজ",
      "কিন্তু গোশত পারিশ্রমিক হিসেবে দেওয়া যাবে না"
    ]
  },
  {
    icon: "🌍",
    title: "বিদেশে অবস্থান করলে কুরবানি",
    lines: [
      "যেকোনো দেশে কুরবানি করা জায়েজ",
      "পশু যেখানে আছে সেখানে ঈদের নামাজ হয়ে গেলে কুরবানি করা যাবে"
    ]
  },
  {
    icon: "🧠",
    title: "সাধারণ ভুল ধারণা",
    lines: [
      "কম বয়সের পশু কুরবানি করা",
      "অসুস্থ পশু কেনা",
      "কুরবানির অংশ বিক্রি করা",
      "যেকোনো পশু দিয়ে কুরবানি হবে মনে করা"
    ]
  }
];

const fmtCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

/* ── State ─────────────────────────────────── */
let state = loadState();

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) return { ...structuredClone(defaultState), ...JSON.parse(saved) };
  } catch {}
  return structuredClone(defaultState);
}

function saveState(activity) {
  if (activity) {
    state.activities = [activity, ...state.activities].slice(0, 8);
  }
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {}
  renderAll();
}

/* ── Init ──────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initCanvas();
  renderMasail();
  hydrateForm();
  bindEvents();
  renderAll();
  setupReveal();
  setupActiveNav();
  updateCountdown();
  setInterval(updateCountdown, 30_000);

  // Add SVG gradient for ring
  const svgNS = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(svgNS, "defs");
  const grad = document.createElementNS(svgNS, "linearGradient");
  grad.setAttribute("id", "ringGrad");
  grad.setAttribute("x1", "0%"); grad.setAttribute("y1", "0%");
  grad.setAttribute("x2", "100%"); grad.setAttribute("y2", "0%");
  const s1 = document.createElementNS(svgNS, "stop");
  s1.setAttribute("offset", "0%"); s1.setAttribute("stop-color", "#26ad77");
  const s2 = document.createElementNS(svgNS, "stop");
  s2.setAttribute("offset", "100%"); s2.setAttribute("stop-color", "#c9a84c");
  grad.appendChild(s1); grad.appendChild(s2);
  defs.appendChild(grad);
  const ringSvg = document.getElementById("progressRingSvg");
  if (ringSvg) ringSvg.insertBefore(defs, ringSvg.firstChild);

  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 750);
});

/* ── Canvas background ─────────────────────── */
function initCanvas() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .14,
      alpha: Math.random() * .35 + .08
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = !document.body.classList.contains("light");

    // Radial glow top-left (gold)
    const g1 = ctx.createRadialGradient(W * .12, H * .06, 0, W * .12, H * .06, W * .38);
    g1.addColorStop(0, isDark ? "rgba(201,168,76,.12)" : "rgba(201,168,76,.07)");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    // Radial glow bottom-right (emerald)
    const g2 = ctx.createRadialGradient(W * .88, H * .82, 0, W * .88, H * .82, W * .35);
    g2.addColorStop(0, isDark ? "rgba(26,122,86,.1)" : "rgba(26,122,86,.06)");
    g2.addColorStop(1, "transparent");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    // Particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(201,168,76,${p.alpha})`
        : `rgba(26,122,86,${p.alpha * .6})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => { resize(); createParticles(); });
}

/* ── Events ────────────────────────────────── */
function bindEvents() {
  // Theme
  document.getElementById("themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState("Theme updated");
  });

  // Menu
  document.getElementById("menuToggle").addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });
  document.querySelectorAll(".nav-link").forEach(l =>
    l.addEventListener("click", () => document.body.classList.remove("menu-open"))
  );

  // Greeting
  document.getElementById("dismissGreeting").addEventListener("click", () => {
    state.greetingHidden = true;
    const card = document.getElementById("greetingCard");
    card.style.opacity = "0";
    card.style.transform = "translateY(-8px)";
    card.style.transition = ".3s ease";
    setTimeout(() => card.style.display = "none", 300);
    saveState("Greeting dismissed");
  });

  // Expenses form
  document.getElementById("expenseForm").addEventListener("submit", e => {
    e.preventDefault();
    state.expenses = {
      animal:           readNum("animalCost"),
      butcher:          readNum("butcherCost"),
      transport:        readNum("transportCost"),
      other:            readNum("otherCost"),
      shareholderCount: Math.max(1, Math.round(readNum("shareholderCount") || 1)),
      names: document.getElementById("shareholderNames").value
        .split("\n").map(n => n.trim()).filter(Boolean)
    };
    saveState("Expenses saved");
    toast("✓ Expenses saved with live calculations.");
  });

  document.getElementById("resetExpenses").addEventListener("click", () => {
    state.expenses = structuredClone(defaultState.expenses);
    hydrateForm();
    saveState("Expenses reset");
    toast("Expense tracker has been reset.");
  });

  // Live expense calculation
  ["animalCost","butcherCost","transportCost","otherCost","shareholderCount"].forEach(id => {
    document.getElementById(id).addEventListener("input", liveCalc);
  });

  // Recipients form
  document.getElementById("recipientForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("recipientName").value.trim();
    if (!name) { toast("Please enter a recipient name."); return; }
    state.recipients.unshift({
      id: uid(),
      name,
      group: document.getElementById("recipientGroup").value,
      share: readNum("recipientShare") || 1,
      status: document.getElementById("recipientStatus").value
    });
    e.target.reset();
    saveState("Recipient added");
    toast("✓ Recipient added to distribution board.");
  });

  document.getElementById("recipientSearch").addEventListener("input", renderRecipients);
  document.getElementById("statusFilter").addEventListener("change", renderRecipients);

  document.getElementById("exportData").addEventListener("click", exportData);
  document.getElementById("importData").addEventListener("change", importData);
}

function liveCalc() {
  const animal    = readNum("animalCost");
  const butcher   = readNum("butcherCost");
  const transport = readNum("transportCost");
  const other     = readNum("otherCost");
  const count     = Math.max(1, Math.round(readNum("shareholderCount") || 1));
  const total = animal + butcher + transport + other;
  const per = total / count;
  document.querySelectorAll("[data-dashboard='total']").forEach(el => el.textContent = fmtCurrency.format(total));
  document.querySelectorAll("[data-dashboard='perShare']").forEach(el => el.textContent = fmtCurrency.format(per));
}

/* ── Form hydration ────────────────────────── */
function hydrateForm() {
  document.getElementById("animalCost").value    = state.expenses.animal    || "";
  document.getElementById("butcherCost").value   = state.expenses.butcher   || "";
  document.getElementById("transportCost").value = state.expenses.transport || "";
  document.getElementById("otherCost").value     = state.expenses.other     || "";
  document.getElementById("shareholderCount").value = state.expenses.shareholderCount || 1;
  document.getElementById("shareholderNames").value = state.expenses.names.join("\n");
}

/* ── Render all ────────────────────────────── */
function renderAll() {
  // Theme
  document.body.classList.toggle("light", state.theme === "light");
  const icon = document.getElementById("themeIcon");
  if (icon) icon.textContent = state.theme === "dark" ? "◐" : "●";

  renderDashboard();
  renderChart();
  renderShareholders();
  renderRecipients();
  renderActivities();
}

function renderDashboard() {
  const total     = getTotal();
  const count     = Math.max(1, state.expenses.shareholderCount || state.expenses.names.length || 1);
  const perShare  = total / count;
  const pending   = state.recipients.filter(r => r.status !== "Completed").length;
  const completed = state.recipients.filter(r => r.status === "Completed").length;
  const progress  = state.recipients.length
    ? Math.round((completed / state.recipients.length) * 100)
    : 0;

  setAll("total",        fmtCurrency.format(total));
  setAll("perShare",     fmtCurrency.format(perShare));
  setAll("shareholders", count);
  setAll("pending",      pending);
  setAll("completed",    completed);
  setAll("progress",     `${progress}%`);

  // SVG ring
  const fill = document.getElementById("ringFill");
  if (fill) {
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (progress / 100) * circumference;
    fill.style.strokeDasharray  = circumference;
    fill.style.strokeDashoffset = offset;
  }
}

function renderChart() {
  const chart = document.getElementById("expenseChart");
  if (!chart) return;
  const rows = [
    ["Animal",    state.expenses.animal],
    ["Butcher",   state.expenses.butcher],
    ["Transport", state.expenses.transport],
    ["Other",     state.expenses.other]
  ];
  const max = Math.max(1, ...rows.map(([, v]) => v));
  chart.innerHTML = rows.map(([label, val]) => `
    <div class="bar-row">
      <span>${label}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width:${(val / max) * 100}%"></div>
      </div>
      <strong>${fmtCurrency.format(val)}</strong>
    </div>
  `).join("");
}

function renderShareholders() {
  const list = document.getElementById("shareholdersList");
  if (!list) return;
  const names = state.expenses.names.length
    ? state.expenses.names
    : Array.from({ length: state.expenses.shareholderCount || 0 }, (_, i) => `Shareholder ${i + 1}`);
  list.innerHTML = names.map(n => `<span class="share-pill">${escHtml(n)}</span>`).join("");
}

function renderRecipients() {
  const list   = document.getElementById("recipientList");
  if (!list) return;
  const search = document.getElementById("recipientSearch").value.toLowerCase();
  const filter = document.getElementById("statusFilter").value;
  const items  = state.recipients.filter(r => {
    const matchSearch = `${r.name} ${r.group}`.toLowerCase().includes(search);
    const matchFilter = filter === "All" || r.status === filter;
    return matchSearch && matchFilter;
  });

  if (!items.length) {
    list.innerHTML = `<div class="recipient-card" style="justify-content:center">
      <p style="color:var(--text-muted);font-size:.85rem">No recipients match this view.</p>
    </div>`;
    return;
  }

  list.innerHTML = items.map(r => {
    const statusClass = r.status.split(" ")[0];
    return `
      <div class="recipient-card">
        <div class="rc-info">
          <h4>${escHtml(r.name)}</h4>
          <p>${escHtml(r.group)} · ${r.share} share</p>
          <span class="status-badge ${statusClass}">${statusEmoji(r.status)} ${r.status}</span>
        </div>
        <div class="rc-actions">
          <button class="mini-btn" data-action="status" data-id="${r.id}" type="button">Update</button>
          <button class="mini-btn delete" data-action="delete" data-id="${r.id}" type="button">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  list.querySelectorAll(".mini-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const { id, action } = btn.dataset;
      if (action === "delete") {
        state.recipients = state.recipients.filter(r => r.id !== id);
        saveState("Recipient removed");
        toast("Recipient removed.");
        return;
      }
      const r = state.recipients.find(r => r.id === id);
      if (!r) return;
      const cycle = ["Pending", "Partially Delivered", "Completed"];
      r.status = cycle[(cycle.indexOf(r.status) + 1) % cycle.length];
      saveState("Delivery status updated");
      toast(`Status updated to: ${r.status}`);
    });
  });
}

function renderActivities() {
  const list  = document.getElementById("activityList");
  const count = document.getElementById("activityCount");
  if (!list) return;
  list.innerHTML = state.activities
    .map(a => `<li>${escHtml(a)}</li>`)
    .join("");
  if (count) count.textContent = state.activities.length;
}

function renderMasail() {
  const acc = document.getElementById("masailAccordion");
  if (!acc) return;
  acc.innerHTML = masail.map((item, i) => `
    <article class="accordion-item ${i === 0 ? "open" : ""}">
      <button class="accordion-trigger" type="button" aria-expanded="${i === 0}">
        <div class="accordion-trigger-inner">
          <span class="acc-icon">${item.icon}</span>
          <span>${escHtml(item.title)}</span>
        </div>
        <span class="acc-chevron">+</span>
      </button>
      <div class="accordion-content">
        <div class="accordion-body bangla">
          ${item.lines.map(l => `<p>${escHtml(l)}</p>`).join("")}
        </div>
      </div>
    </article>
  `).join("");

  acc.querySelectorAll(".accordion-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion-item");
      item.classList.toggle("open");
      btn.setAttribute("aria-expanded", item.classList.contains("open"));
    });
  });
}

/* ── Intersection reveal ───────────────────── */
function setupReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.style.getPropertyValue("--delay") || "0");
        setTimeout(() => el.classList.add("visible"), delay * 1000);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

/* ── Active nav ────────────────────────────── */
function setupActiveNav() {
  const sections = document.querySelectorAll(".section");
  const links    = document.querySelectorAll(".nav-link");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle("active", l.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => obs.observe(s));
}

/* ── Countdown ─────────────────────────────── */
function updateCountdown() {
  const target = new Date("2026-05-28T07:00:00+06:00");
  const now    = new Date();
  const diff   = target - now;
  const el     = document.getElementById("eidCountdown");
  if (!el) return;
  if (diff <= 0) {
    el.textContent = "Eid season is here ☾";
    return;
  }
  const d  = Math.floor(diff / 86400000);
  const h  = Math.floor((diff % 86400000) / 3600000);
  const m  = Math.floor((diff % 3600000) / 60000);
  el.textContent = `${d}d ${h}h ${m}m`;
}

/* ── Export / Import ───────────────────────── */
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), {
    href: url,
    download: "qurbani-for-allah-backup.json"
  });
  a.click();
  URL.revokeObjectURL(url);
  saveState("Backup exported");
  toast("✓ JSON backup exported.");
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = { ...structuredClone(defaultState), ...JSON.parse(reader.result) };
      hydrateForm();
      saveState("Backup imported");
      toast("✓ Backup imported successfully.");
    } catch {
      toast("Could not import this backup file.");
    }
  };
  reader.readAsText(file);
}

/* ── Helpers ───────────────────────────────── */
function getTotal() {
  return state.expenses.animal + state.expenses.butcher
       + state.expenses.transport + state.expenses.other;
}

function readNum(id) {
  return Number(document.getElementById(id)?.value) || 0;
}

function setAll(key, value) {
  document.querySelectorAll(`[data-dashboard="${key}"]`).forEach(el => {
    el.textContent = value;
  });
}

function statusEmoji(status) {
  return { "Pending": "🔴", "Partially Delivered": "🟡", "Completed": "🟢" }[status] || "";
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
