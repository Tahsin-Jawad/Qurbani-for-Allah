const storeKey = "qurbaniForAllahState";

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
    { id: crypto.randomUUID(), name: "Mother's home", group: "Family", share: 1, status: "Completed" },
    { id: crypto.randomUUID(), name: "Neighbour block A", group: "Neighbours", share: 0.75, status: "Partially Delivered" },
    { id: crypto.randomUUID(), name: "Local needy families", group: "Needy People", share: 2, status: "Pending" }
  ],
  activities: ["Dashboard prepared", "Default recipient plan added"],
  greetingHidden: false
};

let state = loadState();

const masail = [
  {
    icon: "⭐",
    title: "কার উপর কুরবানি ওয়াজিব",
    lines: [
      "প্রাপ্তবয়স্ক, মুসলিম ও সুস্থ মস্তিষ্কের ব্যক্তির উপর কুরবানি ওয়াজিব",
      "১০ জিলহজ ফজর থেকে ১২ জিলহজ সূর্যাস্ত পর্যন্ত সময়ের মধ্যে নিসাব পরিমাণ সম্পদের মালিক হলে কুরবানি ওয়াজিব",
      "নিসাব = প্রয়োজনের অতিরিক্ত সম্পদ (প্রায় ৫২.৫ তোলা রূপার সমমূল্য)"
    ]
  },
  {
    icon: "🐄",
    title: "কোন পশু দিয়ে কুরবানি করা যাবে",
    lines: [
      "গরু, ছাগল, ভেড়া, উট ও মহিষ দ্বারা কুরবানি জায়েজ",
      "হরিণ বা বন্য পশু দ্বারা কুরবানি হবে না"
    ]
  },
  {
    icon: "📏",
    title: "পশুর বয়স শর্ত",
    lines: [
      "উট: কমপক্ষে ৫ বছর",
      "গরু/মহিষ: কমপক্ষে ২ বছর",
      "ছাগল/ভেড়া: কমপক্ষে ১ বছর",
      "ভেড়া হৃষ্টপুষ্ট হলে ৬ মাস হলেও চলবে"
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
      "ঘাস চিবিয়ে খেতে পারলে কুরবানি জায়েজ",
      "না পারলে কুরবানি হবে না"
    ]
  },
  {
    icon: "🐐",
    title: "শিং, কান বা লেজ কাটা পশু",
    lines: [
      "অর্ধেক বা তার বেশি কাটা হলে কুরবানি হবে না",
      "অর্ধেকের কম হলে জায়েজ",
      "জন্মগতভাবে ছোট কান হলে সমস্যা নেই"
    ]
  },
  {
    icon: "👥",
    title: "ভাগ (Share) নিয়ম",
    lines: [
      "গরু/উট/মহিষে সর্বোচ্চ ৭ জন শরীক হতে পারে",
      "১ থেকে ৭ পর্যন্ত যেকোনো ভাগ করা যায়",
      "সমান ভাগ হওয়া জরুরি নয়"
    ]
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "আকীকার অংশ কুরবানিতে",
    lines: [
      "কুরবানির পশুতে আকীকা করা জায়েজ",
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
      "জায়েজ",
      "ওসিয়ত না থাকলে নফল",
      "ওসিয়ত থাকলে গোশত সদকা করতে হবে"
    ]
  },
  {
    icon: "🕌",
    title: "কুরবানির অংশ বিক্রি করা",
    lines: [
      "কুরবানির কোনো অংশ বিক্রি করা জায়েজ নয়",
      "বিক্রি করলে মূল্য সদকা করতে হবে"
    ]
  },
  {
    icon: "👨‍🍳",
    title: "জবাইকারীর পারিশ্রমিক",
    lines: [
      "পারিশ্রমিক দেওয়া জায়েজ",
      "কিন্তু গোশত পারিশ্রমিক হিসেবে দেওয়া যাবে না"
    ]
  },
  {
    icon: "🌍",
    title: "বিদেশে অবস্থান করলে কুরবানি",
    lines: [
      "যেকোনো দেশে কুরবানি করা জায়েজ",
      "পশু যেখানে আছে সেখানে ঈদের নামাজ হয়ে গেলে কুরবানি করা যাবে"
    ]
  },
  {
    icon: "🧠",
    title: "সাধারণ ভুল ধারণা",
    lines: [
      "কম বয়সের পশু কুরবানি করা",
      "অসুস্থ পশু কেনা",
      "কুরবানির অংশ বিক্রি করা",
      "যেকোনো পশু দিয়ে কুরবানি হবে মনে করা"
    ]
  }
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

document.addEventListener("DOMContentLoaded", () => {
  hydrateForm();
  bindEvents();
  renderMasail();
  renderAll();
  setupReveal();
  updateCountdown();
  setInterval(updateCountdown, 60_000);
  setTimeout(() => document.getElementById("loader").classList.add("hidden"), 650);
});

function loadState() {
  const saved = localStorage.getItem(storeKey);
  if (!saved) return structuredClone(defaultState);
  try {
    return { ...structuredClone(defaultState), ...JSON.parse(saved) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState(activity) {
  if (activity) {
    state.activities = [activity, ...state.activities].slice(0, 6);
  }
  localStorage.setItem(storeKey, JSON.stringify(state));
  renderAll();
}

function bindEvents() {
  document.getElementById("themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState("Theme updated");
  });

  document.getElementById("menuToggle").addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => document.body.classList.remove("menu-open"));
  });

  document.getElementById("dismissGreeting").addEventListener("click", () => {
    state.greetingHidden = true;
    saveState("Greeting dismissed");
  });

  document.getElementById("expenseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.expenses = {
      animal: readNumber("animalCost"),
      butcher: readNumber("butcherCost"),
      transport: readNumber("transportCost"),
      other: readNumber("otherCost"),
      shareholderCount: Math.max(1, Math.round(readNumber("shareholderCount") || 1)),
      names: document.getElementById("shareholderNames").value
        .split("\n")
        .map((name) => name.trim())
        .filter(Boolean)
    };
    saveState("Expenses saved");
    toast("Expenses saved with live calculations.");
  });

  document.getElementById("resetExpenses").addEventListener("click", () => {
    state.expenses = structuredClone(defaultState.expenses);
    hydrateForm();
    saveState("Expenses reset");
    toast("Expense tracker reset.");
  });

  document.getElementById("recipientForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("recipientName").value.trim();
    if (!name) {
      toast("Add a recipient name first.");
      return;
    }
    state.recipients.unshift({
      id: crypto.randomUUID(),
      name,
      group: document.getElementById("recipientGroup").value,
      share: readNumber("recipientShare") || 1,
      status: document.getElementById("recipientStatus").value
    });
    event.target.reset();
    saveState("Recipient added");
    toast("Recipient added to distribution board.");
  });

  document.getElementById("recipientSearch").addEventListener("input", renderRecipients);
  document.getElementById("statusFilter").addEventListener("change", renderRecipients);

  document.getElementById("exportData").addEventListener("click", exportData);
  document.getElementById("importData").addEventListener("change", importData);
}

