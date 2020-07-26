/* eslint-disable */
import { apiGet, apiPost } from '@/utils/request';

export async function fetchItemsInfo(items) {
  const itemStrs = items.map(item => `${item._id},${item.type}`);
  return apiGet(`${COURSE_API_URL}/cart?items=${itemStrs.join('-')}`)
}

export async function buyItems(items) {
  const itemStrs = items.map(item => `${item._id},${item.type}`);
  return apiPost(`${COURSE_API_URL}/cart?items=${itemStrs.join('-')}`)
}