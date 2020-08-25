/* eslint-disable */
import { apiPost } from '@/utils/request';

export async function uploadAvatar(formData) {
	return apiPost(`${CLOUD_API_URL}/upload/avatar`, {
		body: formData
	});
}