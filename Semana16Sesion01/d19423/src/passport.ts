import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENTID,
            clientSecret: process.env.SECRETID,
            callbackURL: process.env.CALLBACKURL,
            passReqToCallback: true
        },
        (request, accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);
