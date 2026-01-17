import mysql from 'mysql2';

const con = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASS,
    database: process.env.MYSQLBBDD
});

con.connect((err) => {
    if (err) throw err;
    let sql =
        "create table if not exists message(id int(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, message VARCHAR(2550), user VARCHAR(205))";
    con.query(sql, (queryErr) => {
        if (queryErr) throw queryErr;
        sql =
            "create table if not exists login(id int(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, usermane varchar(250) unique, password VARCHAR(250))";
        con.query(sql, (finalErr) => {
            if (finalErr) throw finalErr;
        });
    });
});

export default con;
