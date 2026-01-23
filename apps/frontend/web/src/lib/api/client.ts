import { PUBLIC_API_BASE_URL } from '$env/static/public';

type FetchLike = typeof fetch;

export async function apiGet<T>(fetchFn: FetchLike, path: string): Promise<T> {
  const res = await fetchFn(`${PUBLIC_API_BASE_URL}${path}`, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(fetchFn: FetchLike, path: string, body: unknown): Promise<T> {
  const res = await fetchFn(`${PUBLIC_API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}
