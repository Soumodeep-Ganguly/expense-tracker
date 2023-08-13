const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    amount: { type: Number, default: 0 },
    date: { type: Date },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);