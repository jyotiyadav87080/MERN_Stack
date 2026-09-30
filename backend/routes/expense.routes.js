const express = require("express");
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require("../controllers/expense.controller");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.get("/:id", protect, getExpenseById);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

module.exports = router;