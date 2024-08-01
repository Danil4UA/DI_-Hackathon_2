const addBudget = document.getElementById("addBudget");
const container = document.getElementById("container");
const budgetName = document.getElementById("budgetName");
const budgetAmount = document.getElementById("budgetAmount");

const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const saveExpenseBtn = document.getElementById("saveExpenseBtn");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");

let budgets = [];

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
        </div>
    `;
};

addBudget.addEventListener("submit", async (e) => {
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
            const remainingElement = document.querySelector(`.remaining[data-id="${budgetId}"]`);
            remainingElement.textContent = budget.remaining;
            expenseAmount.value = '';
            expenseName.value = '';
            modal.style.display = "none";
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