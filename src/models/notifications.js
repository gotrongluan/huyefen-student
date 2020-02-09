import { delay } from '@/utils/utils';
import NOTIFICATIONS from '@/assets/fakers/notifications';
import { message } from 'antd';

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
                    yield delay(14000);
                    yield put({
                        type: 'save',
                        payload: {
                            data: NOTIFICATIONS,
                            hasMore: true
                        }
                    });
                    yield put({ type: 'notifications/fetchOk' });
                }
                finally {
                    if (yield cancelled())
                        yield put({ type: 'clear' });
                }
            });
            const _action = yield take(['notifications/fetchOk', 'notifications/fetchError', 'notifications/resetted']);
            if (_action.type === 'notifications/resetted')
                yield cancel(task);
        },
        *more(action, { call, put, select, fork, take, cancel, cancelled }) {
            const task = yield fork(function* () {
                try {
                    const { list } = yield select(state => state.notifications);
                    //
                    yield delay(1100);
                    yield put({
                        type: 'push',
                        payload: {
                            data: NOTIFICATIONS,
                            hasMore: false
                        }
                    });
                    yield put({ type: 'notifications/moreOk' });
                }
                finally {
                    if (yield cancelled())
                        yield put({ type: 'clear' });
                }
            });
            const _action = yield take(['notifications/moreOk', 'notifications/moreError', 'notifications/resetted']);
            if (_action.type === 'notifications/resetted')
                yield cancel(task);
        },
        *reset(action, { put }) {
            yield put({ type: 'notifications/resetted' });
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
        clear() {
            return {
                hasMore: true,
                list: null
            };
        }
    }
}