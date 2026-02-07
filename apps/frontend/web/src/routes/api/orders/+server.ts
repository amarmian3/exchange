import { json, error } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { pool } from '$lib/server/db';

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

  try {
    body = (await request.json()) as PlaceOrderRequest;
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  if (!body?.symbol?.trim()) throw error(400, 'Missing symbol');
  if (body.side !== 'buy' && body.side !== 'sell') throw error(400, 'Invalid side');
  if (!Number.isFinite(body.price) || body.price <= 0) throw error(400, 'Invalid price');
  if (!Number.isFinite(body.quantity) || body.quantity <= 0) throw error(400, 'Invalid quantity');

  // IMPORTANT: your DB expects user_id UUID.
  // For testing: if UI doesn’t pass a UUID, fallback to first user in DB.
  let userId: string = body.user?.trim() || '';

  if (!userId) {
    const u = await pool.query(`select id from users order by created_at asc limit 1`);
    if (!u.rows.length) throw error(400, 'No users in DB. Create a user row first.');
    userId = u.rows[0].id as string;
  }

  // Resolve index_id from symbol
  const symbol = body.symbol.trim();
  const idx = await pool.query(`select id from indexes where symbol = $1 limit 1`, [symbol]);
  if (!idx.rows.length) throw error(400, `No index found for symbol "${symbol}"`);
  const indexId = idx.rows[0].id;

  // Call engine
  const params = new URLSearchParams({
    symbol,
    user: userId, // pass UUID string through; engine currently accepts "user" as string
    side: String(mapSide(body.side)),
    price: String(body.price),
    qty: String(body.quantity)
  });

  const engineUrl = `${PUBLIC_API_BASE_URL}/v1/orders?${params.toString()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(engineUrl, {
      method: 'POST',
      headers: { accept: 'application/json' },
      signal: controller.signal
    });

    const text = await res.text();

    // Save to DB (accepted/rejected)
    const status = res.ok ? 'accepted' : 'rejected';

    await pool.query(
      `insert into orders (user_id, index_id, side, price, quantity, status, created_at)
       values ($1::uuid, $2::uuid, $3, $4, $5, $6, now())`,
      [userId, indexId, body.side, body.price, body.quantity, status]
    );

    if (!res.ok) {
      throw error(res.status, text || `Engine order failed: ${res.status}`);
    }

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







