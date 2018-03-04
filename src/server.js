import Koa from 'koa';
import Router from 'koa-router';
import KoaViews from 'koa-views';
import Path from 'path';

import schedule from './schedule.mjs';
import mediathek from './mediathek.mjs';

const app = new Koa();
const router = new Router();

app.use(KoaViews(Path.join(__dirname, '/../views'), {
  extension: 'ejs',
  map: {
    html: 'ejs',
  },
}));

router.get('/', async (ctx) => {
  const result = await Promise.all([
    schedule(),
    mediathek(),
  ]);

  await ctx.render('index', {
    schedule: result[0],
    mediathek: result[1],
  });
});

app
  .use(router.routes())
  .listen(process.env.PORT || 4000);
