// src/routes/api/orderbook/[market]/+server.ts
import { json, error } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

type OrderLevel = { price: number; size: number };

type RawBook = {
  // support either { "1250.75": 2.5 } or [[1250.75, 2.5], ...]
  bids?: Record<string, number> | [number, number][];
  asks?: Record<string, number> | [number, number][];
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

  const levels: OrderLevel[] = Array.isArray(side)
    ? side.map(([price, size]) => ({ price: Number(price), size: Number(size) }))
    : Object.entries(side).map(([price, size]) => ({ price: Number(price), size: Number(size) }));

  return levels
    .filter((l) => Number.isFinite(l.price) && Number.isFinite(l.size))
    .sort(sortFn);
}

export async function GET({ params, fetch, url }) {
  const market = params.market; // e.g. "dubai_resi"
  const depth = Number(url.searchParams.get('depth') ?? '20');

  if (!market) throw error(400, 'Missing market');

  // Calls your engine via ngrok
  const engineUrl = `${PUBLIC_API_BASE_URL}/v1/orderbook/${encodeURIComponent(market)}`;

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

    // Normalised frontend contract:
    return json({
      market,
      bids,
      asks,
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
