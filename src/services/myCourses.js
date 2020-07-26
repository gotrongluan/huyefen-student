/* eslint-disable */
import { apiGet } from '@/utils/request';

export async function fetchMyCourses(sortBy, page = 1, limit = 8) {
	return apiGet(`${COURSE_API_URL}/mine?page=${page}&limit=${limit}&sortBy=${sortBy}`);
}