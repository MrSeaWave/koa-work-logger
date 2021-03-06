import appRoot from 'app-root-path';
import path from 'path';
const pathResolve = path.resolve;
// eslint-disable-next-line no-unused-vars
const pathJoin = path.join;
// eslint-disable-next-line no-unused-vars
const rootPath = pathResolve(__dirname);

// 在根目录下创建日志文件夹
const baseLogPath = pathResolve(appRoot.path, './logs');

// 错误日志目录
const errorPath = '/error';
// 错误日志文件名
const errorFileName = 'error';
// 错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + '/' + errorFileName;

// 响应日志目录
const responsePath = '/response';
// 响应日志文件名
const responseFileName = 'response';
// 响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + '/' + responseFileName;

// 外部调用的日志目录
const outsidePath = '/outside';
// 响应日志文件名
const outsideFileName = 'outsideFile';
// 响应日志输出完整路径
const outsideLogPath = baseLogPath + outsidePath + '/' + outsideFileName;

export const logConfig = {
  // 定义两个输出源（appenders）
  appenders: {
    // 错误日志
    errorLogger: {
      // logger名称
      type: 'dateFile', // 日志类型,输出到日期文件
      filename: errorLogPath, // 日志输出位置
      alwaysIncludePattern: true, // 是否总是有后缀名
      pattern: 'yyyy-MM-dd-hh.log', // 后缀，每小时创建一个新的日志文件
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
    default: {
      appenders: ['resLogger', 'errorLogger', 'outsideLogger'],
      level: 'info'
    }, // 默认log类型，输出到控制台 log文件 log日期文件 且登记大于info即可,必须添加！！！
    errorLogger: { appenders: ['errorLogger'], level: 'error' }, // error 等级log 单独输出到error文件中
    resLogger: { appenders: ['resLogger'], level: 'info' }, // 输出响应事件
    outsideLogger: { appenders: ['outsideLogger'], level: 'info' } // 外部调用的日志打印
  },

  // 设置log输出的根目录
  baseLogPath: baseLogPath
};
