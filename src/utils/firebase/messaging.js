import { messaging } from '@/utils/firebase';

let unSubscribeMessage = null;
let unSubscribeTokenRefresh = null;

export const getFCMToken = async (onGetTokenErrorCallback) => {
    try {
        return await messaging.getToken();
    }
    catch (err) {
        onGetTokenErrorCallback(err);
    }
};

export const requestPermission = async () => {
    try {
        await messaging.requestPermission();
        return true;
    }
    catch (e) {
        return false;
    }
};

export const subscribeMessaging = (options) => {
    const {
        onMessageCallback,
        onSaveTokenCallback
    } = options;
    unSubscribeTokenRefresh = messaging.onTokenRefresh(() => getFCMToken().then(onSaveTokenCallback));
    unSubscribeMessage = messaging.onMessage(onMessageCallback);
};

export const unSubscribeMessaging = async (deletedToken, errCallback) => {
    if (unSubscribeMessage) {
        unSubscribeMessage();
    }
    if (unSubscribeTokenRefresh) {
        unSubscribeTokenRefresh();
    }   
    try {
        await messaging.deleteToken(deletedToken);
    }
    catch (e) {
        errCallback(e);
    }
};