/**
 * test server
 */

require('@babel/register');
require('@babel/polyfill');

const Koa = require('koa');
const koaBody = require('koa-body');
const Boom = require('@hapi/boom');
const _ = require('koa-route');
const { koaLogger, logOutside } = require('../src/index');

module.exports = function (opts) {
  const app = new Koa();
  app.use(koaLogger(opts));

  app.use(koaBody());

  app.use(
    _.get('/users', function (ctx) {
      ctx.body = { name: '汤姆' };
    })
  );

  app.use(
    _.get('/200', function (ctx) {
      ctx.body = 'hello world';
    })
  );

  app.use(
    _.get('/200?Id=1', function (ctx) {
      ctx.body = 'hello world';
    })
  );

  app.use(
    _.post('/post-200', function (ctx) {
      ctx.body = ctx.request.body;
    })
  );

  app.use(
    _.get('/outside', function (ctx) {
      logOutside('调用成功！！！');
      ctx.body = '调用成功';
    })
  );

  app.use(
    _.get('/301', function (ctx) {
      ctx.status = 301;
    })
  );

  app.use(
    _.get('/304', function (ctx) {
      ctx.status = 304;
    })
  );

  app.use(
    _.get('/404', function (ctx) {
      ctx.throw(404, Date.now() + '---->not found');
    })
  );

  app.use(
    _.get('/500', function (ctx) {
      ctx.throw(500, 'server-error');
    })
  );

  app.use(
    _.get('/500-boom', function (ctx) {
      ctx.throw(Boom.badImplementation('terrible implementation'));
    })
  );

  app.use(
    _.get('/error', function (ctx) {
      throw new Error('oh no 错了！！！！！！！');
    })
  );

  return app;
};
