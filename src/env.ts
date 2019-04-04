import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const credentialsFilePath = path.join(os.homedir(), '.bitbank', 'credentials.json');

try {
  if (fs.existsSync(credentialsFilePath)) {
    const credentials: any[] = JSON.parse(fs.readFileSync(credentialsFilePath).toString());
    const { apiKey, secretKey } = credentials[0];
    if (!process.env.BITBANK_API_KEY) {
      process.env.BITBANK_API_KEY = apiKey;
    }
    if (!process.env.BITBANK_SECRET_KEY) {
      process.env.BITBANK_SECRET_KEY = secretKey;
    }
  }
} catch {}
