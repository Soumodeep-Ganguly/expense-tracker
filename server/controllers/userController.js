const { trusted } = require('mongoose');
const User = require('../models/user');

module.exports.get = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user) return res.status(404).json({ error: 'User Not Found' });

        delete user.password
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error getting user' });
    }
}

module.exports.update = async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.user.userId }, {
            name: req.body.name,
            yearly_view: req.body.yearly
        });

        res.send({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
}