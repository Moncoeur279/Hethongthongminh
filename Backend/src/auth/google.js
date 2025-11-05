// Backend/auth/google.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");
const bcrypt = require("bcryptjs");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_REDIRECT, // vd: http://localhost:3030/auth/google/callback
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || email?.split("@")[0] || "User";
        if (!email) return done(new Error("No email from Google"));

        let user = await User.findOne({ where: { email } });
        if (!user) {
          const rnd = (
            Math.random().toString(36).slice(2) + Date.now().toString(36)
          ).slice(0, 20);
          const passwordHash = await bcrypt.hash(rnd, 12);
          user = await User.create({ name, email, passwordHash });
        }
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);

module.exports = passport;
