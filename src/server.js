import Koa from 'koa';
import KoaRouter from 'koa-router';
import KoaViews from 'koa-views';
import KoaStatic from 'koa-static';
import path from 'path';
import fs from 'fs';

const app = new Koa();
const router = new KoaRouter();

app.use(KoaViews(path.join(__dirname, '/../views'), {
  extension: 'ejs',
  map: {
    html: 'ejs',
  },
}));

app.use(KoaStatic('./assets'));

router.get('/', async (ctx) => {
  const jsonString = fs.readFileSync(path.join(__dirname, '/../cache.json')).toString();
  const json = JSON.parse(jsonString);

  await ctx.render('index', {
    schedule: json.schedule,
    mediathek: json.mediathek,
  });
});

app
  .use(router.routes())
  .listen(process.env.PORT || 4000);
