const Server = require("./http-interceptor-server");
const Router = require("./http-interceptor-router");
const app = new Server();
const router = new Router();

// app.use(async ({ res }, next) => {
//   res.setHeader("Content-Type", "text/html");
//   res.body = "<h1>Hello World</h1>";
//   await next();
// });

app.use(({ req }, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(require("./http-aspect-param"));

app.use(
  router.get("/coronavirus/index", async ({ route, res }, next) => {
    const { getCoronavirusKeyIndex } = require("./module/mock");
    const index = getCoronavirusKeyIndex();
    res.setHeader("Content-Type", "application/json");
    res.body = { data: index };
    await next();
  })
);
app.use(
  router.get("/coronavirus/:date", async ({ route, res }, next) => {
    const { getCoronavirusByDate } = require("./module/mock");
    const data = getCoronavirusByDate(route.date);
    res.setHeader("Content-Type", "application/json");
    res.body = { data };
    await next();
  })
);

app.use(
  router.get("/test/:course/:lecture", async ({ route, res }, next) => {
    res.setHeader("Content-Type", "application/json");
    res.body = route;
    await next();
  })
);

// 默认路由
app.use(
  router.all(".*", async ({ req, res }, next) => {
    res.setHeader("Content-Type", "text/html");
    res.body = "<h1>Not Found</h1>";
    res.statusCode = 404;
    await next();
  })
);

app.listen({
  port: 9090,
  host: "0.0.0.0",
});
