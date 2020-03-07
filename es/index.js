import { configure, getLogger } from 'log4js';
import fs from 'fs';
import appRoot from 'app-root-path';
import path from 'path';
import chalk from 'chalk';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var pathResolve = path.resolve; // eslint-disable-next-line no-unused-vars

var pathJoin = path.join; // eslint-disable-next-line no-unused-vars

var rootPath = pathResolve(__dirname); // 在根目录下创建日志文件夹

var baseLogPath = pathResolve(appRoot.path, './logs'); // 错误日志目录

var errorPath = '/error'; // 错误日志文件名

var errorFileName = 'error'; // 错误日志输出完整路径

var errorLogPath = baseLogPath + errorPath + '/' + errorFileName; // 响应日志目录

var responsePath = '/response'; // 响应日志文件名

var responseFileName = 'response'; // 响应日志输出完整路径

var responseLogPath = baseLogPath + responsePath + '/' + responseFileName; // 外部调用的日志目录

var outsidePath = '/outside'; // 响应日志文件名

var outsideFileName = 'outsideFile'; // 响应日志输出完整路径

var outsideLogPath = baseLogPath + outsidePath + '/' + outsideFileName;
var logConfig = {
  // 定义两个输出源（appenders）
  appenders: {
    // 错误日志
    errorLogger: {
      // logger名称
      type: 'dateFile',
      // 日志类型,输出到日期文件
      filename: errorLogPath,
      // 日志输出位置
      alwaysIncludePattern: true,
      // 是否总是有后缀名
      pattern: 'yyyy-MM-dd-hh.log',
      // 后缀，每小时创建一个新的日志文件
      path: errorPath // 自定义属性，错误日志的根目录

    },
    resLogger: {
      type: 'dateFile',
      filename: responseLogPath,
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd-hh.log',
      path: responsePath
    },
    outsideLogger: {
      type: 'dateFile',
      filename: outsideLogPath,
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd-hh.log',
      path: outsidePath
    }
  },
  // 设置logger名称对应的的日志等级
  categories: {
    "default": {
      appenders: ['resLogger', 'errorLogger', 'outsideLogger'],
      level: 'info'
    },
    // 默认log类型，输出到控制台 log文件 log日期文件 且登记大于info即可,必须添加！！！
    errorLogger: {
      appenders: ['errorLogger'],
      level: 'error'
    },
    // error 等级log 单独输出到error文件中
    resLogger: {
      appenders: ['resLogger'],
      level: 'info'
    },
    // 输出响应事件
    outsideLogger: {
      appenders: ['outsideLogger'],
      level: 'info'
    } // 外部调用的日志打印

  },
  // 设置log输出的根目录
  baseLogPath: baseLogPath
};

configure(logConfig); // 将配置添加到log4js中

var logUtil = {}; // 确定目录是否存在，如果不存在则创建目录

var createPath = function createPath(pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr);
    console.log("createPath:" + pathStr);
  }
}; // 初始化log相关目录


var initLogPath = function initLogPath() {
  // 创建log的根目录'logs'
  if (logConfig.baseLogPath) {
    // 创建log根目录
    createPath(logConfig.baseLogPath); // 根据不同的logType创建不同的子目录

    Object.values(logConfig.appenders).forEach(function (item) {
      if (item.path) {
        createPath(logConfig.baseLogPath + item.path);
      }
    });
  }
}; // 自动初始化log输出所需要的目录


initLogPath();
var errorLogger = getLogger('errorLogger');
var resLogger = getLogger('resLogger');
var outsideLogger = getLogger('outsideLogger'); // 封装错误日志

logUtil.logError = function (ctx, error, resTime) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime));
  }
}; // 封装响应日志


logUtil.logResponse = function (ctx, resTime) {
  if (ctx) {
    resLogger.info(formatRes(ctx, resTime));
  }
}; // 外部调用的日志打印封装


logUtil.logOutside = function (msg) {
  outsideLogger.info(formatOutside(msg));
}; // 格式化响应日志


