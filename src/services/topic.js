/* eslint-disable */
import { apiGet } from '@/utils/request';

export async function fetchInfo(topicId) {
  return apiGet(`${TOPIC_API_URL}/${topicId}`);
}
