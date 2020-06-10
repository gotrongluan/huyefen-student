/* eslint-disable */
import { apiPut } from '@/utils/request';

export async function sendToken(token) {
    return apiPut(`${USER_API_URL}/token`, {
        body: {
            token
        }
    });
}