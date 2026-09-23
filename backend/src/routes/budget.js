const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', budgetController.getBudgetSummary);
router.get('/categories', budgetController.getCategories);
router.put('/categories/:category', budgetController.updateCategoryAllocation);
router.get('/expenses', budgetController.getExpenses);
router.post('/expenses', budgetController.addExpense);
router.delete('/expenses/:id', budgetController.deleteExpense);

module.exports = router;
