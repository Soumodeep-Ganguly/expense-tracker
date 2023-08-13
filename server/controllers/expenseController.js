const Expense = require('../models/expense');

module.exports.get = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.userId });

        res.send({ expenses });
    } catch (error) {
        res.status(500).json({ error: 'Error getting expenses' });
    }
}