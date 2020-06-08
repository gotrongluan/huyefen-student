/* eslint-disable */
import { apiGet, apiPost } from '@/utils/request';

export async function register(params) {
    return apiPost(`${AUTH_API_URL}/register/user`, {
        body: params
    });
}

export async function signIn(phone, password) {
    return apiPost(`${AUTH_API_URL}/login/user`, {
        body: {
            phone,
            password
        }
    });
}

export async function fetch() {
    return apiGet(`${USER_API_URL}/me`);
}