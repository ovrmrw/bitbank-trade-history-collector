import * as fs from 'fs';
import * as path from 'path';

const filesDir = path.join(process.cwd(), 'files');

if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

export function writeFile(date: string, trades: any[]) {
  const filePath = path.join(filesDir, `${date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(trades, null, 2));
}
