// 测试文件
import chalk from 'chalk';
import request from 'supertest';
import sinon from 'sinon';

let app, sandbox, log;
describe('koa-worker-logger', () => {
  beforeAll(done => {
    app = require('./test-server')();
    done();
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    log = sandbox.spy(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('测试一个请求 && console.log 是否被调用', async done => {
    // expect.assertions(2);

    const res = await request(app.callback()).get('/200');
    expect(res.status).toBe(200);
    expect(res.text).toBe('hello world');
    expect(log.called).toBeTruthy();
    done();
  });

  it('测试一个请求body', async done => {
    // expect.assertions(2);

    const res = await request(app.callback()).get('/users');
    expect(res.body).toEqual({ name: '汤姆' });

    done();
  });

  it('测试log打印日志', async done => {
    // eslint-disable-next-line no-unused-vars
    const res = await request(app.callback()).get('/200');
    expect(
      log.calledWith(chalk.blue('%s') + ' GET /200', sinon.match.any)
    ).toBeTruthy();
    done();
  });

  it('测试404', async done => {
    await request(app.callback()).get('/404');
    expect(log.called).toBeFalsy();
    done();
  });

  it('测试500', async done => {
    await request(app.callback()).get('/500');
    expect(log.called).toBeFalsy();
    done();
  });

  it('测试500-boom', async done => {
    await request(app.callback()).get('/500-boom');
    expect(log.called).toBeFalsy();
    done();
  });

  it('测试error', async done => {
    await request(app.callback()).get('/error');
    expect(log.called).toBeFalsy();
    done();
  });
});

describe('koa-worker-logger-opts', () => {
  // 待修改补充log
});
