class Interceptor {
  constructor() {
    this.aspects = []; //存储拦截切面
  }
  //注册拦截切面
  use(/* async*/ functor) {
    this.aspects.push(functor);
    return this;
  }
  //执行注册的拦截切面
  async run(context) {
    const aspects = this.aspects;
    //将注册的拦截切面包装成一个洋葱模型
    const proc = aspects.reduceRight(
      function (a, b) {
        // eslint-disable-line
        return async () => {
          await b(context, a);
        };
      },
      () => Promise.resolve()
    );
    try {
      await proc(); //从外到里执行这个洋葱模型
    } catch (ex) {
      console.error(ex.message);
    }
    return context;
  }
}
module.exports = Interceptor;
