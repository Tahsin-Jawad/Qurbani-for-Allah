let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let recipients = JSON.parse(localStorage.getItem("recipients")) || [];

/* TAB */
function showTab(id){
  document.querySelectorAll(".tab").forEach(tab=>{
    tab.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

/* SAVE */
function saveData(){
  localStorage.setItem("expenses",JSON.stringify(expenses));
  localStorage.setItem("recipients",JSON.stringify(recipients));
}

/* EXPENSE */
function addExpense(){

  let name=document.getElementById("expName").value;
  let cost=Number(document.getElementById("expCost").value);
  let share=Number(document.getElementById("expShare").value);

  if(!name || !cost || !share){
    alert("Fill all fields");
    return;
  }

  expenses.push({
    id:Date.now(),
    name,
    cost,
    share
  });

  saveData();
  renderExpenses();
  updateDashboard();

  document.getElementById("expName").value="";
  document.getElementById("expCost").value="";
  document.getElementById("expShare").value="";
}

function deleteExpense(id){
  expenses=expenses.filter(e=>e.id!==id);

  saveData();
  renderExpenses();
  updateDashboard();
}

function renderExpenses(){

  let box=document.getElementById("expenseList");

  box.innerHTML="";

  expenses.forEach(e=>{

    box.innerHTML+=`
      <div class="card">
        <h3>${e.name}</h3>
        <p>${e.cost} BDT</p>
        <p>${e.share} Shares</p>

        <button onclick="deleteExpense(${e.id})">
          Delete
        </button>
      </div>
    `;
  });
}

/* RECIPIENT */
function addRecipient(){

  let name=document.getElementById("recName").value;

  if(!name){
    alert("Enter recipient name");
    return;
  }

  recipients.push({
    id:Date.now(),
    name,
    delivered:false
  });

  saveData();
  renderRecipients();
  updateDashboard();

  document.getElementById("recName").value="";
}

function toggleRecipient(id){

  recipients=recipients.map(r=>{

    if(r.id===id){
      r.delivered=!r.delivered;
    }

    return r;
  });

  saveData();
  renderRecipients();
  updateDashboard();
}

function deleteRecipient(id){

  recipients=recipients.filter(r=>r.id!==id);

  saveData();
  renderRecipients();
  updateDashboard();
}

function renderRecipients(){

  let box=document.getElementById("recipientList");

  box.innerHTML="";

  recipients.forEach(r=>{

    box.innerHTML+=`
      <div class="card">

        <h3>${r.name}</h3>

        <p class="${r.delivered ? 'delivered' : 'pending'}">
          ${r.delivered ? '🟢 Delivered' : '🔴 Pending'}
        </p>

        <button onclick="toggleRecipient(${r.id})">
          Toggle Status
        </button>

        <button onclick="deleteRecipient(${r.id})">
          Delete
        </button>

      </div>
    `;
  });
}

/* DASHBOARD */
function updateDashboard(){

  let totalExpense=expenses.reduce((sum,e)=>sum+e.cost,0);

  let totalShares=expenses.reduce((sum,e)=>sum+e.share,0);

  let perShare=0;

  if(totalShares>0){
    perShare=(totalExpense/totalShares).toFixed(2);
  }

  document.getElementById("totalExpense").innerHTML=
    `<h3>Total Expense</h3><p>${totalExpense} BDT</p>`;

  document.getElementById("perShare").innerHTML=
    `<h3>Per Share Cost</h3><p>${perShare} BDT</p>`;

  document.getElementById("recipientCount").innerHTML=
    `<h3>Total Recipients</h3><p>${recipients.length}</p>`;
}

/* INIT */
renderExpenses();
renderRecipients();
updateDashboard();