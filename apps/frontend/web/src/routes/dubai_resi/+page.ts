import type { PageLoad } from './$types';
import { apiGet } from '$lib/api/client';
import type { IndexSummary, Orderbook, UnderlyingAsset, SeriesPoint } from '$lib/api/types';

export const load: PageLoad = async ({ fetch }) => {
  const indexId = 'dubai-resi';

  const [summary, orderbook, assets, priceSeries] = await Promise.all([
    apiGet<IndexSummary>(fetch, `/v1/indexes/${indexId}/summary`),
    apiGet<Orderbook>(fetch, `/v1/indexes/${indexId}/orderbook?depth=20`),
    apiGet<UnderlyingAsset[]>(fetch, `/v1/indexes/${indexId}/assets`),
    apiGet<SeriesPoint[]>(fetch, `/v1/indexes/${indexId}/series?metric=price&tf=1D`)
  ]);

  return { indexId, summary, orderbook, assets, priceSeries };
};
