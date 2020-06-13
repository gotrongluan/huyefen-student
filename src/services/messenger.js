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

export async function fetchConversations(skip = 0, limit = 10) {
    return apiGet(`${MESSENGER_API_URL}/conversations?skip=${skip}&limit=${limit}`);
}

export async function fetchPartner(converId) {
    return apiGet(`${MESSENGER_API_URL}/conversations/${converId}/partner`);
}

export async function fetchMessages(converId, skip = 0, limit = 20) {
    return apiGet(`${MESSENGER_API_URL}/conversations/${converId}/messages?skip=${skip}&limit=${limit}`);
}