function hydrateForm() {
  document.getElementById("animalCost").value = state.expenses.animal || "";
  document.getElementById("butcherCost").value = state.expenses.butcher || "";
  document.getElementById("transportCost").value = state.expenses.transport || "";
  document.getElementById("otherCost").value = state.expenses.other || "";
  document.getElementById("shareholderCount").value = state.expenses.shareholderCount || 1;
  document.getElementById("shareholderNames").value = state.expenses.names.join("\n");
}

function renderAll() {
  document.body.classList.toggle("light", state.theme === "light");
  document.getElementById("themeToggle").textContent = state.theme === "dark" ? "◐" : "●";
  document.querySelector(".greeting-card").style.display = state.greetingHidden ? "none" : "flex";
  renderDashboard();
  renderChart();
  renderShareholders();
  renderRecipients();
  renderActivities();
}

function renderDashboard() {
  const total = getTotal();
  const perShare = total / Math.max(1, state.expenses.shareholderCount || state.expenses.names.length || 1);
  const pending = state.recipients.filter((item) => item.status !== "Completed").length;
  const completed = state.recipients.filter((item) => item.status === "Completed").length;
  const progress = state.recipients.length ? Math.round((completed / state.recipients.length) * 100) : 0;

  setText("total", currency.format(total));
  setText("perShare", currency.format(perShare));
  setText("shareholders", state.expenses.shareholderCount || state.expenses.names.length || 0);
  setText("pending", pending);
  setText("completed", completed);
  setText("progress", `${progress}%`);
  document.getElementById("progressRing").style.setProperty("--progress", progress);
}

function renderChart() {
  const chart = document.getElementById("expenseChart");
  const values = [
    ["Animal", state.expenses.animal],
    ["Butcher", state.expenses.butcher],
    ["Transport", state.expenses.transport],
    ["Other", state.expenses.other]
  ];
  const max = Math.max(1, ...values.map(([, value]) => value));
  chart.innerHTML = values.map(([label, value]) => `
    <div class="bar-row">
      <span>${label}</span>
      <div class="bar-track"><div class="bar-fill" style="width: ${(value / max) * 100}%"></div></div>
      <strong>${currency.format(value)}</strong>
    </div>
  `).join("");
}

