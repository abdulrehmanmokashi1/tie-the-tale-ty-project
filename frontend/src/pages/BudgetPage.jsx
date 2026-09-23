import React, { useState, useEffect } from 'react';
import { getBudgetSummary, getCategories, updateAllocation, getExpenses, addExpense, deleteExpense } from '../api/budget';

const BudgetPage = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    budgetCategory: '', description: '', amount: '', date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const CATEGORY_COLORS = {
    'Venue': 'bg-blue-500',
    'Food & Catering': 'bg-green-500',
    'Decoration': 'bg-purple-500',
    'Photography': 'bg-amber-500',
    'Travel & Stay': 'bg-rose-500',
    'Other': 'bg-gray-500',
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sumRes, catRes, expRes] = await Promise.all([
        getBudgetSummary(),
        getCategories(),
        getExpenses()
      ]);
      const sumData = sumRes.data?.data || sumRes.data;
      const catData = catRes.data?.data || catRes.data;
      const expData = expRes.data?.data || expRes.data;
      setSummary(sumData);
      setCategories(Array.isArray(catData) ? catData : []);
      setExpenses(Array.isArray(expData) ? expData : []);
      if (Array.isArray(catData) && catData.length > 0) {
        setNewExpense(prev => ({ ...prev, budgetCategory: catData[0].category }));
      }
    } catch (err) {
      setError('Could not load budget data. Make sure your wedding profile is set up.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await addExpense({ ...newExpense, amount: Number(newExpense.amount) });
      setNewExpense(prev => ({ ...prev, description: '', amount: '' }));
      fetchAll(); // Refresh all data
    } catch (err) {
      alert('Failed to add expense. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const formatMoney = (amount) => '₹' + (amount ?? 0).toLocaleString('en-IN');

  if (loading) return <div className="text-center py-20 text-rose-600 font-serif text-2xl">Loading Budget Planner...</div>;

  if (error) return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="text-5xl mb-4">💰</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Budget Not Set Up Yet</h2>
      <p className="text-gray-500">{error}</p>
      <a href="/dashboard" className="mt-4 inline-block bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700">Go to Dashboard →</a>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Smart Budget Planner</h1>
        <p className="text-gray-600 mt-2">Keep track of every rupee without the stress.</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-gray-400 font-medium mb-1">Total Budget</p>
            <h2 className="text-3xl font-bold">{formatMoney(summary.totalBudget)}</h2>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm">
            <p className="text-rose-600 font-medium mb-1">Total Spent</p>
            <h2 className="text-3xl font-bold text-gray-900">{formatMoney(summary.totalSpent)}</h2>
          </div>
          <div className={`${summary.totalRemaining < 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'} rounded-2xl p-6 shadow-sm border`}>
            <p className={`${summary.totalRemaining < 0 ? 'text-red-600' : 'text-green-600'} font-medium mb-1`}>Remaining</p>
            <h2 className="text-3xl font-bold text-gray-900">{formatMoney(summary.totalRemaining)}</h2>
          </div>
        </div>
      )}

      {summary?.totalRemaining < 0 && (
        <div className="bg-red-100 text-red-800 p-4 rounded-xl flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <p className="font-medium">You are over budget by {formatMoney(Math.abs(summary.totalRemaining))}. Consider adjusting your allocations.</p>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">Budget Allocation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => {
              const color = CATEGORY_COLORS[cat.category] || 'bg-gray-500';
              const percent = Math.min(100, cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0);
              const isOver = cat.spent > cat.allocated;
              return (
                <div key={cat._id || cat.category} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${color}`}></div>
                    <h4 className="font-bold text-gray-800">{cat.category}</h4>
                  </div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-500">Allocated</span>
                    <span className="font-medium text-gray-900">{formatMoney(cat.allocated)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div className={`h-2 rounded-full ${isOver ? 'bg-red-500' : color}`} style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm mt-3">
                    <span className="text-gray-600">Spent: <span className="font-bold text-gray-900">{formatMoney(cat.spent)}</span></span>
                    {isOver ? (
                      <span className="text-red-600 font-medium text-xs bg-red-50 px-2 py-0.5 rounded">Over by {formatMoney(cat.spent - cat.allocated)}</span>
                    ) : (
                      <span className="text-green-600 font-medium">Left: {formatMoney(cat.allocated - cat.spent)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expenses Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Expense Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add Expense</h3>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="budgetCategory" value={newExpense.budgetCategory} onChange={handleExpenseChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
                {categories.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input required type="text" name="description" value={newExpense.description} onChange={handleExpenseChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500" placeholder="e.g. Advance payment" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
              <input required type="number" name="amount" value={newExpense.amount} onChange={handleExpenseChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input required type="date" name="date" value={newExpense.date} onChange={handleExpenseChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
            </div>
            <button type="submit" className="w-full bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 transition-colors">
              Save Expense
            </button>
          </form>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Recent Expenses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">No expenses recorded yet.</td></tr>
                ) : (
                  expenses.map((exp, idx) => (
                    <tr key={exp._id || idx} className={idx !== expenses.length - 1 ? "border-b border-gray-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(exp.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">{exp.budgetCategory}</span>
                      </td>
                      <td className="px-6 py-4">{exp.description}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">{formatMoney(exp.amount)}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDeleteExpense(exp._id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
