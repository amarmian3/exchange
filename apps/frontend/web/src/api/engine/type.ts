
// move elsewhere
export type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';
export type Metric = 'price' | 'yield';
//export type Side = 'buy' | 'sell';

export enum Side {
	Buy = 0,
	Sell = 1
}

//JSON shape sent in API POST to backend engine from frontend
export type PlaceOrder = {
  symbol: string;
  user: string; 
  side: Side;
  price: number;
  qty: number;
}

// Top-level response wrapper
  export type OrderBookResponse = {
    symbol: string;
    // TODO: events: unknown[]; // engine events (empty for now)
    rc: number;
    raw: RawOrderBook;
  };

  // Order level (bid / ask)
  export type OrderLevel = {
    price: number;
    qty: number;
  };

  // Raw orderbook coming from the engine
  export type RawOrderBook = {
    symbol: string;
    bids: OrderLevel[];
    asks: OrderLevel[];
    _rc: number;
  };

