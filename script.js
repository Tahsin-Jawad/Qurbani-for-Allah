const STORAGE_KEY = "qurbaniForAllahState";

const initialState = {
  expense: {
    animalType: "Cow",
    animalCost: 0,
    butcherCost: 0,
    transportCost: 0,
    otherCost: 0,
    shareholders: 1,
    contributors: []
  },
  recipients: []
};

const masailTopics = [
  {
    title: "কার উপর কুরবানি ওয়াজিব",
    body: [
      "প্রাপ্তবয়স্ক, মুসলিম ও সুস্থ মস্তিষ্কের ব্যক্তির উপর কুরবানি ওয়াজিব।",
      "১০ জিলহজ ফজর থেকে ১২ জিলহজ সূর্যাস্ত পর্যন্ত সময়ের মধ্যে নিসাব পরিমাণ সম্পদের মালিক হলে কুরবানি ওয়াজিব।",
      "নিসাব = প্রয়োজনের অতিরিক্ত সম্পদ (প্রায় ৫২.৫ তোলা রূপার সমমূল্য)।"
    ]
  },
  {
    title: "কোন পশু দিয়ে কুরবানি করা যাবে",
    body: [
      "গরু, ছাগল, ভেড়া, উট ও মহিষ দ্বারা কুরবানি জায়েজ।",
      "বন্য পশু দ্বারা কুরবানি হবে না।"
    ]
  },
  {
    title: "পশুর বয়স শর্ত",
    body: [
      "উট: ৫ বছর",
      "গরু/মহিষ: ২ বছর",
      "ছাগল/ভেড়া: ১ বছর",
      "ভেড়া হৃষ্টপুষ্ট হলে ৬ মাস হলেও চলবে"
    ]
  },
  {
    title: "দুর্বল পশু",
    body: ["খুব দুর্বল বা হাঁটতে না পারা পশু কুরবানি হবে না"]
  },
  {
    title: "দাঁত নেই এমন পশু",
    body: ["ঘাস চিবিয়ে খেতে পারলে কুরবানি জায়েজ, না পারলে নয়"]
  },
  {
    title: "শিং/কান/লেজ",
    body: ["অর্ধেক বা বেশি কাটা হলে কুরবানি হবে না", "কম হলে জায়েজ"]
  },
  {
    title: "ভাগ নিয়ম",
    body: ["গরু/উটে সর্বোচ্চ ৭ ভাগ", "যেকোনো ভাগে অংশ নেওয়া যায়"]
  },
  {
    title: "অন্যান্য",
    body: [
      "আকীকা কুরবানিতে করা যায়",
      "কুরবানির কোনো অংশ বিক্রি করা যাবে না",
      "মৃত ব্যক্তির পক্ষ থেকে কুরবানি জায়েজ"
    ]
  }
];

