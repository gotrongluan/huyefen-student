import { delay } from '@/utils/utils';
import NOTIFICATIONS from '@/assets/fakers/notifications';
import * as notificationsService from '@/services/notification';
import { message } from 'antd';
import _ from 'lodash';

export default {
    namespace: 'notifications',
    state: {
        hasMore: true,
        list: null
    },
    effects: {
        *fetch(action, { call, put, fork, take, cancel, cancelled }) {
            const task = yield fork(function*() {
                try {
                    const response = yield call(notificationsService.fetch);
                    if (response) {
                        const { hasMore, list } = response.data;
                        yield put({
                            type: 'save',
                            payload: {
                                hasMore,
                                data: list
                            }
                        });
                        yield put({ type: 'notificationsFetchOk' });
                    }
                    else yield put({ type: 'notificationsFetchError' });
                }
                finally {
                    if (yield cancelled())
                        yield put({ type: 'clear' });
                }
            });
            const _action = yield take(['notificationsFetchOk', 'notificationsFetchError', 'notificationsResetted']);
            if (_action.type === 'notificationsResetted')
                yield cancel(task);
        },
        *more(action, { call, put, select, fork, take, cancel, cancelled }) {
            const task = yield fork(function* () {
                try {
                    const { list } = yield select(state => state.notifications);
                    const currentSize = _.size(list);
                    const response = yield call(notificationsService.fetch, currentSize);
                    if (response) {
                        const { hasMore, list } = response.data;
                        yield put({
                            type: 'push',
                            payload: {
                                data: list,
                                hasMore
                            }
                        });
                        yield put({ type: 'notificationsMoreOk' });
                    }
                    else yield put({ type: 'notificationsFetchError' });
                }
                finally {
                    if (yield cancelled())
                        yield put({ type: 'clear' });
                }
            });
            const _action = yield take(['notificationsMoreOk', 'notificationsMoreError', 'notificationsResetted']);
            if (_action.type === 'notificationsResetted')
                yield cancel(task);
        },
        *read({ payload: notifyId }, { call, put, select }) {
            yield put({
                type: 'seen',
                payload: {
                    notifyId,
                    seen: true
                }
            });
            const response = yield call(notificationsService.seen, notifyId);
            if (response) {
                const status = response.data;
                if (!status) {
                    yield put({
                        type: 'seen',
                        payload: {
                            notifyId,
                            seen: false
                        }
                    });
                }
                else {
                    const noOfUsNotification = yield select(state => state.user.noOfUsNotification);
                    yield put({
                        type: 'user/saveNoUsNotification',
                        payload: noOfUsNotification - 1
                    });
                }
            }
        },
        *maskAllAsRead(action, { call, put }) {
            const response = yield call(notificationsService.allSeen);
            if (response) {
                yield put({
                    type: 'allSeen'
                });
                yield put({
                    type: 'user/saveNoUsNotification',
                    payload: 0
                })
            }
        },
        *reset(action, { put }) {
            yield put({ type: 'notificationsResetted' });
            yield put({ type: 'clear' });
        }
    },
    reducers: {
        save(state, { payload }) {
            const { data, hasMore } = payload;
            return {
                ...state,
                hasMore,
                list: data
            };
        },
        push(state, { payload }) {
            const { data, hasMore } = payload;
            if (!state.list) return { ...state };
            return {
                ...state,
                hasMore,
                list: [
                    ...state.list,
                    ...data
                ]
            };
        },
        shift(state, { payload: notification }) {
            return {
                ...state,
                list: [
                    notification,
                    ...state.list
                ]
            };
        },
        seen(state, { payload }) {
            const { notifyId, seen } = payload;
            const notifications = [...state.list];
            const index = _.findIndex(notifications, ['_id', notifyId]);
            notifications[index] = {
                ...notifications[index],
                seen
            };
            return {
                ...state,
                list: [...notifications]
            };
        },
        allSeen(state) {
            if (!state.list) return { ...state };
            let notifications = [...state.list];
            notifications = _.map(notifications, data => ({
                ...data,
                seen: true
            }));
            return {
                ...state,
                list: [...notifications]
            };
        },
        clear() {
            return {
                hasMore: true,
                list: null
            };
        }
    }
}