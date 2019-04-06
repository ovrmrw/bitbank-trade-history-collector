import './env';
import * as assert from 'assert';
import { RestApiClient } from './rest-api-client';
import { firestore, FirebaseClient } from './firebase-client';

const [_, __, date = ''] = process.argv;
const { BITBANK_API_KEY = '', BITBANK_SECRET_KEY = '' } = process.env;

assert(/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date), 'process.argv[2] should be date format.');
assert(!!BITBANK_API_KEY, 'API KEY shoud be exists.');
assert(!!BITBANK_SECRET_KEY, 'SECRET KEY shoud be exists.');

async function main() {
  const rac = new RestApiClient(BITBANK_API_KEY, BITBANK_SECRET_KEY);
  const fc = new FirebaseClient(firestore);
  const trades = await rac.getTradeHistory(date);
  fc.writeTradeHistory(date, trades);
}

main().catch(console.error);
