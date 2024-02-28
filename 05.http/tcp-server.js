const { match } = require("assert");
const net = require("net");

function responseData(str, status = 200, desc = "OK") {
  return `HTTP/1.1 ${status} ${desc}
Connection: keep-alive
Date: ${new Date()}
Content-Length: ${str.length}
Content-Type: text/html

${str}`;
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const matched = data.toString("utf-8").match(/^GET ([/\w]+) HTTP/);
    if (matched) {
      const path = matched[1];
      if (path === "/") {
        socket.write(responseData("<h1>Hello World</h1>"));
      } else {
        socket.write(responseData("<h1>Not Found</h1>", 404, "NOT FOUND"));
      }
    }
    // console.log(`DATA:\n\n${data}`);
  });
  socket.on("close", () => {
    console.log("connection closed, goodbye! \n\n\n");
  });
});

server.on("error", (err) => {
  throw err;
});

server.listen(
  {
    host: "0.0.0.0",
    port: 8080,
  },
  () => {
    console.log("opened server on", server.address());
  }
);
