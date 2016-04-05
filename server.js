'use strict';

const koa = require('koa');
const router = require('koa-router')();
const sendfile = require('koa-sendfile');
const koaStatic = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-body-parser');
const path = require('path');
const fs = require('fs-promise');
const mkdirp = require('mkdirp-promise');

const nextID = function() {
  let idCounter = 1;
  return function() { return String(idCounter++); };
}();

router.get('/', function *() {
  yield sendfile(this, path.join(__dirname, 'sandbox.html'));
});

router.get('/:id/edit', function *() {
  console.log(this.params);
  yield sendfile(this, path.join(__dirname, 'sandbox.html'));
});

router.get('/:id', function *() {
  let id = this.params.id;
  let accepts = this.accepts('html', 'json');
  if (accepts === 'json') {
    let dirname = path.join(__dirname, 'sandboxes', id);
    let js = (yield fs.readFile(path.join(dirname, 'index.js')))
      .toString();
    let html = (yield fs.readFile(path.join(dirname, 'index.html')))
      .toString();
    let css = (yield fs.readFile(path.join(dirname, 'index.css')))
      .toString();
    this.body = {
      id: id,
      js: js,
      html: html,
      css: css
    };
  } else {
    if (this.request.path.match(/\/$/)) {
      yield sendfile(this, path.join(sandboxDir(id), 'index.html'));
    } else {
      this.redirect(`/${id}/`);
    }
  }
});

router.put('/:id', function *() {
  let id = this.params.id;
  let body = this.request.body;
  let dirname = sandboxDir(id);
  yield mkdirp(dirname);
  yield fs.writeFile(path.join(dirname, 'index.js'), body.js);
  yield fs.writeFile(path.join(dirname, 'index.html'), body.html);
  yield fs.writeFile(path.join(dirname, 'index.css'), body.css);
  this.body = 'Ok';
});

router.post('/create', function *() {
  let body = this.request.body;
  let id = nextID();
  let dirname = sandboxDir(id);
  yield mkdirp(dirname);
  yield fs.writeFile(path.join(dirname, 'index.js'), body.js);
  yield fs.writeFile(path.join(dirname, 'index.html'), body.html);
  yield fs.writeFile(path.join(dirname, 'index.css'), body.css);
  this.body = {
    id: id
  };
});

function sandboxDir(id) {
  return path.join(__dirname, 'sandboxes', id);
}

const app = koa();

app.use(function *(next) {
  console.log(this.request.method, this.request.path);
  yield next;
});
app.use(bodyParser());
app.use(mount('/assets', koaStatic(path.join(__dirname, 'static'))));
app.use(router.routes());
app.use(koaStatic(path.join(__dirname, 'sandboxes'))); 

app.listen(3000);
