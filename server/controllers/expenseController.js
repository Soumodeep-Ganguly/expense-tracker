const Expense = require('../models/expense');

module.exports.get = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.userId }).populate("category");

        res.send({ expenses });
    } catch (error) {
        res.status(500).json({ error: 'Error getting expenses' });
    }
}

module.exports.create = async (req, res) => {
    try {
        req.body.user = req.user.userId
        const expense = new Expense(req.body);
        await expense.save();
        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error creating expense' });
    }
}

module.exports.update = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id });
        if(!expense) return res.status(404).json({ error: 'Expense not found' });

        await Expense.findOneAndUpdate({ _id: req.params.id }, req.body)

        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error updating expense' });
    }
}

module.exports.delete = async (req, res) => {
    try {
        await Expense.deleteOne({ _id: req.params.id })

        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting expense' });
    }
}