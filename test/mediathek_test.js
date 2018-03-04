import fs from 'fs';
import { expect } from 'chai';
import mediathek from '../src/mediathek.mjs';
import FetchMock from './fetch_mock.mjs';

describe('Mediathek', () => {
  it('should return an object with the current show in the mediathek', async () => {
    const mock = new FetchMock();

    mock.addPage(fs.readFileSync('./test/data/mediathek.html').toString());

    const result = await mediathek((url, params) => mock.fetch(url, params));
    expect(result).to.eql({
      title: 'heute-journal vom 03.03.2018',
      link: 'https://www.zdf.de//nachrichten/heute-journal/heute-journal-vom-3-maerz-2018-100.html',
    });
  }).timeout(1000);
});
