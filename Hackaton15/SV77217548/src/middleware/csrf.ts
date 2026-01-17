import csrf from "csurf";
import env from "../config/env";

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
    },
});

export default csrfProtection;
