const jwt = require("../utils/jwt");
const { encryptField, decryptField } = require("../utils/crypto");
const { User } = require("../models");

exports.signup = async (req, res) => {
    try {
        const { email, mobile, password, agreedToPolicy } = req.body;
        const user = await User.create({ email, mobile, password, agreedToPolicy });
        const token = jwt.generateToken({ id: user.id });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || encryptField(password) !== user.password)
            return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.generateToken({ id: user.id });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json({ email: user.email, mobile: user.mobile ? decryptField(user.mobile) : 'not_set' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};