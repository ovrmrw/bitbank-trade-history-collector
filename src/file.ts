import * as fs from 'fs';
import * as path from 'path';

const filesDir = path.join(process.cwd(), 'files');

if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

export function writeFile(date: string, trades: any[]) {
  const filePath = path.join(filesDir, `${date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(trades, null, 2));
  console.log('writeFile is finished:', { date, length: trades.length });
}

export function readFile(date: string) {
  const filePath = path.join(filesDir, `${date}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const trades = JSON.parse(fs.readFileSync(filePath).toString());
      console.log('readFile is finished:', { date, length: trades.length });
      return trades;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}
