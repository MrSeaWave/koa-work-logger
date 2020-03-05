import logUtil from './logUtil';
import chalk from 'chalk';

// 如果错误被try...catch捕获，就不会触发error事件。这时，必须调用ctx.app.emit()，手动释放error事件，才能让监听函数生效
const logger = async (ctx, next) => {
  // 响应开始时间
  const start = new Date();
  // 请求处理完毕的时刻 减去 开始处理请求的时刻 = 处理请求所花掉的时间
  let ms;
  try {
    await next();

    ms = new Date() - start;

    // 控制台打印信息，也可用console.log
    console.log(
      chalk.blue('%s') + ` ${ctx.request.method} ${ctx.request.url}`,
      Date.now()
    );

    // 记录响应日志
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    // TODO 页面暂时显示报错原因，之后去掉
    ctx.response.body = {
      message: error.message
    };

    ms = new Date() - start;

    // 记录异常日志
    logUtil.logError(ctx, error, ms);

    // 触发error事件
    ctx.app.emit('error', error, ctx);
  }
};
export default logger;
