import fs from 'fs';
import path from 'path';
import schedule from './schedule.mjs';
import mediathek from './mediathek.mjs';

export default function (fetchInstance) {
  return Promise.all([
    schedule(fetchInstance),
    mediathek(fetchInstance),
  ]).then((data) => {
    const json = {
      schedule: data[0],
      mediathek: data[1],
    };
    fs.writeFileSync(path.join(__dirname, '/../cache.json'), JSON.stringify(json));
  });
}
