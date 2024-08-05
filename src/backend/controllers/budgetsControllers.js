const { eq } = require("drizzle-orm");
const { db } = require("../db");
const { budgets } = require("../db/schema");
const { getUserIdOrCreate } = require("./usersControllers");

const getAllBudgets = async (req, res) => {
  let userId = await getUserIdOrCreate(req.query.userId);
  if (!userId) {
    return res.status(500).json({ message: "Error creating user" });
  }
  try {
    const allBudgets = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId));
    res.json(allBudgets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching budgets", error: error.message });
  }
};

const getBudgetById = async (req, res) => {
  const { id } = req.params;
  try {
    const budget = await db
      .select()
      .from(budgets)
      .where(eq(budgets.id, parseInt(id)))
      .limit(1);
    if (budget.length === 0) {
      res.status(404).json({ message: "Budget not found" });
    } else {
      res.json(budget[0]);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching budget", error: error.message });
  }
};

const createBudget = async (req, res) => {
  const userId = req.query.userId;
  const { name, amount } = req.body;
  try {
    const newBudget = await db
      .insert(budgets)
      .values({
        name,
        amount,
        remaining: amount,
        expenses: [],
        userId,
      })
      .returning();
    res.status(201).json(newBudget[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating budget", error: error.message });
  }
};

const updateBudgetById = async (req, res) => {
  const userId = req.query.userId;
  const { id } = req.params;
  const { name, amount, remaining, expenses } = req.body;
  try {
    const updatedBudget = await db
      .update(budgets)
      .set({ name, amount, remaining, expenses })
      .where(eq(budgets.id, parseInt(id)))
      .where(eq(budgets.userId, userId))
      .returning();
    if (updatedBudget.length === 0) {
      res.status(404).json({ message: "Budget not found" });
    } else {
      res.status(200).json(updatedBudget[0]);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating budget", error: error.message });
  }
};

const deleteBudgetById = async (req, res) => {
  const userId = req.query.userId;
  const { id } = req.params;
  try {
    const deletedBudget = await db
      .delete(budgets)
      .where(eq(budgets.id, parseInt(id)))
      .where(eq(budgets.userId, userId))
      .returning();
    if (deletedBudget.length === 0) {
      res.status(404).json({ message: "Budget not found" });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting budget", error: error.message });
  }
};

module.exports = {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudgetById,
  deleteBudgetById,
};
