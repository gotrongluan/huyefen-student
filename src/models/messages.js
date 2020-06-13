import CONVERSATIONS from '@/assets/fakers/conversations';
import OLD_CONVERSATIONS from '@/assets/fakers/oldConversations';
import { delay } from '@/utils/utils';
import { message } from 'antd';

export default {
    namespace: 'messages',
    state: {
        hasMore: true,
        list: null
    },
    effects: {
        *fetch(action, { call, put, fork, take, cancel, cancelled }) {
            const task = yield fork(function*() {
                try {
                    yield delay(10000);
                    yield put({
                        type: 'save',
                        payload: {
                            data: CONVERSATIONS,
                            hasMore: true
                        }
                    });
                    yield put({ type: 'messagesFetchOk' });
                }
                finally {
                    if (yield cancelled())
                        yield put({ type: 'clear' });
                }
            });
            const _action = yield take(['messagesFetchOk', 'messagesFetchError', 'messagesResetted']);
            if (_action.type === 'messagesResetted')
                yield cancel(task);
        },
        *more(action, { call, put, select, fork, take, cancel, cancelled }) {
            const task = yield fork(function* () {
                try {
                    const { list } = yield select(state => state.messages);
                    //
                    yield delay(1100);
                    yield put({
                        type: 'push',
                        payload: {
                            data: OLD_CONVERSATIONS,
                            hasMore: false
                        }
                    });
                    yield put({ type: 'messagesMoreOk' });
                }
                finally {
                    if (yield cancelled())
                        yield put({ type: 'clear' });
                }
            });
            const _action = yield take(['messagesMoreOk', 'messagesMoreError', 'messagesResetted']);
            if (_action.type === 'resetted')
                yield cancel(task);
        },
        *reset(action, { put }) {
            yield put({ type: 'messagesResetted' });
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
                list: {
                    ...state.list,
                    ...data
                }
            };
        },
        shift(state, { payload }) {
            if (!state.list) return state;
            return {
                ...state,
                list: {
                    ...state.list,
                    [payload._id]: payload
                }
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