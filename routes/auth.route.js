const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const passport = require('passport');

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/validate/user", controller.validateUser);
router.get("/me", authMiddleware, controller.getUserDetails);

router.get("/google", passport.authenticate("google", { session: false }));

router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            const errorMessage = encodeURIComponent(info?.message || "Authentication failed");
            return res.redirect(
                `${process.env.FRONTEND_URL}/login?error=${errorMessage}${info?.redirectTo ? `&redirectTo=${info.redirectTo}` : ""}`
            );
        }
        const token = user.token;
        res.redirect(`${process.env.FRONTEND_URL}/auth/redirect?token=${token}`);
    })(req, res, next);
});

module.exports = router;
