import { EffectWithType } from '@/config/constants';
import { requestPermission, subscribeMessaging, unSubscribeMessaging, getFCMToken } from '@/utils/firebase/messaging';
import storage from '@/utils/storage';
import { notification as notificationPopup } from 'antd';

export default {
    namespace: 'watcher',
    state: null,
    effects: {
        *notification({ payload: message }, { call, put }) {
            console.log(message);
        },
        firebaseRegisterWatcher: [
            function*({ take, fork, cancel, call, put }) {
                let enablePushServiceInterval = null;
                let dispatch = window.g_app._store.dispatch;
                while (yield take(['user/fetch/@@end', 'user/login/@@end'])) {
                    const registerTask = yield fork(fcmRegisterTask);
                    yield take('user/logout');
                    yield cancel(registerTask);
                    yield fork(fcmUnregisterTask);
                }

                function onSaveTokenCallback(newToken) {
                    console.log(newToken);
                    // dispatch({
                    //     type: 'fcm/saveToken',
                    //     payload: newToken
                    // });
                }

                function onMessageCallback(message) {
                    dispatch({
                        type: 'watcher/notification',
                        payload: message
                    });
                }

                function onGetTokenErrorCallback(err) {
                    notificationPopup.error({
                        message: 'Firebase get token error',
                        description: err.message
                    });
                }

                function onDeleteTokenErrorCallback(err) {
                    notificationPopup.error({
                        message: 'Firebase delete token error',
                        description: err.message
                    });
                }

                function* fcmRegisterTask() {
                    const permission = yield call(requestPermission);
                    if (!permission) {
                        if (enablePushServiceInterval)
                            clearInterval(enablePushServiceInterval);
                        enablePushServiceInterval = setInterval(() => {
                            notificationPopup.warn({
                                message: 'Bật thông báo',
                                description: 'Bật thông báo để không bỏ lỡ những tin nhắn của hệ thống.'
                            });
                        }, 8000);
                    }
                    else {
                        subscribeMessaging({
                            onMessageCallback,
                            onSaveTokenCallback
                        });
                        const token = yield call(getFCMToken, onGetTokenErrorCallback);
                        onSaveTokenCallback(token);
                    }
                }

                function* fcmUnregisterTask() {
                    if (enablePushServiceInterval) {
                        clearInterval(enablePushServiceInterval);
                        enablePushServiceInterval = null;
                    }
                    const token = storage.getFCMToken();
                    if (token) {
                        yield call(unSubscribeMessaging, token, onDeleteTokenErrorCallback);
                        storage.setFCMToken();
                    }
                }
            },
            EffectWithType.WATCHER
        ]
    }
}