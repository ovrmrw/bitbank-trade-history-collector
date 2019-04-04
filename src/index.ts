import './env';
import * as assert from 'assert';
import { RestApiClient } from './rest-api-client';
import { writeFile, readFile } from './file';

const [_, __, date = ''] = process.argv;
const { BITBANK_API_KEY = '', BITBANK_SECRET_KEY = '' } = process.env;

assert(/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date), 'process.argv[2] should be date format.');
assert(!!BITBANK_API_KEY, 'API KEY shoud be exists.');
assert(!!BITBANK_SECRET_KEY, 'SECRET KEY shoud be exists.');

const rac = new RestApiClient(BITBANK_API_KEY, BITBANK_SECRET_KEY);
const existsTrades = readFile(date);

rac.getTradeHistory(date, existsTrades).then(trades => {
  writeFile(date, trades);
});
