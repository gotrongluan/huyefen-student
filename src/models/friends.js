import { delay } from '@/utils/utils';
import FRIENDS from '@/assets/fakers/friends';
import * as friendService from '@/services/friend';
import _ from 'lodash';

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
            const noOfCurrentFriends = _.size(list);
            const page = noOfCurrentFriends / 9;
            const response = yield call(friendService.fetchFriends, page + 1);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'push',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        *all(action, { call, put, select }) {
            const { list } = yield select(state => state.friends);
            const noOfCurrentFriends = _.size(list);
            const response = yield call(friendService.allFriends, noOfCurrentFriends);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'push',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
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