import { PrivateApi, PrivateApiConfig, TradeHistoryRequest, TradeHistoryResponse, TradeResponse } from 'node-bitbankcc';

export class RestApiClient {
  private privateApi: PrivateApi;

  constructor(apiKey: string, secretKey: string) {
    const conf: PrivateApiConfig = {
      endPoint: 'https://api.bitbank.cc/v1',
      apiKey,
      apiSecret: secretKey,
      keepAlive: true,
      timeout: 1000 * 30,
    };
    this.privateApi = new PrivateApi(conf);
  }

  async getTradeHistory(date: string): Promise<TradeResponse[]> {
    let since = new Date(`${date}T00:00:00.000+09:00`).valueOf();
    const end = new Date(`${date}T23:59:59.999+09:00`).valueOf();
    const limit = 100;
    const _trades: TradeResponse[] = [];
    while (true) {
      const { trades, count } = await this.getTradeHistoryPerMaxCount(since, end, limit);
      trades.forEach(trade => _trades.push(trade));
      if (count < limit) {
        break;
      } else {
        since = trades[trades.length - 1].executed_at + 1;
      }
    }
    return _trades;
  }

  private async getTradeHistoryPerMaxCount(
    since: number,
    end: number,
    limit: number,
  ): Promise<{ trades: TradeResponse[]; count: number }> {
    const params: TradeHistoryRequest = {
      since,
      end,
      count: limit,
      order: 'asc',
    };
    const trades = await this.privateApi.getTradeHistory(params).then(res => res.data.trades);
    return { trades, count: trades.length };
  }
}
