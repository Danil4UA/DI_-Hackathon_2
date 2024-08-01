const addBudget = document.getElementById("addBudget");
const container = document.getElementById("container");
const budgetName = document.getElementById("budgetName");
const budgetAmount = document.getElementById("budgetAmount");

const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const saveExpenseBtn = document.getElementById("saveExpenseBtn");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");

const createBudget = (data) => {
    const { name, amount } = data;

    return `
        <div>
            <p>Budget: ${name}</p>
            <p>Amount: ${amount}</p>
            <p>Remaining balance: </p>
            <button class="add-expense-btn">Add Expense</button>
            <button>View Expenses</button>
        </div>
    `;
};

addBudget.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = budgetName.value;
    const amount = budgetAmount.value;

    const response = await fetch("http://localhost:3000/budget", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            amount,
        }),
    });

    const data = await response.json();
    const newBudget = createBudget(data);
    container.innerHTML = container.innerHTML + newBudget;
    
    // Add event listeners for new "Add Expense" buttons
    document.querySelectorAll(".add-expense-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            modal.style.display = "block";
        });
    });
});

// Close the modal when the close button is clicked
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close the modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Handle saving expenses
saveExpenseBtn.addEventListener("click", () => {
    const expenseValue = expenseAmount.value;
    const expenseNameValue = expenseName.value;
    if (expenseValue && expenseNameValue) {
        console.log(`Expense: ${expenseNameValue} - ${expenseValue}`);
        // Here you can add logic to save the expense
        expenseAmount.value = '';
        expenseName.value = '';
        modal.style.display = "none";
    } else {
        alert('Please enter an expense name and amount');
    }
});