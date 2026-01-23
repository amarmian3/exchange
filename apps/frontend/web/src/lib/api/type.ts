export type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';
export type Metric = 'price' | 'yield';

export type IndexSummary = {
  indexId: string;
  symbol: string;          // e.g. "DUBAIRESI"
  displayName: string;     // "Dubai Residential Index"
  lastPrice: number;       // 1250.75
  changePct24h: number;    // 5.2
  avgYieldPct: number;     // 8.4
  marketCapAed: number;     
  propertyCount: number;
  investorCount: number;
  volume24hAed: number;
};

export type SeriesPoint = { t: string; v: number }; // t can be ISO or label

export type OrderbookLevel = { price: number; size: number; total: number };

export type Orderbook = {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  bestBid: number | null;
  bestAsk: number | null;
  spreadAbs: number | null;
  spreadPct: number | null;
};

export type UnderlyingAsset = {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  marketCapAed: number;
  rentalIncomeMonthlyAed: number; // (or USD—just be consistent)
  yieldPct: number;
  weightPct: number;
  status: 'Active' | 'Auction' | 'Paused';
  series30d?: SeriesPoint[]; // optional
};

export type Quote = {
  side: 'buy' | 'sell';
  payToken: 'USDC';
  receiveToken: 'REI';
  payAmount: number;
  receiveAmount: number;
  feeAmount: number;
  effectivePriceAed: number;
};
