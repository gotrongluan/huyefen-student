/* eslint-disable */
import { apiGet } from '@/utils/request';

export async function fetchItemsInfo(items) {
  const itemStrs = items.map(item => `${item._id},${item.type}`);
  return apiGet(`${COURSE_API_URL}/cart?items=${itemStrs.join('-')}`)
}