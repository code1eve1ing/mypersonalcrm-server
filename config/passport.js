// config/passport.ts
const { Strategy: GoogleStrategy } = require("passport-google-oauth20")
const passport = require('passport');
const User = require('../models/User')
const generateToken = require('../utils/generateToken')

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
            scope: ["profile", "email"],
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails?.[0].value });

                if (!user) {
                    return done(null, false, {
                        message: 'You need to register your account first!',
                        redirectTo: '/signup'  // Optional: suggest where to register
                    });
                }
                const token = generateToken(user._id);
                return done(null, { user, token });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});