const budgets = require("../config/budjets.js")

const getAllBudgets = (req,res)=>{
    res.json(budgets)
}

const getBudgetById = (req,res)=>{
    const {id} = req.params
    const index = budgets.findIndex(item=>item.id == id)
    if(index === -1)res.json({message: "Buget not found"})
    res.json(budgets[index])
}

const createBudget = (req, res) => {
    const { name, amount } = req.body;
    const newBudget = {
        id: budgets.length + 1,
        name,
        amount,
        remaining: amount,
        expenses: []
    };
    budgets.push(newBudget);
    res.status(201).json(newBudget);
}

const updateBudgetById = (req, res) => {
    const { id } = req.params;
    const { name, amount, remaining, expenses } = req.body;

    const budgetIndex = budgets.findIndex(b => b.id == id);
    if (budgetIndex !== -1) {
        budgets[budgetIndex] = {
            id: parseInt(id),
            name,
            amount,
            remaining,
            expenses
        };
        res.status(200).json(budgets[budgetIndex]);
    } else {
        res.status(404).json({ message: 'Budget not found' });
    }
}

module.exports = {
    getAllBudgets,
    getBudgetById,
    createBudget,
    updateBudgetById,
}