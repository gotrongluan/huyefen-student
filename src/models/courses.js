import _ from 'lodash';
import MY_COURSES from '@/assets/fakers/mycourses';
import FRIENDS from '@/assets/fakers/topFriends';
import { delay } from '@/utils/utils';

const CATEGORIES = [
    {
        _id: 1,
        title: 'Web Development'
    },
    {
        _id: 2,
        title: 'Machine Learning'
    },
    {
        _id: 3,
        title: 'Marketing'
    },
    {
        _id: 4,
        title: 'Career Development'
    }
];

const PROGRESSES = [
    {
        key: 'not-started',
        title: 'Not started'
    },
    {
        key: 'inprogress',
        title: 'Inprogress'
    },
    {
        key: 'completed',
        title: 'Completed'
    }
];

const INSTRUCTORS = [
    {
        _id: 1,
        name: 'Ngoc Hanh Vuong'
    },
    {
        _id: 2,
        name: 'Phuoc Nguyen Ho Minh'
    },
    {
        _id: 3,
        name: 'Minh Tran Quang'
    },
    {
        _id: 4,
        name: 'Manh Le Duc'
    },
    {
        _id: 5,
        name: 'Huy Tran Canh'
    },
    {
        _id: 6,
        name: 'Khang Nguyen An'
    }
];

const initialState = {
    friends: {
        total: null,
        list: null
    },
    sortBy: 'a-z',
    category: null,
    progress: null,
    instructor: null,
    filters: {
        categories: null,
        progresses: null,
        instructors: null,
    },
    loadMore: true,
    list: null
};

export default {
    namespace: 'courses',
    state: initialState,
    effects: {
        *fetch(action, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'save',
                payload: MY_COURSES
            })
        },
        *fetchFriends(action, { call, put }) {
            yield delay(3000);
            yield put({
                type: 'saveFriends',
                payload: {
                    total: 49,
                    list: FRIENDS
                }
            });
        },
        *fetchOptions(action, { call, put }) {
            yield delay(1000);
            yield put({
                type: 'saveOptions',
                payload: {
                    categories: CATEGORIES,
                    progresses: PROGRESSES,
                    instructors: INSTRUCTORS
                }
            })
        },
        *sort({ payload: sortBy }, { call, put, select }) {
            const { category, progress, instructor } = yield select(state => state.courses);
            //sort with sortBy, page = 1, filters
            yield delay(1500);
            yield put({
                type: 'save',
                payload: MY_COURSES
            });
        },
        *filter({ payload }, { call, put, select }) {
            const { sortBy } = yield select(state => state.courses);
            const { category = null, progress = null, instructor = null } = payload;
            //filter with sortBy, pagination = 1. 
            yield delay(1600);
            yield put({
                type: 'save',
                payload: MY_COURSES
            });
            yield put({
                type: 'saveFilters',
                payload: {
                    category, progress, instructor
                }
            })
        },
        *reset(action, { call, put, select }) {
            const { sortBy } = yield select(state => state.courses);
            yield put({
                type: 'fetchOptions'
            });
            yield delay(2000);
            yield put({
                type: 'save',
                payload: MY_COURSES
            });
            yield put({
                type: 'saveFilters',
                payload: {
                    category: null,
                    progress: null,
                    instructor: null
                }
            });
        },
        *moreCourses(action, { call, put, select }) {
            const {
                sortBy,
                category,
                instructor,
                progress,
                list
            } = yield select(state => state.courses);
            //fetch courses with filters, sort
            //check loadMore
            yield delay(1700);
            yield put({
                type: 'push',
                payload: MY_COURSES
            });
            // yield put({
            //     type: 'saveLoadmore',
            //     payload: false
            // });
        },
        *allCourses(action, { call, put, select }) {
            const {
                sortBy,
                category,
                instructor,
                progress,
                list
            } = yield select(state => state.courses);
            //fetch courses with filters, sort
            //check loadMore
            yield delay(2700);
            yield put({
                type: 'push',
                payload: [...MY_COURSES, ...MY_COURSES]
            });
            yield put({
                type: 'saveLoadmore',
                payload: false
            });
        },
        *fetchCategories({ payload }, { call, put }) {
            const {
                progress = null,
                instructor = null
            } = payload;
            //fetch categories with instructor, progress
            yield delay(1200);
            yield put({
                type: 'saveCategories',
                payload: _.slice(CATEGORIES, 0, 3)
            });
        },
        *fetchProgresses({ payload }, { call, put }) {
            const {
                category = null,
                instructor = null
            } = payload;
            //
            yield delay(1400);
            yield put({
                type: 'saveProgresses',
                payload: _.slice(PROGRESSES, 0, 1)
            });
        },
        *fetchInstructors({ payload }, { call, put }) {
            const {
                category = null,
                progress = null
            } = payload;
            //
            yield delay(1300);
            yield put({
                type: 'saveInstructors',
                payload: _.slice(INSTRUCTORS, 0, 4)
            });
        },
        *addFriends({ payload }, { call, put }) {
            const { start, end, callback } = payload;
            const skip = start * 5;
            const limit = (end - start) * 5;
            let fooArr = [];
            for (let i = 0; i < (end - start); ++i)
                fooArr = _.concat(fooArr, FRIENDS);
            yield delay(1500);
            yield put({
                type: 'pushFriends',
                payload: fooArr         //replace by friends result
            });
            if (callback) callback();
        },
        *recommend({ payload }, { call, put }) {
            const { selectedFriendIds, courseId, callback } = payload;
            yield delay(2500);
            if (callback) callback();
        }
    },
    reducers: {
        save(state, { payload: courses }) {
            return { ...state, list: courses };
        },
        saveOptions(state, { payload }) {
            return {
                ...state,
                filters: { ...payload }
            };
        },
        clear() {
            return { ...initialState };
        },
        saveFilters(state, { payload }) {
            return { ...state, ...payload };
        },
        push(state, { payload: newCourses }) {
            return {
                ...state,
                list: [
                    ...state.list,
                    ...newCourses
                ]
            };
        },
        saveLoadmore(state, { payload: value }) {
            return { ...state, loadMore: value };
        },
        saveCategories(state, { payload: categories }) {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    categories
                }
            }
        },
        saveProgresses(state, { payload: progresses }) {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    progresses
                }
            }
        },
        saveInstructors(state, { payload: instructors }) {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    instructors
                }
            }
        },
        saveFriends(state, { payload }) {
            return {
                ...state,
                friends: { ...payload }
            };
        },
        pushFriends(state, { payload: newFriends }) {
            return {
                ...state,
                friends: {
                    ...state.friends,
                    list: [
                        ...state.friends.list,
                        ...newFriends
                    ]
                }
            }
        }
    }
}