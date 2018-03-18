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

  it('should correct a wrong duration in the data', async () => {
    const mock = new FetchMock();

    mock.addPage(fs.readFileSync('./test/data/schedule_wrong.html').toString());

    const result = await schedule((url, params) => mock.fetch(url, params));
    expect(result).to.eql({
      time: '21:30',
      length: 10,
    });
  });

  it('should say that there is no show if it is not on today', async () => {
    const mock = new FetchMock();

    mock.addPage(fs.readFileSync('./test/data/schedule_no_show_tonight.html').toString());

    const result = await schedule((url, params) => mock.fetch(url, params));
    expect(result).to.eql({
      time: 'nein',
      length: 0,
    });
  });

  it('should return an object with data from the tv page even if the name has a suffix', async () => {
    const mock = new FetchMock();

    mock.addPage(fs.readFileSync('./test/data/schedule_name_suffix.html').toString());

    const result = await schedule((url, params) => mock.fetch(url, params));
    expect(result).to.eql({
      time: '22:30',
      length: 30,
    });
  }).timeout(1000);
});
