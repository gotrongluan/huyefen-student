import * as friendService from '@/services/friend';
import _ from 'lodash';
import { delay } from '@/utils/utils';
import COURSES from '@/assets/fakers/friendCourses';
import FRIENDS from '@/assets/fakers/friends';

const initialState = {
    info: null,
    courses: {
        hasMore: true,
        list: null
    },
    friends: {
        hasMore: true,
        list: null
    }
};
export default {
    namespace: 'friend',
    state: initialState,
    effects: {
        *fetch({ payload: friendId }, { call, put }) {
            const response = yield call(friendService.fetch, friendId);
            if (response) {
                yield put({ type: 'save', payload: response.data });
            }
        },
        *fetchCourses({ payload: friendId }, { call, put }) {
            yield delay(2000);
            yield put({
                type: 'saveCourses',
                payload: {
                    hasMore: true,
                    data: COURSES
                }
            });
        },
        *fetchFriends({ payload: friendId }, { call, put }) {
            const response = yield call(friendService.fetchFriendsOfFriend, friendId);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'saveFriends',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        *moreCourses({ payload: friendId }, { call, put, select }) {
            const { friends: { list } } = yield select(state => state.friend);
            

            yield delay(1800);
            yield put({
                type: 'pushCourses',
                payload: {
                    hasMore: true,
                    data: COURSES
                }
            });
        },
        *moreFriends({ payload: friendId }, { call, put, select }) {
            const { friends: { list } } = yield select(state => state.friend);
            const noOfCurrentFriends = _.size(list);
            const page = noOfCurrentFriends / 9;
            const response = yield call(friendService.fetchFriendsOfFriend, friendId, page + 1);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'pushFriends',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        *allFriends({ payload: friendId }, { call, put, select }) {
            const { friends: { list } } = yield select(state => state.friend);
            const noOfCurrentFriends = _.size(list);
            const response = yield call(friendService.allFriendsOfFriend, friendId, noOfCurrentFriends);
            if (response) {
                const { hasMore, list } = response;
                yield put({ 
                    type: 'pushFriends',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        *allCourses({ payload: friendId }, { call, put, select }) {
            const { courses: { list } } = yield select(state => state.friend);
            yield delay(1800);
            yield put({
                type: 'pushCourses',
                payload: {
                    hasMore: false,
                    data: COURSES
                }
            });
        },
        *addFriend({ payload: friendId }, { call, put }) {
            yield put({
                type: 'saveStatus',
                payload: 2
            });
            const response = yield call(friendService.addFriend, friendId);
            if (response) {
                const errorCode = 1 * response.errorCode;
                if (errorCode === 1) {
                    yield put({ type: 'saveStatus', payload: 1 });
                } 
            }
        },
        *cancelInvitation({ payload: friendId }, { call, put }) {
            yield put({
                type: 'saveStatus',
                payload: 1
            });
            const response = yield call(friendService.cancelInvitation, friendId);
            if (response) {
                const errorCode = 1 * response.errorCode;
                if (errorCode === 1) {
                    yield put({ type: 'saveStatus', payload: 2 });
                } 
            }
        },
        *acceptInvitation({ payload: friendId }, { call, put }) {
            //for backend --> send notification to friend.
            yield put({
                type: 'saveStatus',
                payload: 4
            });
            yield delay(1200);
            // yield put({
            //     type: 'saveStatus',
            //     payload: 3
            // });
        },
        *rejectInvitation({ payload: friendId }, { call, put }) {
            yield put({
                type: 'saveStatus',
                payload: 1
            });
            yield delay(1200);
            // yield put({
            //     type: 'saveStatus',
            //     payload: 3
            // });
        },
        *unfriend({ payload: friendId }, { call, put }) {
            yield put({
                type: 'saveStatus',
                payload: 1
            });
            yield delay(1300);
            // yield put({
            //     type: 'saveStatus',
            //     payload: 4
            // });
        },
        *chat({ payload }, { call }) {
            const { friendId, onYes, onNo } = payload;
            //check conversation with friendId exist?
            //if exist --> onYes, else onNo
            yield delay(1500);
            //exists
            const exist = false;
            if (exist) onYes('conver_id_10');
            else onNo();
        }
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                info: payload
            };
        },
        saveCourses(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                courses: {
                    hasMore,
                    list: [...data]
                }
            };
        },
        saveStatus(state, { payload: status }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    status
                }
            };
        },
        saveFriends(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                friends: {
                    hasMore,
                    list: [...data]
                }
            };
        },
        pushCourses(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                courses: {
                    hasMore,
                    list: [
                        ...state.courses.list,
                        ...data
                    ]
                }
            };
        },
        pushFriends(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                friends: {
                    hasMore,
                    list: [
                        ...state.friends.list,
                        ...data
                    ]
                }
            };
        },
        reset() {
            return { ...initialState };
        }
    }
}