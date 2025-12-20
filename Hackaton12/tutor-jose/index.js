import http from "node:http";
import url from "node:url";

let listSales = [];

const Server = http.createServer();

Server.on("request", (request, res) => {
  const parseUrl = url.parse(request.url, true);

  const path = parseUrl.pathname;
  console.log("path", path);
  console.log("method", request.method);

  if (request.method === "GET" && path == "/api/lista") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        message: "ok",
        data: listSales,
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
