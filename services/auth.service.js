const jwt = require("../utils/jwt");
const axios = require("axios");
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
        console.log('get user details...')
        const user = await User.findByPk(req.user.id);
        console.log('req.header', req.headers)
        const response = await axios.get(`http://localhost:5001/api/plans/${req.user.id}`, {
            headers: {
                Authorization: req.headers.authorization // or just the token if that's your format
            }
        });
        console.log('res', response)
        res.json({ email: user.email, mobile: user.mobile ? decryptField(user.mobile) : 'not_set', plan: response.data?.planId });
    } catch (err) {
        console.log('err', err)
        res.status(500).json({ error: err.message });
    }
};

exports.validateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.body.id);
        const status = user ? 200 : 404
        const success = user ? true : false
        res.status(status).json({ success })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};