function renderShareholders() {
  const list = document.getElementById("shareholdersList");
  const names = state.expenses.names.length
    ? state.expenses.names
    : Array.from({ length: state.expenses.shareholderCount || 0 }, (_, index) => `Shareholder ${index + 1}`);
  list.innerHTML = names.map((name) => `<span class="share-pill">${escapeHtml(name)}</span>`).join("");
}

function renderRecipients() {
  const list = document.getElementById("recipientList");
  const search = document.getElementById("recipientSearch").value.toLowerCase();
  const filter = document.getElementById("statusFilter").value;
  const recipients = state.recipients.filter((item) => {
    const matchesSearch = `${item.name} ${item.group}`.toLowerCase().includes(search);
    const matchesFilter = filter === "All" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (!recipients.length) {
    list.innerHTML = `<div class="recipient-card"><p>No recipients match this view.</p></div>`;
    return;
  }

  list.innerHTML = recipients.map((item) => {
    const statusClass = item.status.split(" ")[0];
    return `
      <article class="recipient-card">
        <div>
          <h4>${escapeHtml(item.name)}</h4>
          <p>${item.group} · ${item.share} share</p>
          <span class="status ${statusClass}">${statusIcon(item.status)} ${item.status}</span>
        </div>
        <div class="card-actions">
          <button class="mini-btn" data-action="status" data-id="${item.id}" type="button">Update</button>
          <button class="mini-btn" data-action="delete" data-id="${item.id}" type="button">Remove</button>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      if (button.dataset.action === "delete") {
        state.recipients = state.recipients.filter((item) => item.id !== id);
        saveState("Recipient removed");
        toast("Recipient removed.");
        return;
      }
      const item = state.recipients.find((recipient) => recipient.id === id);
      const flow = ["Pending", "Partially Delivered", "Completed"];
      item.status = flow[(flow.indexOf(item.status) + 1) % flow.length];
      saveState("Delivery status updated");
      toast("Delivery status updated.");
    });
  });
}

function renderActivities() {
  const list = document.getElementById("activityList");
  list.innerHTML = state.activities.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderMasail() {
  const accordion = document.getElementById("masailAccordion");
  accordion.innerHTML = masail.map((item, index) => `
    <article class="accordion-item ${index === 0 ? "open" : ""}">
      <button class="accordion-trigger" type="button" aria-expanded="${index === 0}">
        <strong><span>${item.icon}</span> ${item.title}</strong>
        <span>+</span>
      </button>
      <div class="accordion-content">
        <div class="accordion-body">
          ${item.lines.map((line) => `<p>${line}</p>`).join("")}
        </div>
      </div>
    </article>
  `).join("");

  accordion.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      item.classList.toggle("open");
      trigger.setAttribute("aria-expanded", item.classList.contains("open"));
    });
  });
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "qurbani-for-allah-backup.json";
  link.click();
  URL.revokeObjectURL(url);
  saveState("Backup exported");
  toast("JSON backup exported.");
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = { ...structuredClone(defaultState), ...JSON.parse(reader.result) };
      hydrateForm();
      saveState("Backup imported");
      toast("Backup imported successfully.");
    } catch {
      toast("This backup file could not be imported.");
    }
  };
  reader.readAsText(file);
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

function updateCountdown() {
  const target = new Date("2026-05-27T07:00:00+06:00");
  const now = new Date();
  const diff = target - now;
  const countdown = document.getElementById("eidCountdown");
  if (diff <= 0) {
    countdown.textContent = "Eid season is here";
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  countdown.textContent = `${days}d ${hours}h ${minutes}m`;
}

function readNumber(id) {
  return Number(document.getElementById(id).value) || 0;
}

function getTotal() {
  return state.expenses.animal + state.expenses.butcher + state.expenses.transport + state.expenses.other;
}

function setText(key, value) {
  document.querySelectorAll(`[data-dashboard="${key}"]`).forEach((item) => {
    item.textContent = value;
  });
}

function statusIcon(status) {
  return {
    Pending: "🔴",
    "Partially Delivered": "🟡",
    Completed: "🟢"
  }[status];
}

function toast(message) {
  const toastEl = document.getElementById("toast");
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastEl.timer);
  toastEl.timer = setTimeout(() => toastEl.classList.remove("show"), 2400);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