let state = loadState();

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return structuredClone(initialState);
    return {
      expense: { ...initialState.expense, ...saved.expense },
      recipients: Array.isArray(saved.recipients) ? saved.recipients : []
    };
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function numberValue(id) {
  const value = Number(document.getElementById(id).value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function totalExpense() {
  const expense = state.expense;
  return expense.animalCost + expense.butcherCost + expense.transportCost + expense.otherCost;
}

function perPersonCost() {
  return totalExpense() / Math.max(1, state.expense.shareholders);
}

function formatMoney(value) {
  return moneyFormatter.format(value || 0);
}

function deliveryStats() {
  const total = state.recipients.length;
  const delivered = state.recipients.filter((recipient) => recipient.delivered).length;
  const pending = total - delivered;
  const status = total === 0 || delivered === 0 ? "Pending" : delivered === total ? "Completed" : "Partial";
  return { total, delivered, pending, status };
}

function renderBreakdown(containerId) {
  const expense = state.expense;
  const rows = [
    ["Animal type", expense.animalType],
    ["Animal cost", formatMoney(expense.animalCost)],
    ["Butcher cost", formatMoney(expense.butcherCost)],
    ["Transport cost", formatMoney(expense.transportCost)],
    ["Other expenses", formatMoney(expense.otherCost)],
    ["Total cost", formatMoney(totalExpense())],
    ["Per person share", formatMoney(perPersonCost())]
  ];
  document.getElementById(containerId).innerHTML = rows
    .map(([label, value]) => `<div class="breakdown-row"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function renderExpenseForm() {
  const expense = state.expense;
  document.getElementById("animalType").value = expense.animalType;
  document.getElementById("animalCost").value = expense.animalCost || "";
  document.getElementById("butcherCost").value = expense.butcherCost || "";
  document.getElementById("transportCost").value = expense.transportCost || "";
  document.getElementById("otherCost").value = expense.otherCost || "";
  document.getElementById("shareholders").value = expense.shareholders;
  document.getElementById("contributors").value = expense.contributors.join("\n");
}

function renderDashboard() {
  const stats = deliveryStats();
  const deliveredPercent = stats.total ? (stats.delivered / stats.total) * 100 : 0;
  const pendingPercent = stats.total ? (stats.pending / stats.total) * 100 : 0;

  document.getElementById("dashTotalExpense").textContent = formatMoney(totalExpense());
  document.getElementById("dashPerPerson").textContent = formatMoney(perPersonCost());
  document.getElementById("dashRecipients").textContent = stats.total;
  document.getElementById("dashPending").textContent = stats.pending;
  document.getElementById("deliveredCount").textContent = stats.delivered;
  document.getElementById("pendingCount").textContent = stats.pending;
  document.getElementById("deliveredBar").style.width = `${deliveredPercent}%`;
  document.getElementById("pendingBar").style.width = `${pendingPercent}%`;
  renderBreakdown("dashboardBreakdown");
}

function renderExpenseSummary() {
  document.getElementById("expenseTotal").textContent = formatMoney(totalExpense());
  document.getElementById("expensePerPerson").textContent = formatMoney(perPersonCost());
  document.getElementById("expenseShareholders").textContent = state.expense.shareholders;
  renderBreakdown("expenseBreakdown");
}

function statusClass(status) {
  return {
    Pending: "status-pending",
    Partial: "status-partial",
    Completed: "status-completed"
  }[status];
}

function renderDistribution() {
  const stats = deliveryStats();
  const totalShares = state.recipients.reduce((sum, recipient) => sum + Number(recipient.shares || 0), 0);
  const overallStatus = document.getElementById("overallStatus");

  overallStatus.textContent = stats.status;
  overallStatus.className = `status-pill ${statusClass(stats.status)}`;
  document.getElementById("totalRecipientShares").textContent = totalShares;
  document.getElementById("distributionDelivered").textContent = stats.delivered;
  document.getElementById("distributionPending").textContent = stats.pending;

  const recipientList = document.getElementById("recipientList");
  if (!state.recipients.length) {
    recipientList.innerHTML = '<div class="empty-state">Add recipients to begin the delivery checklist.</div>';
    return;
  }

  recipientList.innerHTML = state.recipients
    .map((recipient) => {
      const status = recipient.delivered ? "Completed" : "Pending";
      return `
        <article class="recipient-card">
          <input type="checkbox" data-action="toggle-recipient" data-id="${recipient.id}" ${recipient.delivered ? "checked" : ""} aria-label="Mark ${recipient.name} delivered">
          <div>
            <h3>${escapeHtml(recipient.name)}</h3>
            <p>${recipient.category} | ${recipient.shares} share${recipient.shares > 1 ? "s" : ""}</p>
          </div>
          <span class="status-pill ${statusClass(status)}">${status}</span>
          <button class="delete-btn" data-action="delete-recipient" data-id="${recipient.id}" type="button" aria-label="Delete ${recipient.name}">x</button>
        </article>
      `;
    })
    .join("");
}

function renderMasail() {
  document.getElementById("masailGrid").innerHTML = masailTopics
    .map((topic, index) => `
      <article class="masail-card ${index === 0 ? "open" : ""}">
        <button type="button" aria-expanded="${index === 0 ? "true" : "false"}">
          <span>${topic.title}</span>
        </button>
        <div class="masail-body">
          ${topic.body.map((line) => `<p>${line}</p>`).join("")}
        </div>
      </article>
    `)
    .join("");
}

function renderSummary() {
  const stats = deliveryStats();
  const financeRows = [
    ["Animal", state.expense.animalType],
    ["Total expense", formatMoney(totalExpense())],
    ["Shareholders", state.expense.shareholders],
    ["Per person cost", formatMoney(perPersonCost())]
  ];
  const recipientRows = [
    ["Total recipients", stats.total],
    ["Delivered", stats.delivered],
    ["Pending", stats.pending],
    ["Overall status", stats.status]
  ];

  document.getElementById("summaryFinance").innerHTML = financeRows
    .map(([label, value]) => `<div class="summary-line"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  document.getElementById("summaryRecipients").innerHTML = recipientRows
    .map(([label, value]) => `<div class="summary-line"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  document.getElementById("summaryContributors").innerHTML = state.expense.contributors.length
    ? state.expense.contributors.map((name) => `<span class="tag">${escapeHtml(name)}</span>`).join("")
    : '<div class="empty-state">No contributors saved yet.</div>';
}

function renderAll() {
  renderExpenseForm();
  renderDashboard();
  renderExpenseSummary();
  renderDistribution();
  renderSummary();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-link").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  history.replaceState(null, "", `#${viewId}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-link").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.jump));
});

document.getElementById("expenseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.expense = {
    animalType: document.getElementById("animalType").value,
    animalCost: numberValue("animalCost"),
    butcherCost: numberValue("butcherCost"),
    transportCost: numberValue("transportCost"),
    otherCost: numberValue("otherCost"),
    shareholders: clamp(Number(document.getElementById("shareholders").value) || 1, 1, 7),
    contributors: document.getElementById("contributors").value
      .split(/\r?\n|,/)
      .map((name) => name.trim())
      .filter(Boolean)
  };
  saveState();
  renderAll();
});

document.getElementById("recipientForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("recipientName").value.trim();
  if (!name) return;

  state.recipients.unshift({
    id: crypto.randomUUID(),
    name,
    category: document.getElementById("recipientCategory").value,
    shares: clamp(Number(document.getElementById("recipientShares").value) || 1, 1, 7),
    delivered: false
  });
  event.target.reset();
  document.getElementById("recipientShares").value = 1;
  saveState();
  renderAll();
});

