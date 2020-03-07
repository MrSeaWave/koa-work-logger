# koa-work-logger

koa 日志

在根目录下打印 log 日志文件夹

## 安装

```bash
$ npm install sea-koa-work-logger
```

## 使用

```js
const { koaLogger } = require("sea-koa-work-logger");
const Koa = require("koa");

const app = new Koa();
app.use(koaLogger());
```

## 接口

|     接口名称      |          类型          |     默认值     | 描述 | 注意 |
| :---------------: | :--------------------: | :------------: | :--: | :--: |
| `succeedOnChange` |    `function(ctx)`     | 请求成功的回调 |  -   |
|   `errOnChange`   | `function(ctx,errror)` | 请求失败的回调 |  -   |

## 对外实例

- logOutside : `function(msg)` 将外部信息打印

```js
const { koaLogger, logOutside } = require("sea-koa-work-logger");
const Koa = require("koa");

const app = new Koa();
app.use(koaLogger());
app.use(
  _.get("/outside", function(ctx) {
    logOutside("调用成功！！！");
    ctx.body = "调用成功";
  })
);
```
