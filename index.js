'use strict';
const http = require('http');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const staticDir = require('koa-static');
const body = require('koa-body');
const convert = require('koa-convert');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const port = process.env.PORT || '9007';
const Koa = require('koa');
const app = new Koa();
const server = http.createServer(app.callback());
var router = require('./routers');

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);

  var start = new Date().getTime();
  var execTime = null;
  await next();
  execTime = new Date().getTime() - start;
  ctx.response.set('x-Response-Time', `${execTime}ms`);
});

app.use(json({pretty: false, param: 'pretty'}));

app.use(staticDir(__dirname + '/../dist'));
app.use(staticDir(__dirname + '/public'));

app.use(body({
    multipart: true,
}));

app.use(bodyParser());

router(app);

server.listen(port, () => {
    console.log(`app started in ${port}`);
});

