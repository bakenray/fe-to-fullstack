const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
// import mime from "mime";
const server = http.createServer((req, res) => {
  // req.url转换为文件路径，同时拼接www目录路径进来，join保留相对路径
  // path.resolve解析请求的路径，resolve得到绝对路径
  let filePath = path.resolve(
    __dirname,
    path.join("www", url.fileURLToPath(`file:/${req.url}`))
  );
  // 判断文件是否存在
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath); //得到文件路径stats对象
    // 判断是否是目录，如果是目录，join起来，拼接html后缀
    if (stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (fs.existsSync(filePath)) {
      const { ext } = path.parse(filePath);
      res.writeHead(200, { "Content-Type": mime.getType(ext) });
      //以流的方式读取文件内容
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res); // pipe 方法可以将两个流连接起来，这样数据就会从上游流向下游
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>Not Found</h1>");
  }
});

server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});
server.listen(8080, () => {
  console.log("opened server on", server.address());
});
