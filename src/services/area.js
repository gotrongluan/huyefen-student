/* eslint-disable */
import { apiGet } from '@/utils/request';

export async function fetchInfo(areaId) {
	return apiGet(`${AREA_API_URL}/${areaId}/info`);
}

export async function fetchCourses(areaId, filterStr = '', sortBy = 'highest-rated', page = 1) {
	let s = '';
	if (filterStr !== '') {
		s = `&${filterStr}`;
	}
	return apiGet(`${AREA_API_URL}/${areaId}/courses?sortBy=${sortBy}&page=${page}&pageSize=${8}${s}`);
}

export async function fetchCategoryInfo(areaId, categoryId) {
	return apiGet(`${AREA_API_URL}/${areaId}/categories/${categoryId}`);
}

export async function fetchCoursesOfCategory(areaId, categoryId, filterStr = '', sortBy = 'highest-rated', page = 1) {
	let s = '';
	if (filterStr !== '') {
		s = `&${filterStr}`;
	}
	return apiGet(`${AREA_API_URL}/${areaId}/${categoryId}/courses?sortBy=${sortBy}&page=${page}&pageSize=${8}${s}`);
}