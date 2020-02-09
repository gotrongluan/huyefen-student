import { delay } from '@/utils/utils';
import FRIENDS from '@/assets/fakers/friends';

export default {
    namespace: 'friends',
    state: {
        hasMore: true,
        list: null
    },
    effects: {
        *fetch(action, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'save',
                payload: {
                    hasMore: true,
                    data: FRIENDS
                }
            });
        },
        *more(action, { call, put }) {
            yield delay(1300);
            yield put({
                type: 'push',
                payload: {
                    hasMore: false,
                    data: FRIENDS
                }
            })
        }
    },
    reducers: {
        save(state, { payload }) {
            const { hasMore, data } = payload;
            console.log(data);
            return {
                ...state,
                hasMore,
                list: [...data]
            }
        },
        push(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                hasMore,
                list: [
                    ...state.list,
                    ...data
                ]
            };
        },
        reset() {
            return { hasMore: true, list: null };
        }
    }
}