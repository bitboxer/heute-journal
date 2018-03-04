import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import cacheData from '../src/cache_data.mjs';
import FetchMock from './fetch_mock.mjs';

describe('CacheData', () => {
  it('should cache the data into a cache.json file', async () => {
    const mock = new FetchMock();

    mock.addPage(fs.readFileSync('./test/data/schedule.html').toString());
    mock.addPage(fs.readFileSync('./test/data/mediathek.html').toString());

    await cacheData((url, params) => mock.fetch(url, params));

    const result = JSON.parse(fs.readFileSync(path.join(__dirname, '/../cache.json')).toString());
    expect(result).to.eql({
      mediathek: {
        title: 'heute-journal vom 03.03.2018',
        link: 'https://www.zdf.de//nachrichten/heute-journal/heute-journal-vom-3-maerz-2018-100.html',
      },
      schedule: {
        length: 15,
        time: '21:45',
      },
    });
  }).timeout(1000);
});
