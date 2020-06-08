/* eslint-disable */
import { apiGet } from '@/utils/request';

export async function fetchJobs() {
    return apiGet(`${JOB_API_URL}?page=1&limit=100`);
}

export async function fetchAreasMenu() {
    return apiGet(`${AREA_API_URL}`);
}

export async function fetchCategories() {
    return apiGet(`${AREA_API_URL}/categories`);
}