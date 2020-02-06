//import * as categoryServices from '@/services/category';
import { delay } from '@/utils/utils';
import RECOMMEND from '@/assets/fakers/recommends';
import TOP_TOPICS from '@/assets/fakers/topTopics';
import INSTRUCTORS from '@/assets/fakers/instructors1';
import COURSES from '@/assets/fakers/coursesInArea';

export default {
    namespace: 'category',
    state: {
        info: null,
        topics: null,
        instructors: null,
        courses: null
    },
    effects: {
        *fetchInfo({ payload: categoryId }, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'saveInfo',
                payload: {
                    _id: 1,
                    title: 'Marketing'
                }
            });
            //const category = yield call(categoryServices.fetchInfo, categoryId);
            // if (category) {
            //     yield put({
            //         type: 'saveInfo',
            //         payload: category
            //     })
            // }
        },
        *fetchRecommendCourses({ payload: categoryId }, { call, put }) {
            yield delay(1700);
            yield put({
                type: 'saveRecommendCourses',
                payload: RECOMMEND
            })
        },
        *fetchTopTopics({ payload: categoryId }, { call, put }) {
            yield delay(1400);
            yield put({
                type: 'saveTopTopics',
                payload: TOP_TOPICS
            });
            // const task = yield fork(function*() {
            //     //yield call(categoryServices.fetchTopTopics, categoryId);
            //     //if (topics) { yield put... }
            // });
            // const action = yield take(['resetTopTopics', 'finishFetchTopTopics']);
            // if (action.type === 'resetTopTopics') {
            //     yield cancel(task);
            // }
        },
        *fetchTopInstructors({ payload: categoryId }, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'saveTopInstructors',
                payload: INSTRUCTORS
            });
        },
        *fetchCourses({ payload: categoryId }, { call, put }) {
            //categoryId put in FILTERS., pagination = 1, sort = default (highest rated)
            yield delay(1800);
            yield put({
                type: 'saveCourses',
                payload: COURSES
            })
        },
        *sortCourses({ payload: sortBy }, { call, select, put }) {
            const {
                courses
            } = yield select(state => state.category);
            //call api with sortBy, filters, pagination = 1...
            yield delay(1000);
            yield put({
                type: 'saveCourses',
                payload: {
                    ...courses,
                    sortBy
                }
            });
        },
        *clear({ payload: categoryId }, { call, put, select }) {
            const {
                courses: { sortBy }
            } = yield select(state => state.category);
            //call api with categoryId, no filters, pagination = 1, sortBy still the same as before.
            yield delay(1100);
            // yield put({
            //     type: 'saveCourses',
            //     payload: {}
            // });
        },
        *filter({ payload }, { select, call, put }) {
            const { type, option, checked } = payload;
            const {
                courses: { filters, sortBy }
            } = yield select(state => state.category);
            //handle filters
            //make params for api call, pagination = 1
            yield delay(1300);
            //yield call
            //yield put
        },
        *changePage({ payload: page }, { call, select, put }) {
            const {
                courses: { filters, sortBy }
            } = yield select(state => state.category);
            //make api call with new page
            yield delay(1200);
            //yield call
            //yield put
        }
    },
    reducers: {
        saveInfo(state, { payload: info }) {
            return { ...state, info };
        },
        saveRecommendCourses(state, { payload: recommend }) {
            return { ...state, recommend };
        },
        saveTopTopics(state, { payload: topics }) {
            return { ...state, topics };
        },
        saveTopInstructors(state, { payload: instructors }) {
            return { ...state, instructors };
        },
        saveCourses(state, { payload: courses }) {
            return { ...state, courses };
        },
        resetInfo(state) {
            return { ...state, info: null };
        },
        resetTopics(state) {
            return { ...state, topics: null };
        },
        resetInstructors(state) {
            return { ...state, instructors: null };
        },
        resetCourses(state) {
            return { ...state, courses: null };
        }
    }
}