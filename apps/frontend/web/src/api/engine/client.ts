import type { OrderBookResponse, PlaceOrder, Side } from './type';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

//construct the URL for the API endpoint using the base URL from env
const ENGINE_BASE = PUBLIC_API_BASE_URL;

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;



// Convert the TS enum Side (Buy=0, Sell=1) into the string the engine expects
function sideToQuery(side: Side) {
  // Engine docs show `side` is an integer query param
  return String(side); // 0 or 1
}



//ERROR MESSSAGE: if error or empty response, state error in UI instead of crashing with 500 
async function parseJson<T>(res: Response, label: string): Promise<T> {
  const text = await res.text(); // read once (can't read twice)
  if (!res.ok) throw new Error(`${label} ${res.status}: ${text || res.statusText}`);
  return (text ? JSON.parse(text) : null) as T;
}



//API GET /v1/orderbook/{symbol} - Calls the backend engine directly and returns the full response wrapper:
export async function apiGET(
  symbol: string,
  fetchFn: FetchLike = fetch
): Promise<OrderBookResponse> {
  if (!ENGINE_BASE) throw new Error('Missing NEXT_PUBLIC_ENGINE_BASE_URL');

  //Build the final URL
  const url = `${ENGINE_BASE}/v1/orderbook/${encodeURIComponent(symbol)}`;

  // Make the GET call (ask for JSON)
  const res = await fetchFn(url, {
    headers: { accept: 'application/json' } // ask for JSON
  });

  // Return typed JSON (or throw useful error)
  return parseJson<OrderBookResponse>(res, 'GET orderbook');
}



//API POST /v1/orders - Calls the backend engine to place an order. 
export async function apiPOST(
  order: PlaceOrder,
  fetchFn: FetchLike = fetch
): Promise<unknown> {
  if (!ENGINE_BASE) throw new Error('Missing NEXT_PUBLIC_ENGINE_BASE_URL');

  // Minimal validation to avoid pointless backend calls
  if (!order.symbol?.trim()) throw new Error('Missing symbol');
  if (!order.user?.trim()) throw new Error('Missing user');
  if (!Number.isFinite(order.price) || order.price <= 0) throw new Error('Invalid price');
  if (!Number.isFinite(order.qty) || order.qty <= 0) throw new Error('Invalid qty');

  // Convert the order into the query params the engine expects
  const params = new URLSearchParams({
    symbol: order.symbol.trim(),
    user: order.user.trim(),
    side: sideToQuery(order.side), // "0" or "1"
    price: String(order.price),
    qty: String(order.qty)
  });

  // Build the final URL
  const url = `${ENGINE_BASE}/v1/orders?${params.toString()}`;

  // Make the POST call (no JSON body needed)
  const res = await fetchFn(url, {
    method: 'POST',
    headers: { accept: 'application/json' }
  });

  // Return engine response (or throw useful error)
  return parseJson<unknown>(res, 'POST order');
}





// example usage:
// aa: OrderBookResponse = apiGetData{}
// best_bid = aa[raw][bids][0][price]
// best_ask = aa[raw][asks][0][price]



