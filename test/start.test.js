// 启动服务测试
const request = require('supertest');
const app = require('./test-server')();

request(app.listen())
  .get('/200')
  .expect(200)
  .end(function (err, res) {
    if (err) throw err;
  });
