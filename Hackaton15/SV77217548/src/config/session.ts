import session from "express-session";
import env from "./env";

const sessionMiddleware = session({
    name: "sid",
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 15,
    },
});

export default sessionMiddleware;
