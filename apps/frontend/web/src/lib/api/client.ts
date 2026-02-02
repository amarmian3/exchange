type FetchLike = typeof fetch;

export async function apiGet<T>(fetchFn: FetchLike, path: string): Promise<T> {
  const res = await fetchFn(path, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(fetchFn: FetchLike, path: string, body: unknown): Promise<T> {
  const res = await fetchFn(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}


//this was removed and replaced from line 6 and line 14: onst res = await fetchFn(`${PUBLIC_API_BASE_URL}${path}`, {
// that makes import public_base redundant