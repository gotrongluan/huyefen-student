/* eslint-disable */
import { apiGet, apiPut, apiPost } from '@/utils/request';

export async function validCourse(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/validate/user`);
}

export async function fetchInfo() {}

export async function overview(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/overview`);
}

export async function instructors(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/instructors`);
}