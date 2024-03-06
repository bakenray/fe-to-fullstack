const url = require("url");
const querystring = require("querystring");

module.exports = async function (ctx, next) {
  const { req } = ctx;
  const urlObj = new url.URL(`http://${req.headers.host}${req.url}`);
  ctx.params = Object.fromEntries(new URLSearchParams(urlObj.search).entries());
  await next();
};
