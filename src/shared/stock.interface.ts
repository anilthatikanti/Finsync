export interface Stock {
    exchange: string;
    exchange_token: number;
    instrument_token: number;
    instrument_type: string;
    name: string;
    segment: string;
    trading_symbol: string;
  }
  
  export interface IStockData {
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    ohlc:{
      Open: number;
      High: number;
      Low: number;
      Close: number;
      Volume: number;
    };
  }
  
  export interface IHistoryData{
      Open: number;
      High: number;
      Low: number;
      Close: number;
      Volume: number;
      Dividends: number;
      "Stock Splits": number;
  }
  export interface ITickerData {
    id: string;
    exchange: string;
    quoteType: number;
    price: number;
    timestamp: number;
    marketHours: number;
    changePercent: number;
    dayVolume: number;
    change: number;
    priceHint: number;
  }
  
  export interface IClosed {
        action: string;
        message: string;
        type: string;
      }

export interface IStock {
  symbol: string;
  longName: string;
}

export interface IWatchList {
  _id: string; // assuming MongoDB ObjectId is stored as string on frontend
  watchListName: string;
  stocks: IStock[];
}

export interface searchStock {
  dispSecIndFlag: boolean;
  exchDisp: string;
  exchange: string;
  index: string;
  industry: string;
  industryDisp: string;
  isYahooFinance: boolean;
  longname: string;
  quoteType: string;
  score: number;
  sector: string;
  sectorDisp: string;
  shortname: string;
  symbol: string;
  typeDisp: string;
}
