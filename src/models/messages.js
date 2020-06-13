import CONVERSATIONS from '@/assets/fakers/conversations';
import OLD_CONVERSATIONS from '@/assets/fakers/oldConversations';
import { delay } from '@/utils/utils';
import * as messengerService from '@/services/messenger';
import _ from 'lodash';

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
                    const response = yield call(messengerService.fetchConversations);
                    if (response) {
                        const { hasMore, list } = response.data;
                        yield put({
                            type: 'save',
                            payload: {
                                data: list,
                                hasMore
                            }
                        });
                        yield put({ type: 'messagesFetchOk' });
                    }
                    else yield put({ type: 'messagesFetchError' });
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
                    const currentExisted = _.size(_.toArray(list));
                    const response = yield call(messengerService.fetchConversations, currentExisted);
                    if (response) {
                        const { hasMore, list } = response;
                        yield put({
                            type: 'push',
                            payload: {
                                data: list,
                                hasMore
                            }
                        });
                        yield put({ type: 'messagesMoreOk' });
                    }
                    else yield put({ type: 'messageMoreError' });
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
        dscSeenCount(state, { payload }) {
            const { value, converId } = payload;
            if (!state.list || !state.list[converId])
                return state;
            return {
                ...state,
                list: {
                    ...state.list,
                    [converId]: {
                        ...state.list[converId],
                        unseen: state.list[converId].unseen - value
                    }
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