const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const moment = require('moment');

const app = new Koa();

app.use(cors());
app.use(koaBody({json: true}));

let posts = [];

let nextId = 1;

const router = new Router();

router.get('/posts', async (ctx, next) => {
    ctx.response.body = posts;
});

router.post('/posts', async (ctx, next) => {
    const { content } = JSON.parse(ctx.request.body);
    const id = +JSON.parse(ctx.request.body).id

    if (id !== 0) {
        posts = posts.map(o => o.id !== id ? o : {...o, content: content});
        console.log(posts);
        console.log({...JSON.parse(ctx.request.body)});
        ctx.response.status = 204;
        // return;
    }
    posts.push({content, id: nextId++, created: moment().format('HH:mm:ss')});
    ctx.response.status = 204;
});

router.delete('/posts/:id', async(ctx, next) => {
    const postId = Number(ctx.params.id);
    const index = posts.findIndex(o => o.id === postId);
    if (index !== -1) {
        posts.splice(index, 1);
    }
    ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));