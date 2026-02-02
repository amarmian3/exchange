import type { PageLoad } from './$types';
import { apiGet } from '$lib/api/client';
import type { Orderbook } from '$lib/api/type'; // <-- change to /types if you renamed the file

export const load: PageLoad = async ({ fetch }) => {
  const symbol = 'REI';

  // Only fetch what your backend actually supports right now
  const orderbook = await apiGet<Orderbook>(fetch, `/api/orderbook/${symbol}?depth=20`);

  // Return placeholders for the rest (until you implement those APIs)
  return {
    symbol,
    orderbook,
    summary: null,
    assets: [],
    priceSeries: []
  };
};