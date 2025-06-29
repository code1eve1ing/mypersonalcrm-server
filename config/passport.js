const { Strategy: GoogleStrategy } = require("passport-google-oauth20")
const passport = require('passport');
const { User } = require("../models");
const { generateToken } = require("../utils/jwt");

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
                const email = profile.emails?.[0].value;
                let user = await User.findOne({ where: { email } });

                if (!user) {
                    user = await User.create({
                        email,
                        agreedToPolicy: true,
                    });
                }

                const token = generateToken({ id: user.id });
                return done(null, { user, token });
            } catch (err) {
                return done(err);
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