var formatRes = function formatRes(ctx, resTime) {
  var logText = ''; // 响应日志开始

  logText += '\n' + '*************** response log start ***************' + '\n'; // 添加请求日志

  logText += formatReqLog(ctx.request, resTime); // 响应状态码

  logText += 'response status: ' + ctx.status + '\n'; // 响应内容

  logText += 'response body: ' + '\n' + JSON.stringify(ctx.body) + '\n'; // 响应日志结束

  logText += '*************** response log end ***************' + '\n';
  return logText;
}; // 格式化错误日志


var formatError = function formatError(ctx, err, resTime) {
  var logText = ''; // 错误信息开始

  logText += '\n*************** error log start ***************\n'; // 添加请求日志

  logText += formatReqLog(ctx.request, resTime); // 错误名称

  logText += "err name:" + err.name + "\n"; // 错误信息

  logText += "err message:" + err.message + "\n"; // 错误详情

  logText += "err stack:" + err.stack + "\n"; // 错误信息结束

  logText += '*************** error log end ***************\n';
  return logText;
}; // 格式化请求日志


var formatReqLog = function formatReqLog(req, resTime) {
  var logText = '';
  var method = req.method; // 访问方法

  logText += "request method: " + method + "\n"; // 请求原始地址

  logText += "request originalUrl: " + req.originalUrl + "\n"; // 客户端ip

  logText += "request client ip: " + req.ip + "\n"; // 请求参数

  if (method === 'GET') {
    logText += "request query: " + JSON.stringify(req.query) + "\n";
  } else {
    logText += "request body: \n" + JSON.stringify(req.body) + "\n";
  } // 服务器响应时间


  logText += "response time:" + resTime + "\n";
  return logText;
};

var formatOutside = function formatOutside(msg) {
  var logText = ''; // 外部调用打印信息开始

  logText += '\n*************** outside log start ***************\n'; // 外部打印信息

  logText += msg + "\n"; // 错误信息结束

  logText += '*************** outside log end ***************\n';
  return logText;
};

var logOutside = logUtil.logOutside;

var handleLogger = function handleLogger(_ref) {
  var succeedOnChange = _ref.succeedOnChange,
      errOnChange = _ref.errOnChange;
  return (/*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
        var start, ms, bodyStr;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // 响应开始时间
                start = new Date(); // 请求处理完毕的时刻 减去 开始处理请求的时刻 = 处理请求所花掉的时间

                bodyStr = ctx.request.method === 'GET' ? '' : JSON.stringify(ctx.request.body);
                _context.prev = 2;
                _context.next = 5;
                return next();

              case 5:
                ms = new Date() - start; // 控制台打印信息，也可用console.log

                console.log(chalk.blue('%s') + (" " + ctx.request.method + " " + ctx.request.url) + ' ' + '%s', new Date().toLocaleString(), bodyStr); // 记录响应日志

                logUtil.logResponse(ctx, ms); // 触发成功响应的回调

                succeedOnChange && succeedOnChange(ctx);
                _context.next = 19;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](2);
                // TODO 页面暂时显示报错原因，之后去掉
                ctx.response.body = {
                  message: _context.t0.message
                };
                ms = new Date() - start; // 在控制台打印错误日志

                console.log(chalk.red('%s') + (" " + ctx.request.method + " " + ctx.request.url) + ' ' + '%s' + ' ' + 'error message:' + ' ' + chalk.red('%s'), new Date().toLocaleString(), bodyStr, _context.t0.message); // 记录异常日志

                logUtil.logError(ctx, _context.t0, ms); // 触发error事件

                ctx.app.emit('error', _context.t0, ctx); // 触发响应失败的回调

                errOnChange && errOnChange(ctx, _context.t0);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 11]]);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
};
/**
 * @desc 日志
 * @param {Object} opts - 参数
 * @param {function} [opts.succeedOnChange] - 响应日志的回调
 * @param {function} [opts.errOnChange] - 错误日志的回调
 * */


var logger = function logger(opts) {
  if (opts === void 0) {
    opts = {};
  }

  var _opts = opts,
      succeedOnChange = _opts.succeedOnChange,
      errOnChange = _opts.errOnChange;
  return handleLogger({
    succeedOnChange: succeedOnChange,
    errOnChange: errOnChange
  });
};

export { logger as koaLogger, logOutside, logUtil };
