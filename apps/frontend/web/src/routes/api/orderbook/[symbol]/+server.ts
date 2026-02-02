// src/routes/api/orderbook/[symbol]/+server.ts
import { json, error } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

type OrderLevel = { price: number; size: number };

type RawLevelObj = { 
  price: number | string; 
  size?: number | string; 
  qty?: number | string };

type RawBook = {
  // support:
  // 1) { "1250.75": 2.5 }
  // 2) [[1250.75, 2.5], ...]
  // 3) [{ price: 1250.75, size: 2.5 }, ...]  (or qty)
  bids?: Record<string, number> | [number, number][] | RawLevelObj[];
  asks?: Record<string, number> | [number, number][] | RawLevelObj[];
};

type EngineOrderbookResponse = {
  symbol?: string;
  rc?: number;
  raw?: RawBook;
};

function normaliseSide(
  side: RawBook['bids'] | RawBook['asks'] | undefined,
  sortFn: (a: OrderLevel, b: OrderLevel) => number
): OrderLevel[] {
  if (!side) return [];

  let levels: OrderLevel[] = [];

  if (Array.isArray(side)) {
    if (side.length === 0) return [];

    const first = side[0] as unknown;

    if (Array.isArray(first)) {
      // [[price, qty], ...]
      levels = (side as [number, number][])
        .map(([price, size]) => ({ price: Number(price), size: Number(size) }));
    } else if (typeof first === 'object' && first !== null) {
      // [{ price, qty }, ...]  (or size)
      levels = (side as Array<{ price: any; qty?: any; size?: any }>)
        .map((l) => ({
          price: Number(l.price),
          size: Number(l.size ?? l.qty)
        }));
    } else {
      return [];
    }
  } else {
    // { "1250": 2 }
    levels = Object.entries(side).map(([price, size]) => ({
      price: Number(price),
      size: Number(size)
    }));
  }

  return levels
    .filter((l) => Number.isFinite(l.price) && Number.isFinite(l.size))
    .sort(sortFn);
}


export async function GET({ params, fetch, url }) {
  const symbol = params.symbol; // e.g. "REI"
  const depthRaw = url.searchParams.get('depth');
  const depth = Math.min(200, Math.max(1, Number(depthRaw ?? '20'))); // clamp 1..200

  if (!symbol) throw error(400, 'Missing symbol');

  // Calls your engine via ngrok / base URL
  const engineUrl = `${PUBLIC_API_BASE_URL}/v1/orderbook/${encodeURIComponent(symbol)}`;

  // Timeout so the UI doesn’t hang forever
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(engineUrl, {
      headers: { accept: 'application/json' },
      signal: controller.signal
    });

    if (!res.ok) throw error(res.status, `Engine responded ${res.status}`);

    const data = (await res.json()) as EngineOrderbookResponse;

    // If your engine uses rc != 0 as error
    if (typeof data.rc === 'number' && data.rc !== 0) {
      throw error(502, `Engine returned rc=${data.rc}`);
    }

    const raw = data.raw ?? {};

    const bids = normaliseSide(raw.bids, (a, b) => b.price - a.price).slice(0, depth); // high -> low
    const asks = normaliseSide(raw.asks, (a, b) => a.price - b.price).slice(0, depth); // low -> high

    const bidsWithTotals = bids.map((l) => ({ ...l, total: l.price * l.size }));
    const asksWithTotals = asks.map((l) => ({ ...l, total: l.price * l.size }));

    const bestBid = bidsWithTotals[0]?.price ?? null;
    const bestAsk = asksWithTotals[0]?.price ?? null;

    const spreadAbs =
      bestBid !== null && bestAsk !== null ? bestAsk - bestBid : null;

    const spreadPct =
      spreadAbs !== null && bestAsk !== null && bestAsk !== 0
        ? (spreadAbs / bestAsk) * 100
        : null;

    // Normalised frontend payload
    return json({
      symbol,
      bids: bidsWithTotals,
      asks: asksWithTotals,
      bestBid,
      bestAsk,
      spreadAbs,
      spreadPct,
      ts: Date.now()
    });




  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw error(504, 'Engine request timed out');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
