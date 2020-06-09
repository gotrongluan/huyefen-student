/* eslint-disable */
import { apiGet, apiPut } from '@/utils/request';

export async function fetch(teacherId) {
    return apiGet(`${TEACHER_API_URL}/${teacherId}`);
}

export async function follow(teacherId) {
    return apiPut(`${TEACHER_API_URL}/${teacherId}/follow`);
}

export async function unfollow(teacherId) {
    return apiPut(`${TEACHER_API_URL}/${teacherId}/unfollow`);
}