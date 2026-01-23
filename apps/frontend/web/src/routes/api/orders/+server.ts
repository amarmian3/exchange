// If your engine expects different field names (e.g. qty not quantity, 
// or side as "BUY"), you only change them here.
import { json, error } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

type PlaceOrderRequest = {
  symbol: string;          // "REI"
  side: 'buy' | 'sell';    // we'll only use 'buy' for now
  price: number;           // limit price per token
  quantity: number;        // token amount (REI)
};

// NOTE: your swagger shows Side is an integer.
// Common mapping is 0=BUY, 1=SELL (if yours is reversed, flip it).
function mapSide(side: 'buy' | 'sell') {
  return side === 'buy' ? 0 : 1;
}

export async function POST({ request, fetch }) {
  const body = (await request.json()) as PlaceOrderRequest;

  if (!body?.symbol) throw error(400, 'Missing symbol');
  if (!Number.isFinite(body.price) || body.price <= 0) throw error(400, 'Invalid price');
  if (!Number.isFinite(body.quantity) || body.quantity <= 0) throw error(400, 'Invalid quantity');

  const engineUrl = `${PUBLIC_API_BASE_URL}/v1/orders`;

  const res = await fetch(engineUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      symbol: body.symbol,
      side: mapSide(body.side),
      price: body.price,
      quantity: body.quantity
    })
  });

  const text = await res.text(); // capture engine error details too
  if (!res.ok) throw error(res.status, text || `Engine order failed: ${res.status}`);

  // If engine returns JSON, pass it through
  try {
    return json(JSON.parse(text));
  } catch {
    return json({ ok: true, raw: text });
  }
}
