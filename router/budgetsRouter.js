const express = require("express")
const {
    getAllBudgets,
    getBudgetById,
    createBudget,
    updateBudgetById,
    deleteBudgetByIf,
} = require("../controllers/budgetsControllers.js")

const router = express.Router()

router.get("/", getAllBudgets)
router.get("/:id", getBudgetById)
router.post('/', createBudget);
router.put('/:id', updateBudgetById);
router.delete("/:id", deleteBudgetByIf);


module.exports = router