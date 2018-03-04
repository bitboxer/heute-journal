import 'babel-polyfill';
import cheerio from 'cheerio';
import nodeFetch from 'node-fetch';
import loadUrl from './load_url.mjs';

function cleanupTitle(element) {
  return cheerio(element)
    .find('h4')
    .text()
    .trim()
    .replace(/^:/, '')
    .trim();
}

function parseShow(html) {
  const time = cheerio(html).find('.overlay-link-time .time').text();
  const match = time.match(/(\d{2}):(\d{2}) - (\d{2}):(\d{2})/);

  const length =
    ((parseInt(match[3], 10) * 60) + parseInt(match[4], 10)) -
    ((parseInt(match[1], 10) * 60) + parseInt(match[2], 10));

  return {
    time: `${match[1]}:${match[2]}`,
    length,
  };
}

function parseHTML(result) {
  return new Promise((resolve) => {
    const page = cheerio.load(result.body);
    const rows = page('.timeline-ZDF li');

    const filtered = Array.from(rows).filter((row) => {
      const title = cleanupTitle(row);
      return title === 'heute-journal';
    });

    if (filtered.length === 1) {
      resolve(parseShow(filtered[0]));
    } else {
      resolve({});
    }
  });
}

export default function (fetchInstance) {
  const fetcher = fetchInstance || nodeFetch;

  return loadUrl(fetcher, 'https://www.zdf.de/live-tv')
    .then(parseHTML);
}
