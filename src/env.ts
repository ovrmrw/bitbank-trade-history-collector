import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const firebaseProjectId = 'bitbank-tradehistory-collector';

const bitbankCredentialsFilePath = path.join(os.homedir(), '.bitbank', 'credentials.json');
const firebaseServiceAccountKeyFileDir = path.join(os.homedir(), '.firebase', 'credentials');

const [_, __, ___, label = ''] = process.argv;

try {
  if (fs.existsSync(bitbankCredentialsFilePath)) {
    const credentials: any[] = JSON.parse(fs.readFileSync(bitbankCredentialsFilePath).toString());
    const credential = (label ? credentials.find(c => c.label === label) : credentials[0]) || {};
    const { apiKey, secretKey } = credential;
    if (!process.env.BITBANK_API_KEY) {
      process.env.BITBANK_API_KEY = apiKey;
    }
    if (!process.env.BITBANK_SECRET_KEY) {
      process.env.BITBANK_SECRET_KEY = secretKey;
    }
  }
} catch {}

try {
  const serviceAccountKeyFilename = fs
    .readdirSync(firebaseServiceAccountKeyFileDir)
    .find(f => f.includes(firebaseProjectId));
  if (serviceAccountKeyFilename) {
    const serviceAccountKeyFilePath = path.join(firebaseServiceAccountKeyFileDir, serviceAccountKeyFilename);
    if (fs.existsSync(serviceAccountKeyFilePath)) {
      const credential = JSON.parse(fs.readFileSync(serviceAccountKeyFilePath).toString());
      const { private_key, client_email } = credential;
      if (!process.env.FIREBASE_PROJECT_ID) {
        process.env.FIREBASE_PROJECT_ID = firebaseProjectId;
      }
      if (!process.env.FIREBASE_CLIENT_EMAIL) {
        process.env.FIREBASE_CLIENT_EMAIL = client_email;
      }
      if (!process.env.FIREBASE_PRIVATE_KEY) {
        process.env.FIREBASE_PRIVATE_KEY = private_key;
      }
      if (!process.env.FIREBASE_DATABASE_URL) {
        process.env.FIREBASE_DATABASE_URL = `https://${firebaseProjectId}.firebaseio.com`;
      }
    }
  }
} catch {}
