import { json, error } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

type PlaceOrderRequest = {
  symbol: string;           // "REI"
  side: 'buy' | 'sell';     // UI-friendly
  price: number;            // decimals allowed by UI for now
  quantity: number;         // decimals allowed by UI for now
  user?: string;            // optional from UI, but we'll default it
};

// Engine expects 0=BUY, 1=SELL
function mapSide(side: 'buy' | 'sell') {
  return side === 'buy' ? 0 : 1;
}

export async function POST({ request, fetch }) {
  let body: PlaceOrderRequest;

  // Safer JSON parsing -> return 400 instead of crashing with a 500
  try {
    body = (await request.json()) as PlaceOrderRequest;
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  if (!body?.symbol?.trim()) throw error(400, 'Missing symbol');
  if (body.side !== 'buy' && body.side !== 'sell') throw error(400, 'Invalid side');
  if (!Number.isFinite(body.price) || body.price <= 0) throw error(400, 'Invalid price');
  if (!Number.isFinite(body.quantity) || body.quantity <= 0) throw error(400, 'Invalid quantity');

  // Placeholder user (until auth)
  const user = body.user?.trim() || 'test';

  // Swagger shows these are query params: symbol, user, side, price, qty
  const params = new URLSearchParams({
    symbol: body.symbol.trim(),
    user,
    side: String(mapSide(body.side)),
    price: String(body.price),
    qty: String(body.quantity) // map "quantity" -> "qty"
  });

  const engineUrl = `${PUBLIC_API_BASE_URL}/v1/orders?${params.toString()}`;

  // Timeout so the UI doesn’t hang forever
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(engineUrl, {
      method: 'POST',
      headers: { accept: 'application/json' },
      signal: controller.signal
    });

    const text = await res.text();

    // Try to extract a useful error message
    if (!res.ok) {
      throw error(res.status, text || `Engine order failed: ${res.status}`);
    }

    // Pass through JSON if possible
    try {
      return json(JSON.parse(text));
    } catch {
      return json({ ok: true, raw: text });
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw error(504, 'Engine request timed out');
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
