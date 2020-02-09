import CONVERSATIONS from '@/assets/fakers/conversations';
import OLD_CONVERSATIONS from '@/assets/fakers/oldConversations';
import { delay } from '@/utils/utils';

export default {
    namespace: 'messages',
    state: {
        hasMore: true,
        list: null
    },
    effects: {
        *fetch(action, { call, put }) {
            //call
            //hasMore....
            yield delay(1200);
            yield put({
                type: 'save',
                payload: {
                    data: CONVERSATIONS,
                    hasMore: true
                }
            });
        },
        *more(action, { call, put, select }) {
            const { list } = yield select(state => state.messages);
            //with list, specify pagination
            yield delay(1000);
            yield put({
                type: 'push',
                payload: {
                    data: OLD_CONVERSATIONS,
                    hasMore: false
                }
            });
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
            return {
                ...state,
                hasMore,
                list: {
                    ...state.list,
                    ...data
                }
            };
        },
        reset() {
            return {
                hasMore: true,
                list: null
            };
        }
    }
}