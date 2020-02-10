import { delay } from '@/utils/utils';
import COURSES from '@/assets/fakers/friendCourses';
import FRIENDS from '@/assets/fakers/friends';
const FRIEND = {
    _id: 1,
    name: 'Ngọc Hạnh Vương',
    avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/51059227_2091470127614437_5419405170205261824_o.jpg?_nc_cat=106&_nc_ohc=LnSzD5KUUN4AX8EolVa&_nc_ht=scontent.fdad1-1.fna&oh=95b1eba87a97f6266a625c07caf68566&oe=5EAE6D56',
    status: 3
};

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
        *fetch(action, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'save',
                payload: FRIEND
            });
        },
        *fetchCourses(action, { call, put }) {
            yield delay(2000);
            yield put({
                type: 'saveCourses',
                payload: {
                    hasMore: true,
                    data: COURSES
                }
            });
        },
        *fetchFriends(action, { call, put }) {
            yield delay(2300);
            yield put({
                type: 'saveFriends',
                payload: {
                    hasMore: true,
                    data: FRIENDS
                }
            });
        },
        *moreCourses(action, { call, put, select }) {
            const { courses: { list } } = yield select(state => state.friend);
            yield delay(1800);
            yield put({
                type: 'pushCourses',
                payload: {
                    hasMore: true,
                    data: COURSES
                }
            });
        },
        *moreFriends(action, { call, put, select }) {
            const { courses: { list } } = yield select(state => state.friend);
            yield delay(1800);
            yield put({
                type: 'pushFriends',
                payload: {
                    hasMore: true,
                    data: FRIENDS
                }
            });
        },
        *allFriends(action, { call, put, select }) {
            const { courses: { list } } = yield select(state => state.friend);
            yield delay(1800);
            yield put({
                type: 'pushFriends',
                payload: {
                    hasMore: false,
                    data: FRIENDS
                }
            });
        },
        *allCourses(action, { call, put, select }) {
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
            
        },
        *cancelInvitation({ payload: friendId }, { call, put }) {

        },
        *acceptInvitation({ payload: friendId }, { call, put }) {

        },
        *rejectInvitation({ payload: friendId }, { call, put }) {

        },
        *unfriend({ payload: friendId }, { call, put }) {

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