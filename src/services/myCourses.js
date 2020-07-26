/* eslint-disable */
import { apiGet } from '@/utils/request';

export async function fetchMyCourses(sortBy, skip = 0, limit = 4) {
	return apiGet(`${COURSE_API_URL}/mine?skip=${skip}&limit=${limit}&sortBy=${sortBy}`);
}