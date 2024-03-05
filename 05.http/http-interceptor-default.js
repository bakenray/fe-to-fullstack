const Server = require("./http-interceptor-server");
const Router = require("./http-interceptor-router");
const app = new Server();
const router = new Router();

// app.use(async ({ res }, next) => {
//   res.setHeader("Content-Type", "text/html");
//   res.body = "<h1>Hello World</h1>";
//   await next();
// });
app.use(
  router.all("/test/:course/:lecture", async ({ route, res }, next) => {
    res.setHeader("Content-Type", "application/json");
    res.body = route;
    await next();
  })
);
// 默认路由
app.use(
  router.all(".*", async ({ req, res }, next) => {
    res.setHeader("Content-Type", "text/html");
    res.body = "<h1>Hello World</h1>";
    await next();
  })
);

app.listen({
  port: 9090,
  host: "0.0.0.0",
});
