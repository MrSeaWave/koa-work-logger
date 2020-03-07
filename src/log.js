import logUtil from './logUtil';
import chalk from 'chalk';

// 如果错误被try...catch捕获，就不会触发error事件。这时，必须调用ctx.app.emit()，手动释放error事件，才能让监听函数生效
const handleLogger = ({ succeedOnChange, errOnChange }) => async (
  ctx,
  next
) => {
  // 响应开始时间
  const start = new Date();
  // 请求处理完毕的时刻 减去 开始处理请求的时刻 = 处理请求所花掉的时间
  let ms;
  const bodyStr =
    ctx.request.method === 'GET' ? '' : JSON.stringify(ctx.request.body);
  try {
    await next();

    ms = new Date() - start;

    // 控制台打印信息，也可用console.log
    console.log(
      chalk.blue('%s') +
        ` ${ctx.request.method} ${ctx.request.url}` +
        ' ' +
        '%s',
      new Date().toLocaleString(),
      bodyStr
    );

    // 记录响应日志
    logUtil.logResponse(ctx, ms);

    // 触发成功响应的回调
    succeedOnChange && succeedOnChange(ctx);
  } catch (error) {
    // TODO 页面暂时显示报错原因，之后去掉
    ctx.response.body = {
      message: error.message
    };

    ms = new Date() - start;

    // 在控制台打印错误日志
    console.log(
      chalk.red('%s') +
        ` ${ctx.request.method} ${ctx.request.url}` +
        ' ' +
        '%s' +
        ' ' +
        'error message:' +
        ' ' +
        chalk.red('%s'),
      new Date().toLocaleString(),
      bodyStr,
      error.message
    );

    // 记录异常日志
    logUtil.logError(ctx, error, ms);

    // 触发error事件
    ctx.app.emit('error', error, ctx);
    // 触发响应失败的回调
    errOnChange && errOnChange(ctx, error);
  }
};

/**
 * @desc 日志
 * @param {Object} opts - 参数
 * @param {function} [opts.succeedOnChange] - 响应日志的回调
 * @param {function} [opts.errOnChange] - 错误日志的回调
 * */
const logger = (opts = {}) => {
  const { succeedOnChange, errOnChange } = opts;
  return handleLogger({ succeedOnChange, errOnChange });
};
export default logger;
