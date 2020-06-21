/* eslint-disable */
import { apiGet, apiPost } from '@/utils/request';

export async function fetch(courseId, page = 1, limit = 4) {
    return apiGet(`${ANNOUNCE_API_URL}?courseId=${courseId}&page=${page}&limit=${limit}`);
}

export async function comment(announceId, content) {
    return apiPost(`${ANNOUNCE_API_URL}/${announceId}/comments`, {
        body: {
            content
        }
    });
}

export async function fetchComments(announceId, page = 1, limit = 5) {
    return apiGet(`${ANNOUNCE_API_URL}/${announceId}/comments?page=${page}&limit=${limit}`);
}