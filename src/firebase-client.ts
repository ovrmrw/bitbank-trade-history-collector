import * as admin from 'firebase-admin';
import { TradeResponse } from 'node-bitbankcc';
import { compact } from 'lodash';

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_DATABASE_URL } = process.env;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY,
  }),
  databaseURL: FIREBASE_DATABASE_URL,
});

export const firestore = admin.firestore();

export class FirebaseClient {
  constructor(private firestore: FirebaseFirestore.Firestore) {}

  getLastExcutedAt(date: string): Promise<number> {
    return this.getCollectionRef(date)
      .orderBy('executed_at', 'desc')
      .limit(1)
      .get()
      .then(snapshot => {
        let executed_at = 0;
        if (snapshot.size > 0) {
          snapshot.forEach(doc => {
            executed_at = doc.data().executed_at;
          });
        }
        return executed_at;
      })
      .catch(err => {
        console.error(err);
        return 0;
      });
  }

  readTradeHistory(date: string): Promise<TradeResponse[]> {
    return this.getCollectionRef(date)
      .get()
      .then(snapshot => {
        const trades: TradeResponse[] = [];
        if (snapshot.size > 0) {
          snapshot.forEach(doc => {
            trades.push(doc.data() as any);
          });
        }
        return compact(trades);
      })
      .catch(err => {
        console.error(err);
        return [];
      });
  }

  async writeTradeHistory(date: string, trades: TradeResponse[]) {
    const existsTradeIds = await this.readTradeHistory(date).then(trades => trades.map(t => t.trade_id));
    console.log({ existsCount: existsTradeIds.length });
    const newTrades = trades.filter(t => !existsTradeIds.includes(t.trade_id));
    const batch = this.firestore.batch();
    newTrades.forEach(trade => {
      batch.set(this.getCollectionRef(date).doc(trade.pair + '_' + trade.trade_id), trade);
    });
    return batch
      .commit()
      .then(res => {
        console.log('writeTradeHistory is finished:', { date, length: newTrades.length, res });
      })
      .catch(console.error);
  }

  private getCollectionRef(date: string) {
    return this.firestore
      .collection('trade_history')
      .doc(date)
      .collection('trades');
  }
}
