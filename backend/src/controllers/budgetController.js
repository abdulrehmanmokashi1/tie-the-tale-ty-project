const BudgetCategory = require('../models/BudgetCategory');
const Expense = require('../models/Expense');
const WeddingProfile = require('../models/WeddingProfile');

const updateCategorySpent = async (userId, category) => {
  const expenses = await Expense.find({ user: userId, budgetCategory: category });
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  await BudgetCategory.findOneAndUpdate({ user: userId, category }, { spent: totalSpent });
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await BudgetCategory.find({ user: req.user.id });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.updateCategoryAllocation = async (req, res, next) => {
  try {
    const { allocated } = req.body;
    const category = await BudgetCategory.findOneAndUpdate(
      { user: req.user.id, category: req.params.category },
      { allocated },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const { budgetCategory } = req.query;
    let query = { user: req.user.id };
    if (budgetCategory) query.budgetCategory = budgetCategory;
    
    const expenses = await Expense.find(query).sort('-date');
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    next(error);
  }
};

exports.addExpense = async (req, res, next) => {
  try {
    const { budgetCategory, description, amount, date, notes } = req.body;
    const expense = await Expense.create({
      user: req.user.id, budgetCategory, description, amount, date, notes
    });
    
    await updateCategorySpent(req.user.id, budgetCategory);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    
    const category = expense.budgetCategory;
    await expense.deleteOne();
    
    await updateCategorySpent(req.user.id, category);
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.getBudgetSummary = async (req, res, next) => {
  try {
    const profile = await WeddingProfile.findOne({ user: req.user.id });
    const categories = await BudgetCategory.find({ user: req.user.id });
    
    const totalBudget = profile ? profile.totalBudget : 0;
    const totalAllocated = categories.reduce((acc, cat) => acc + cat.allocated, 0);
    const totalSpent = categories.reduce((acc, cat) => acc + (cat.spent || 0), 0);
    const totalRemaining = totalBudget - totalSpent;
    
    res.json({
      success: true,
      data: {
        totalBudget,
        totalAllocated,
        totalSpent,
        totalRemaining,
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};
