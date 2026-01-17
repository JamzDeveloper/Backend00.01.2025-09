import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import http from "http";
import { Server, Socket } from "socket.io";
import bodyParser from "body-parser";
import passport from "passport";
import bcrypt from "bcrypt";
import session from "express-session";
import type { RowDataPacket } from "mysql2";
import con from "./database/db";
import "./passport";

type GoogleProfile = {
    email?: string;
};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = Number(process.env.PORT) || 3000;
const SECRET = process.env.SECRET ?? "";

app.use(express.static(path.join(process.cwd(), "src", "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

let username: string | undefined;
const connections: Socket[] = [];
let email: string | undefined;

app.get("/", (req, res) => {
    authenticate(req, res);
});

app.get("/google", passport.authenticate("google", { scope: ["email"] }));

app.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/failed" }),
    (req, res) => {
        const profile = req.user as GoogleProfile | undefined;
        console.log(profile?.email);
        email = profile?.email;
        res.redirect("/success");
    }
);

app.get("/logout", (req, res) => {
    console.log("llego el logout");
    if (req.session) {
        req.session.user = undefined;
        req.session.destroy(() => {});
    }
    res.redirect("/login");
});
app.get("/login", (req, res) => {
    authenticate(req, res);
});

app.post("/login", (req, res) => {
    login(req, res);
});

function login(req: Request, res: Response): void {
    const post = req.body as { user?: string; password?: string };
    username = post.user;
    const password = post.password;
    console.log(req.body);
    const sql = `select * from login where usermane = '${username}' `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        const rows = result as RowDataPacket[];
        console.log(rows);
        if (rows.length === 1) {
            const jsonString = JSON.stringify(rows);
            const jsonData = JSON.parse(jsonString) as Array<{ password?: string }>;
            if (password == jsonData[0]?.password) {
                if (req.session) {
                    req.session.user = post.user;
                }
                username = post.user;
                res.redirect("/chat_start");
            } else {
                res.redirect("/login");
            }
        } else {
            res.redirect("/login");
        }
    });
}


app.get("/success", (req, res) => {
    const safeEmail = email ?? "";
    const sql = `REPLACE INTO login (usermane,password) VALUES('${safeEmail}', 'oauth');`;
    con.query(sql, (err) => {
        if (err) throw err;
        if (req.session) {
            req.session.user = safeEmail;
        }
        username = safeEmail;
        res.redirect("/chat_start");
    });
});

app.get("/chat_start", (req, res) => {
    authenticate(req, res);
});

function authenticate(req: Request, res: Response): void {
    if (!req.session?.user) {
        res.sendFile(path.join(process.cwd(), "src", "public", "login.html"));
    } else {
        username = req.session.user;
        res.sendFile(path.join(process.cwd(), "src", "public", "chat.html"));
    }
}
function chat_start(): void {
    // ===================================Sockets starts  =========================
    io.on("connection", (socket) => {
        connections.push(socket);
        //console.log("Connected:  %s Socket running", connections.length);
        // ====================Disconnect==========================================
        socket.on("disconnect", () => {
            connections.splice(connections.indexOf(socket), 1);
            //console.log('Disconnected : %s sockets running', connections.length);
        });
        socket.on("initial-messages", () => {
            const sql = "SELECT * FROM message ";
            con.query(sql, (err, result) => {
                if (err) throw err;
                const jsonMessages = JSON.stringify(result);
                // console.log(jsonMessages);
                io.emit("initial-message", { msg: jsonMessages });
            });
        });

        socket.on("username", () => {
            socket.emit("username", { username });
            //io.emit('username', {username: username});
        });
        socket.on("send-message", (data: string, user: string) => {
            //console.log(user);
            const sql =
                "INSERT INTO message (message , user) VALUES ('" +
                data +
                "' , '" +
                user +
                "')";
            con.query(sql, (err) => {
                if (err) throw err;
                //console.log("1 record inserted");
            });
            io.emit("new-message", { msg: data, username: user });
        });

        socket.on("typing", (data: string, user: string) => {
            //console.log(user);
            io.emit("typing", { msg: data, username: user });
        });
    });
}
chat_start();

server.listen(PORT, () => {
    console.log("Servidor iniciado");
});
