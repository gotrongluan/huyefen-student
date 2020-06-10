import storage from '@/utils/storage';
import * as FCMService from '@/services/fcm';

export default {
    namespace: 'fcm',
    state: null,
    effects: {
        *saveToken({ payload: token }, { call }) {
            const currentToken = storage.getFCMToken();
            if (token !== currentToken) {
                yield call(FCMService.sendToken, token);
                storage.setFCMToken(token);
            }
        }
    }
}