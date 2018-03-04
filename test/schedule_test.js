import fs from 'fs';
import { expect } from 'chai';
import schedule from '../src/schedule.mjs';
import FetchMock from './fetch_mock.mjs';

describe('Schedule', () => {
  it('should return an object with data from the tv page', async () => {
    const mock = new FetchMock();

    mock.addPage(fs.readFileSync('./test/data/schedule.html').toString());

    const result = await schedule((url, params) => mock.fetch(url, params));
    expect(result).to.eql({
      time: '21:45',
      length: 15,
    });
  }).timeout(1000);
});