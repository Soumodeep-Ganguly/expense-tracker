const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) return res.status(401).json({ error: 'User already exist.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        const token = jwt.sign({ userId: user._id, userEmail: user.email }, process.env.JWT_TOKEN_SECRET || "expense-tracker", { expiresIn: '72h' });
        res.json({ token, name: user.name });
    } catch (error) {
        res.status(500).json({ error: 'Error signing up user' });
    }
}

module.exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'User not found.' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ userId: user._id, userEmail: user.email }, process.env.JWT_TOKEN_SECRET || "expense-tracker", { expiresIn: '72h' });
        res.json({ token, name: user.name });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
}