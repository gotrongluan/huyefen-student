import { delay } from '@/utils/utils';
import FRIENDS from '@/assets/fakers/friends';
import * as friendService from '@/services/friend';

export default {
    namespace: 'friends',
    state: {
        hasMore: true,
        list: null
    },
    effects: {
        *fetch(action, { call, put }) {
            const response = yield call(friendService.fetchFriends);
            if (response) {
                const {
                    hasMore,
                    list
                } = response.data;
                yield put({
                    type: 'save',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        *more(action, { call, put, select }) {
            const { list } = yield select(state => state.friends);
            yield delay(1300);
            yield put({
                type: 'push',
                payload: {
                    hasMore: true,
                    data: FRIENDS
                }
            });
        },
        *all(action, { call, put, select }) {
            const { list } = yield select(state => state.friends);
            yield delay(1300);
            yield put({
                type: 'push',
                payload: {
                    hasMore: false,
                    data: FRIENDS
                }
            });
        }
    },
    reducers: {
        save(state, { payload }) {
            const { hasMore, data } = payload;
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