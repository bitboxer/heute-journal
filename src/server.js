import Koa from 'koa';
import Router from 'koa-router';

import schedule from './schedule.mjs';

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  const result = await schedule();

  ctx.body = result;
});

app
  .use(router.routes())
  .listen(process.env.PORT || 4000);
