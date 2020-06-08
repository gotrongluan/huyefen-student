/* eslint-disable */
import { apiGet, apiPut } from '@/utils/request';

export async function fetchFriends(page = 1, limit = 9) {
    return apiGet(`${FRIEND_API_URL}/me?page=${page}&limit=${limit}`);
}

export async function allFriends(existed) {
    return apiGet(`${FRIEND_API_URL}/me/all?existed=${existed}`);
}

export async function fetch(friendId) {
    return apiGet(`${FRIEND_API_URL}/${friendId}`);
}

export async function fetchFriendsOfFriend(friendId, page = 1, limit = 9) {
    return apiGet(`${FRIEND_API_URL}/${friendId}/friends?page=${page}&limit=${limit}`);
}

export async function allFriendsOfFriend(friendId, existed) {
    return apiGet(`${FRIEND_API_URL}/${friendId}/friends/all?existed=${existed}`);
}

export async function addFriend(friendId) {
    return apiPut(`${FRIEND_API_URL}/${friendId}/add`);
}

export async function cancelInvitation(friendId) {
    return apiPut(`${FRIEND_API_URL}/${friendId}/cancel`);
}