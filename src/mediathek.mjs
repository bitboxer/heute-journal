import 'babel-polyfill';
import cheerio from 'cheerio';
import nodeFetch from 'node-fetch';
import loadUrl from './load_url.mjs';

function parseHTML(result) {
  return new Promise((resolve) => {
    const page = cheerio.load(result.body);
    const rows = page('article .item-title a');

    if (rows.length >= 1) {
      const title = cheerio(rows[0]).text().trim();
      const link = `https://www.zdf.de/${rows[0].attribs.href}`;
      resolve({ title, link });
    } else {
      resolve({});
    }
  });
}

export default function (fetchInstance) {
  const fetcher = fetchInstance || nodeFetch;

  return loadUrl(fetcher, 'https://www.zdf.de/nachrichten/heute-journal/')
    .then(parseHTML);
}

