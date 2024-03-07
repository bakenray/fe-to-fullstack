const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { Server, Router } = require("./http-interceptor-sqlite");

const dbFile = path.resolve(__dirname, "./database/todolist.db");
let db = null;

const app = new Server(); //创建HTTP服务器
const router = new Router(); //创建路由中间件

// 请求路径log
app.use(async ({ req }, next) => {
  console.log(`${req.method} ${req.url}`);
  await next();
});

// 数据库连接
app.use(async (ctx, next) => {
  if (!db) {
    //如果数据库连接未创建，就创建一个
    db = await open({
      filename: dbFile,
      dirver: sqlite3.cached.Database,
    });
  }
  ctx.database = db; //将db挂在ctx上下文对象的database属性上
  await next();
});
/*
如果请求的路径是/list，则从todo表中获取所有任务数据
*/
app.use(
  router.get("/list", async ({ database, route, res }, next) => {
    res.setHeader("Contype-Type", "application/json");
    const { getList } = require("./model/todolist");
    const result = await getList(database); //获取任务数据
    res.body = { data: result };
    await next();
  })
);

/*
如果路径不是/list, 则返回'<h1>Not Found</h1>'文本
*/
app.use(
  router.all(".*", async ({ params, req, res }, next) => {
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
