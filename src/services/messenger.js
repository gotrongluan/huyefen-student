/* eslint-disable */
import { apiGet, apiPost } from '@/utils/request';

export async function send(params) {
    return apiPost(`${MESSENGER_API_URL}/send`, {
        body: params
    });
}

export async function check(friendId) {
    return apiGet(`${MESSENGER_API_URL}/check/${friendId}`);
}