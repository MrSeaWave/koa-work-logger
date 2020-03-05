/**
 * test server
 */

require('@babel/register');
require('@babel/polyfill');

const Koa = require('koa');
const Boom = require('@hapi/boom');
const _ = require('koa-route');
const { koaLogger } = require('../src/index');

module.exports = function (opts) {
  const app = new Koa();
  app.use(koaLogger);

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
