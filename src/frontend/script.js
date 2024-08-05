// Get elements by their IDs and classes
const setSalaryForm = document.getElementById("setSalary");
const addBudgetForm = document.getElementById("addBudget");
const container = document.getElementById("container");
const salaryAmount = document.getElementById("salaryAmount");
const budgetName = document.getElementById("budgetName");
const budgetAmount = document.getElementById("budgetAmount");

const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const saveExpenseBtn = document.getElementById("saveExpenseBtn");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");

const viewExpensesModal = document.getElementById("viewExpensesModal");
const closeViewExpensesModalBtn = document.getElementById("closeViewExpensesModal");
const expensesList = document.getElementById("expensesList");

let budgets = [];
let salary = 0;

// Function to get a cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Function to fetch budgets from the server
async function fetchBudgets(userId) {
  let url = `http://localhost:3000/budgets`;
  if (userId) {
    url += `?userId=${userId}`;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch budgets");
    }
    budgets = await response.json();
    return budgets;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
}

// Function to fetch user data from the server
async function fetchUser(userId) {
  let url = "http://localhost:3000/users";
  if (userId) {
    url += `/${userId}`;
  }
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching user:", error);
      return 0;
    });
}

// Function to initialize the page
async function initializePage() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.log("No user ID found. A new one will be created on first request.");
  }
  const user = await fetchUser(userId);
  localStorage.setItem("userId", user.id);
  salary = user.salary;
  budgets = await fetchBudgets(userId);
  // Render budgets
  budgets.forEach((budget) => {
    const newBudget = createBudget(budget);
    container.innerHTML += newBudget;
  });

  addEventListeners();
  updateChart();

  // Show or hide forms based on existing budgets or salary
  if (budgets.length > 0 || salary > 0) {
    setSalaryForm.classList.add("hidden");
    addBudgetForm.classList.remove("hidden");
  }
}

// Function to create a budget block
const createBudget = (data) => {
  const { id, name, amount, remaining } = data;

  return `
    <div class="budget-block" id="budget-${id}">
        <div class="budget-title">
            <p>${name}</p>
            <div class="budget-amounts">
                <p>$${amount}/</p>
                <p>$<span class="remaining" data-id="${id}">${remaining}</span></p>
            </div>
        </div>
        <div class="budget-scale"></div>
        <button class="add-expense-btn" data-id="${id}">Add Expense</button>
        <button class="view-expenses-btn" data-id="${id}">View Expenses</button>
        <button class="delete-budget-btn" data-id="${id}">Delete Budget</button>
    </div>
  `;
};

// Event listener for setting salary
setSalaryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  salary = parseInt(salaryAmount.value);
  const userId = localStorage.getItem("userId");
  let url = `http://localhost:3000/users`;
  if (userId) {
    url += `/${userId}`;
  }
  const response = await fetch(url, {
    body: JSON.stringify({ salary }),
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!userId) {
    const userId = await response.json();
    localStorage.setItem("userId", userId);
  }
  updateChart();

  // Show the budget form
  addBudgetForm.classList.remove("hidden");
  setSalaryForm.classList.add("hidden");
});

// Event listener for adding a budget
addBudgetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = budgetName.value;
  const amount = parseFloat(budgetAmount.value);
  const userId = localStorage.getItem("userId");
  const response = await fetch(
    `http://localhost:3000/budgets?userId=${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        amount,
        remaining: amount,
        expenses: [],
      }),
    }
  );

  const data = await response.json();
  budgets.push(data);
  const newBudget = createBudget(data);
  container.innerHTML += newBudget;

  addEventListeners();
  updateChart();
});

// Event listener for clicking outside the modals to close them
window.addEventListener("click", (event) => {
  if (event.target === viewExpensesModal) {
    viewExpensesModal.style.display = "none";
  }
});

// Function to open the expenses modal and display the expenses
function openViewExpensesModal(event) {
  const budgetId = event.target.getAttribute("data-id");
  const budget = budgets.find((b) => b.id == budgetId);

  // Clear previous expenses
  expensesList.innerHTML = '';

  // Add expenses to the modal
  budget.expenses.forEach(expense => {
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-item');
    expenseItem.innerHTML = `<p>${expense.name}: $${expense.amount}</p>`;
    expensesList.appendChild(expenseItem);
  });

  // Open the modal
  viewExpensesModal.style.display = "block";
}

// Event listener for closing the expenses modal
closeViewExpensesModalBtn.addEventListener("click", () => {
  viewExpensesModal.style.display = "none";
});

// Function to add event listeners to buttons
function addEventListeners() {
  document.querySelectorAll(".add-expense-btn").forEach((btn) => {
    btn.removeEventListener("click", openModal);
    btn.addEventListener("click", openModal);
  });

  document.querySelectorAll(".view-expenses-btn").forEach((btn) => {
    btn.removeEventListener("click", openViewExpensesModal);
    btn.addEventListener("click", openViewExpensesModal);
  });

  document.querySelectorAll(".delete-budget-btn").forEach((btn) => {
    btn.removeEventListener("click", deleteBudget);
    btn.addEventListener("click", deleteBudget);
  });
}

// Function to open the modal for adding expenses
function openModal(event) {
  const budgetId = event.target.getAttribute("data-id");
  modal.setAttribute("data-id", budgetId);
  modal.style.display = "block";
}

// Event listener for closing the modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Event listener for clicking outside the modal to close it
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Event listener for saving an expense
saveExpenseBtn.addEventListener("click", () => {
  const expenseValue = parseFloat(expenseAmount.value);
  const expenseNameValue = expenseName.value;
  const budgetId = modal.getAttribute("data-id");

  if (expenseValue && expenseNameValue) {
    const budget = budgets.find((b) => b.id == budgetId);
    budget.expenses.push({ name: expenseNameValue, amount: expenseValue });
    budget.remaining -= expenseValue;
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:3000/budgets/${budgetId}?userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budget),
    })
      .then(() => {
        const remainingElement = document.querySelector(
          `#budget-${budgetId} .remaining`
        );
        remainingElement.textContent = budget.remaining;
        expenseAmount.value = "";
        expenseName.value = "";
        modal.style.display = "none";
        updateChart();
      })
      .catch((error) => {
        console.error("Error updating budget:", error);
      });
  } else {
    alert("Please enter an expense name and amount");
  }
});

// Function to delete a budget
function deleteBudget(event) {
  const budgetId = event.target.getAttribute("data-id");
  const userId = localStorage.getItem("userId");
  let url = `http://localhost:3000/budgets/${budgetId}`;
  if (userId) {
    url += `?userId=${userId}`;
  }
  fetch(url, {
    method: "DELETE",
  })
    .then(() => {
      budgets = budgets.filter((b) => b.id != budgetId);
      document.getElementById(`budget-${budgetId}`).remove();
      updateChart();
    })
    .catch((error) => {
      console.error("Error deleting budget:", error);
    });
}

// Initialize the chart
const ctx = document.getElementById("budgetChart").getContext("2d");
let budgetChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Remaining Salary", "Expenses"],
    datasets: [
      {
        data: [salary, 0],
        backgroundColor: ["#4caf50", "#ff5252"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

// Function to update the chart
function updateChart() {
  const totalExpenses = budgets.reduce(
    (acc, budget) => acc + (budget.amount - budget.remaining),
    0
  );
  const remainingSalary = salary - totalExpenses;

  budgetChart.data.datasets[0].data[0] = remainingSalary;
  budgetChart.data.datasets[0].data[1] = totalExpenses;
  budgetChart.update();
}

// Initialize the page when the script loads
initializePage();