document.getElementById("recipientList").addEventListener("click", (event) => {
  const target = event.target;
  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) return;

  if (action === "toggle-recipient") {
    state.recipients = state.recipients.map((recipient) =>
      recipient.id === id ? { ...recipient, delivered: target.checked } : recipient
    );
  }

  if (action === "delete-recipient") {
    state.recipients = state.recipients.filter((recipient) => recipient.id !== id);
  }

  saveState();
  renderAll();
});

document.getElementById("clearDeliveredBtn").addEventListener("click", () => {
  state.recipients = state.recipients.filter((recipient) => !recipient.delivered);
  saveState();
  renderAll();
});

document.getElementById("masailGrid").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const card = button.closest(".masail-card");
  const isOpen = card.classList.toggle("open");
  button.setAttribute("aria-expanded", String(isOpen));
});

document.getElementById("exportDataBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "qurbani-for-allah-backup.json";
  link.click();
  URL.revokeObjectURL(url);
});

document.getElementById("importDataInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    state = {
      expense: { ...initialState.expense, ...imported.expense },
      recipients: Array.isArray(imported.recipients) ? imported.recipients : []
    };
    saveState();
    renderAll();
  } catch {
    alert("The selected backup file could not be imported.");
  } finally {
    event.target.value = "";
  }
});

renderMasail();
renderAll();

const initialHash = location.hash.replace("#", "");
if (["dashboard", "expense", "distribution", "masail", "summary"].includes(initialHash)) {
  setView(initialHash);
}
