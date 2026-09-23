const mongoose = require('mongoose');

const budgetCategorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  allocated: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  color: String
});

module.exports = mongoose.model('BudgetCategory', budgetCategorySchema);
