/* eslint-disable */
import { apiGet, apiPut, apiPost } from '@/utils/request';

export async function validCourse(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/validate/user`);
}