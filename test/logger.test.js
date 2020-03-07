// 测试文件
import chalk from 'chalk';
import request from 'supertest';
import sinon from 'sinon';

let app, sandbox, log, opts, succeedOnChangeSpy, errOnChangeSpy;

const optsFunc = {
  succeedOnChange: ctx => {},
  errOnChange: (ctx, error) => {}
};
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

  it('测试请求返回body', async done => {
    // expect.assertions(2);

    const res = await request(app.callback()).get('/users');
    expect(res.body).toEqual({ name: '汤姆' });

    done();
  });

  it('测试请求带query', async done => {
    // expect.assertions(2);

    const res = await request(app.callback()).get('/200?Id=1');
    expect(log.called).toBeTruthy();
    done();
  });

  it('测试post请求传参数', async done => {
    // expect.assertions(2);

    const res = await request(app.callback())
      .post('/post-200')
      .send({ name: 'JOHN' })
      .set('Accept', 'application/json');
    expect(res.body).toEqual({ name: 'JOHN' });
    expect(log.called).toBeTruthy();
    done();
  });

  it('测试log打印日志', async done => {
    // eslint-disable-next-line no-unused-vars
    const res = await request(app.callback()).get('/200');
    expect(
      log.calledWith(
        chalk.blue('%s') + ' GET /200' + ' ' + '%s',
        sinon.match.any,
        ''
      )
    ).toBeTruthy();
    done();
  });

  it('测试404', async done => {
    await request(app.callback()).get('/404');
    expect(
      log.calledWith(
        chalk.red('%s') +
          ' GET /404' +
          ' ' +
          '%s' +
          ' ' +
          'error message:' +
          ' ' +
          chalk.red('%s'),
        sinon.match.any,
        '',
        sinon.match.any
      )
    ).toBeTruthy();
    done();
  });

  it('测试500', async done => {
    await request(app.callback()).get('/500');
    expect(log.called).toBeTruthy();
    done();
  });

  it('测试500-boom', async done => {
    await request(app.callback()).get('/500-boom');
    expect(log.called).toBeTruthy();
    done();
  });

  it('测试error', async done => {
    await request(app.callback()).get('/error');
    expect(log.called).toBeTruthy();
    done();
  });
});

describe('koa-worker-logger-opts', () => {
  beforeAll(done => {
    opts = {
      succeedOnChange: ctx => {
        optsFunc.succeedOnChange(ctx);
      },
      errOnChange: (ctx, error) => {
        optsFunc.errOnChange(ctx, error);
      }
    };
    app = require('./test-server')(opts);
    done();
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    succeedOnChangeSpy = sandbox.spy(optsFunc, 'succeedOnChange');
    errOnChangeSpy = sandbox.spy(optsFunc, 'errOnChange');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('测试一个请求 && succeedOnChange 是否被调用', async done => {
    // expect.assertions(2);

    const res = await request(app.callback()).get('/200');
    expect(res.status).toBe(200);
    expect(res.text).toBe('hello world');
    expect(succeedOnChangeSpy.called).toBeTruthy();
    done();
  });

  it('测试404', async done => {
    await request(app.callback()).get('/404');
    expect(succeedOnChangeSpy.called).toBeFalsy();
    expect(errOnChangeSpy.called).toBeTruthy();
    done();
  });
});
