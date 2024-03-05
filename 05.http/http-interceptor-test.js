const Interceptor = require("./http-interceptor");

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const inter = new Interceptor();

const task = function (id) {
  return async (ctx, next) => {
    try {
      console.log(`task ${id} begin`);
      ctx.count++;
      await wait(1000);
      console.log(`count: ${ctx.count}`);
      await next();
      console.log(`task ${id} end`);
    } catch (ex) {
      throw new Error(ex);
    }
  };
};
inter.use(task(0));
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));
inter.use(task(4));

// 从外到里依次执行拦截切面
inter.run({ count: 0 });
