/* eslint-disable */
import { apiGet } from '@/utils/request';

export async function fetch(skip = 0, limit = 4) {
	return apiGet(`${PURCHASE_HISTORY_API_URL}?skip=${skip}&limit=${limit}`);
}