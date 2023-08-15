const Expense = require('../models/expense');

module.exports.get = async (req, res) => {
    try {
        let limit = 10
        let skip = 0
        let where = { user: req.user.userId }
        if(req.query.q) where['description'] = { $regex: new RegExp(req.query.q, 'i') }
        if(req.query.category) where['category'] = req.query.category
        if(req.query.page) skip = Number(req.query.page) * limit

        const expenses = await Expense.find(where)
                                .populate("category")
                                .sort({ date: -1 })
                                .skip(skip)
                                .limit(limit);

        const count = await Expense.countDocuments(where)

        res.send({ expenses, pages: Math.ceil(count/limit) });
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