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
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails?.[0].value });

                if (!user) {
                    // Create new user if doesn't exist
                    user = await User.create({
                        email: profile.emails?.[0].value,
                        name: profile.displayName,
                        googleId: profile.id,
                        isVerified: true,
                    });
                }

                // Generate token
                const token = generateToken(user);

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