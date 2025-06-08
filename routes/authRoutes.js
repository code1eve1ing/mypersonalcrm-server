const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser
} = require('../controllers/authController');
const passport = require('passport');
const generateToken = require('../utils/generateToken');

// Register route
router.post('/signup', registerUser);
router.post('/login', loginUser);

router.get('/login', (req, res) => {
    // If using server-side rendering:
    // res.sendFile(path.join(__dirname, '../public/login.html'));

    // If using separate frontend:
    res.redirect(process.env.FRONTEND_URL + '/login');
});

// Initiate Google auth
router.get(
    "/google",
    passport.authenticate("google", { session: false })
);

// Google auth callback
router.get('/google/callback',
    (req, res, next) => {
        passport.authenticate('google', { session: false }, (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                // Encode the error message for URL safety
                const errorMessage = encodeURIComponent(info?.message || 'Authentication failed');
                return res.redirect(
                    `${process.env.FRONTEND_URL}/login?error=${errorMessage}${info?.redirectTo ? `&redirectTo=${info.redirectTo}` : ''}`
                );
            }
            const token = generateToken(user.user._id);
            res.redirect(`${process.env.FRONTEND_URL}/auth/redirect?token=${token}`);
        })(req, res, next);
    }
);

module.exports = router;