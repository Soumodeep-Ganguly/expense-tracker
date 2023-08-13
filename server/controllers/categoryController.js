const Category = require('../models/category');

module.exports.get = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.userId });

        res.send({ categories });
    } catch (error) {
        res.status(500).json({ error: 'Error getting categories' });
    }
}