import http from "node:http";
import url from "node:url";

let listSales = [];

const Server = http.createServer();

Server.on("request", (request, res) => {
  const parseUrl = url.parse(request.url, true);

  const path = parseUrl.pathname;
  console.log("path", path);
  console.log("method", request.method);

  if (request.method === "GET" && path == "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        message: "Api listening in port 4000",
        data: {},
      })
    );
  }

  if (request.method === "GET" && path == "/api/lista") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        message: "ok",
        data: listSales,
      })
    );
  }

  if (request.method === "POST" && path == "/api/lista") {
    try {
      let body = "";

      request.on("data", (chunk) => {
        body += chunk.toString();
      });

      return request.on("end", () => {
        const { name, description, date, esCompletado } = JSON.parse(body);
        
        if (!name || !description || !date ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "faltan campos",
              data: {},
            })
          );
        }

        const data = {
          name,
          description,
          date,
          esCompletado:esCompletado??false,
        };
        listSales.push(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            message: "created success",
            data: data,
          })
        );
      });
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          message: "Internal server error",
          data: {},
        })
      );
    }
  }

  if (request.method === "GET" && path == "/api/pendientes") {
    const filtrado = listSales.filter((item) => item.esCompletado === false);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        message: "ok",
        data: filtrado,
      })
    );
  }

  if (request.method === "GET" && path == "/api/completados") {
    const filtrado = listSales.filter((item) => item.esCompletado === true);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        message: "ok",
        data: filtrado,
      })
    );
  }


  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "Not found",
      data: {},
    })
  );
});

Server.listen(4000, () => {
  console.log("listening in port 4000");
});