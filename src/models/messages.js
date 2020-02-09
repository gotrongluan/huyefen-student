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
                    yield delay(3000);
                    yield put({
                        type: 'save',
                        payload: {
                            data: CONVERSATIONS,
                            hasMore: true
                        }
                    });
                    yield put({ type: 'messages/fetchOk' });
                }
                finally {
                    if (yield cancelled())
                        yield put({ type: 'clear' });
                }
            });
            const _action = yield take(['messages/fetchOk', 'messages/fetchError', 'messages/resetted']);
            if (_action.type === 'messages/resetted')
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
                    yield put({ type: 'messages/moreOk' });
                }
                finally {
                    if (yield cancelled())
                        yield put({ type: 'clear' });
                }
            });
            const _action = yield take(['messages/moreOk', 'messages/moreError', 'messages/resetted']);
            if (_action.type === 'messages/resetted')
                yield cancel(task);
        },
        *reset(action, { put }) {
            yield put({ type: 'messages/resetted' });
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
        clear() {
            return {
                hasMore: true,
                list: null
            };
        }
    }
}