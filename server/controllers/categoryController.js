const Category = require('../models/category');

module.exports.get = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.userId, deleted: false });

        res.send({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Error getting categories' });
    }
}

module.exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find({ $or: [
            { user: req.user.userId, deleted: false },
            { user: null }
        ] });

        res.send({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Error getting categories' });
    }
}

module.exports.create = async (req, res) => {
    try {
        const category = new Category({ user: req.user.userId, name: req.body.name });
        await category.save();
        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error creating category' });
    }
}

module.exports.update = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id });
        if(!category) return res.status(404).json({ error: 'Category not found' });

        await Category.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name })

        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error updating category' });
    }
}

module.exports.delete = async (req, res) => {
    try {
        await Category.findOneAndUpdate({ _id: req.params.id }, { deleted: true })

        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
    }
}