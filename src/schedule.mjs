import 'babel-polyfill';
import cheerio from 'cheerio';
import moment from 'moment';
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

function timeFromShow(show) {
  const time = cheerio(show).find('.overlay-link-time .time').text();
  const match = time.match(/(\d{2}):(\d{2}) - (\d{2}):(\d{2})/);

  return moment({ hour: match[1], minute: match[2] });
}

function parseShow(show, nextShow) {
  const newsTime = timeFromShow(show);
  const nextTime = timeFromShow(nextShow);

  return {
    time: newsTime.format('HH:mm'),
    length: moment(nextTime.diff(newsTime)).minutes(),
  };
}

function showAfter(rows, show) {
  return rows[rows.indexOf(show) + 1];
}

function parseHTML(result) {
  return new Promise((resolve) => {
    const page = cheerio.load(result.body);
    const rows = Array.from(page('.timeline-ZDF li'));

    const heuteJournal = rows.filter((row) => {
      const title = cleanupTitle(row);
      return title === 'heute-journal';
    })[0];

    if (heuteJournal) {
      const nextShow = showAfter(rows, heuteJournal);
      resolve(parseShow(heuteJournal, nextShow));
    } else {
      resolve({
        time: 'nein',
        length: 0,
      });
    }
  });
}

export default function (fetchInstance) {
  const fetcher = fetchInstance || nodeFetch;

  return loadUrl(fetcher, 'https://www.zdf.de/live-tv')
    .then(parseHTML);
}
