const http = require("http");
const Interceptor = require("./http-interceptor.js");
const url = require("url");
const path = require("path");

//Server
class Server {
  constructor() {
    const interceptor = new Interceptor();
    this.server = http.createServer(async (req, res) => {
      await interceptor.run({ req, res }); //执行注册的拦截函数
      if (!res.writableFinished) {
        let body = res.body || "200 OK";
        if (body.pipe) {
          body.pipe(res);
        } else {
          if (
            typeof body !== "string" &&
            res.getHeader("Content-Type") === "application/json"
          ) {
            body = JSON.stringify(body);
          }
          res.end(body);
        }
      }
    });
    this.server.on("clientError", (err, socket) => {
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });
    this.interceptor = interceptor;
  }
  listen(opts, cb = () => {}) {
    if (typeof opts === "number") opts = { port: opts };
    opts.host = opts.host || "0.0.0.0";
    console.log(`Starting up http-server http://${opts.host}:${opts.port}`);
    this.server.listen(opts, () => cb(this.server));
  }
  //向http服务器添加不同功能的拦截切面
  use(aspect) {
    return this.interceptor.use(aspect);
  }
}

// Router
/*
 *@rule 路径规则
 *@pathname 路径名
 */
function check(rule, pathname) {
  rule = rule.split(path.sep).join("/"); //windows转换分隔符
  const paraMatched = rule.match(/:[^/]+/g); //mac
  const ruleExp = new RegExp(`^${rule.replace(/:[^/]+/g, "([^/]+)")}$`); //mac

  const ruleMatched = pathname.match(ruleExp);

  if (ruleMatched) {
    const ret = {};
    if (paraMatched) {
      for (let i = 0; i < paraMatched.length; i++) {
        ret[paraMatched[i].slice(1)] = ruleMatched[i + 1];
      }
    }
    return ret;
  }
  return null;
}

function route(method, rule, aspect) {
  return async (ctx, next) => {
    const req = ctx.req;

    if (!ctx.url) ctx.url = new url.URL(`http://${req.headers.host}${req.url}`);
    const checked = check(rule, ctx.url.pathname);
    if (!ctx.route && (method === "*" || req.method === method) && !!checked) {
      ctx.route = checked;
      await aspect(ctx, next);
    } else {
      await next();
    }
  };
}

class Router {
  constructor(base = "") {
    this.baseURL = base;
  }
  get(rule, aspect) {
    return route("GET", path.join(this.baseURL, rule), aspect);
  }
  post(rule, aspect) {
    return route("POST", path.join(this.baseURL, rule), aspect);
  }
  put(rule, aspect) {
    return route("PUT", path.join(this.baseURL, rule), aspect);
  }
  delete(rule, aspect) {
    return route("DELETE", path.join(this.baseURL, rule), aspect);
  }
  all(rule, aspect) {
    return route("*", path.join(this.baseURL, rule), aspect);
  }
}
module.exports = { Server, Router };
