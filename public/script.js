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

let budgets = [];
let salary = 0;

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

setSalaryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    salary = parseFloat(salaryAmount.value);
    updateChart();
    
    // Show the budget form
    addBudgetForm.classList.remove("hidden");
    setSalaryForm.classList.add("hidden");
});

addBudgetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = budgetName.value;
    const amount = parseFloat(budgetAmount.value);

    const response = await fetch("http://localhost:3000/budget", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            amount,
            remaining: amount,
            expenses: []
        }),
    });

    const data = await response.json();
    budgets.push(data);
    const newBudget = createBudget(data);
    container.innerHTML += newBudget;
    
    addEventListeners();
    updateChart();
});

function addEventListeners() {
    document.querySelectorAll(".add-expense-btn").forEach(btn => {
        btn.removeEventListener("click", openModal);
        btn.addEventListener("click", openModal);
    });

    document.querySelectorAll(".view-expenses-btn").forEach(btn => {
        btn.removeEventListener("click", viewExpenses);
        btn.addEventListener("click", viewExpenses);
    });

    document.querySelectorAll(".delete-budget-btn").forEach(btn => {
        btn.removeEventListener("click", deleteBudget);
        btn.addEventListener("click", deleteBudget);
    });
}

function openModal(event) {
    const budgetId = event.target.getAttribute("data-id");
    modal.setAttribute("data-id", budgetId);
    modal.style.display = "block";
}

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

saveExpenseBtn.addEventListener("click", () => {
    const expenseValue = parseFloat(expenseAmount.value);
    const expenseNameValue = expenseName.value;
    const budgetId = modal.getAttribute("data-id");
    
    if (expenseValue && expenseNameValue) {
        const budget = budgets.find(b => b.id == budgetId);
        budget.expenses.push({ name: expenseNameValue, amount: expenseValue });
        budget.remaining -= expenseValue;
        
        fetch(`http://localhost:3000/budget/${budgetId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(budget),
        }).then(() => {
            const remainingElement = document.querySelector(`#budget-${budgetId} .remaining`);
            remainingElement.textContent = budget.remaining;
            expenseAmount.value = '';
            expenseName.value = '';
            modal.style.display = "none";
            updateChart();
        }).catch(error => {
            console.error('Error updating budget:', error);
        });
    } else {
        alert('Please enter an expense name and amount');
    }
});

function viewExpenses(event) {
    const budgetId = event.target.getAttribute("data-id");
    const budget = budgets.find(b => b.id == budgetId);
    alert(`Expenses for ${budget.name}: ${JSON.stringify(budget.expenses, null, 2)}`);
}

function deleteBudget(event) {
    const budgetId = event.target.getAttribute("data-id");
    
    fetch(`http://localhost:3000/budget/${budgetId}`, {
        method: "DELETE"
    }).then(() => {
        budgets = budgets.filter(b => b.id != budgetId);
        document.getElementById(`budget-${budgetId}`).remove();
        updateChart();
    }).catch(error => {
        console.error('Error deleting budget:', error);
    });
}

const ctx = document.getElementById('budgetChart').getContext('2d');
let budgetChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Remaining Salary', 'Expenses'],
        datasets: [{
            data: [salary, 0],
            backgroundColor: ['#4caf50', '#ff5252'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

function updateChart() {
    const totalExpenses = budgets.reduce((acc, budget) => acc + (budget.amount - budget.remaining), 0);
    const remainingSalary = salary - totalExpenses;
    
    budgetChart.data.datasets[0].data[0] = remainingSalary;
    budgetChart.data.datasets[0].data[1] = totalExpenses;
    budgetChart.update();
}
