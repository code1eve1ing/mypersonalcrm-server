const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser
} = require('../controllers/authController');
const passport = require('passport');
// TODO: set in env
const FRONTEND_URL = 'http://localhost:5173'
// Register route
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Initiate Google auth
router.get(
    "/google",
    passport.authenticate("google", { session: false })
);

// Google auth callback
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req, res) => {
        const { user, token } = req.user;

        // Redirect with token to frontend
        res.redirect(
            `${FRONTEND_URL}/auth/google/callback?token=${token}&user=${encodeURIComponent(
                JSON.stringify(user)
            )}`
        );
    }
);

module.exports = router;