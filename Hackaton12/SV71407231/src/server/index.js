import http from "node:http";

let listSales = [];

const server = http.createServer((req, res) => {
    const { method, url } = req;
    res.setHeader("Content-Type", "application/json");

    if (method === "GET" && url === "/api/lista") {
        res.writeHead(200);
        return res.end(JSON.stringify(listSales));
    }

    if (method === "GET" && url === "/api/lista/pendientes") {
        const filtered = listSales.filter(item => item.esCompletado === false);
        res.writeHead(200);
        return res.end(JSON.stringify(filtered));
    }

    if (method === "GET" && url === "/api/lista/completados") {
        const filtered = listSales.filter(item => item.esCompletado === true);
        res.writeHead(200);
        return res.end(JSON.stringify(filtered));
    }

    if (method === "POST" && url === "/api/lista") {
        let body = "";

        req.on("data", (chunk) => {
        body += chunk.toString();
        });

        req.on("end", () => {
        try {
            const { name, description, date, esCompletado } = JSON.parse(body);

            if (!name || !description || !date || typeof esCompletado !== "boolean") {
            res.writeHead(400);
            return res.end(JSON.stringify({ message: "faltan campos" }));
            }

            const newItem = { name, description, date, esCompletado };
            listSales.push(newItem);

            res.writeHead(201);
            return res.end(JSON.stringify(newItem));

        } catch (error) {
            res.writeHead(400);
            return res.end(JSON.stringify({ message: "JSON inválido" }));
        }
        });

        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: "endpoint not found" }));
});

server.listen(3000, () => console.log("http://localhost:3000"));