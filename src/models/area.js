//import * as areaServices from '@/services/area';
import { message } from 'antd';
import { delay, createFilterStrFromNormalize, createNormalizeFilters, updateOneFilter } from '@/utils/utils';
import * as areaServices from '@/services/area';
import RECOMMEND from '@/assets/fakers/recommends';
import TOP_TOPICS from '@/assets/fakers/topTopics';
import INSTRUCTORS from '@/assets/fakers/instructors1';
import COURSES from '@/assets/fakers/coursesInArea';

export default {
    namespace: 'area',
    state: {
        info: null,
        topics: null,
        instructors: null,
        courses: null
    },
    effects: {
        *fetchInfo({ payload: areaId }, { call, put }) {
            const response = yield call(areaServices.fetchInfo, areaId);
            if (response) {
                yield put({
                    type: 'saveInfo',
                    payload: response.data
                });
            }
        },
        *fetchRecommendCourses({ payload: areaId }, { call, put }) {
            yield delay(1700);
            yield put({
                type: 'saveRecommendCourses',
                payload: RECOMMEND
            })
        },
        *fetchTopTopics({ payload: areaId }, { call, put }) {
            yield delay(1400);
            yield put({
                type: 'saveTopTopics',
                payload: TOP_TOPICS
            });
            // const task = yield fork(function*() {
            //     //yield call(areaServices.fetchTopTopics, areaId);
            //     //if (topics) { yield put... }
            // });
            // const action = yield take(['resetTopTopics', 'finishFetchTopTopics']);
            // if (action.type === 'resetTopTopics') {
            //     yield cancel(task);
            // }
        },
        *fetchTopInstructors({ payload: areaId }, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'saveTopInstructors',
                payload: INSTRUCTORS
            });
        },
        *fetchCourses({ payload: areaId }, { call, put }) {
            const response = yield call(areaServices.fetchCourses, areaId);
            if (response) {
                yield put({
                    type: 'saveCourses',
                    payload: response.data
                });
            }
        },
        *sortCourses({ payload: sortBy }, { call, select, put }) {
            const {
                info: { _id: areaId },
                courses: { filters }
            } = yield select(state => state.area);
            const normalizeFilter = createNormalizeFilters(filters);
            const filterStr = createFilterStrFromNormalize(normalizeFilter);
            const response = yield call(areaServices.fetchCourses, areaId, filterStr, sortBy);
            if (response) {
                yield put({
                    type: 'saveCourses',
                    payload: {
                        ...response.data,
                        filters
                    }
                });
            }
        },
        *clear(action, { call, put, select }) {
            const {
                info: { _id: areaId },
                courses: { sortBy }
            } = yield select(state => state.area);
            const response = yield call(areaServices.fetchCourses, areaId, '', sortBy);
            if (response) {
                yield put({
                    type: 'saveCourses',
                    payload: response.data
                });
            }
        },
        *filter({ payload }, { select, call, put }) {
            const { type, option, checked } = payload;
            const {
                info: { _id: areaId },
                courses: { filters, sortBy }
            } = yield select(state => state.area);
            const normalizeFilter = createNormalizeFilters(filters);
            if (normalizeFilter[type]) {
                normalizeFilter[type] = updateOneFilter(normalizeFilter[type], option, checked);
            }
            const filterStr = createFilterStrFromNormalize(normalizeFilter);
            const response = yield call(areaServices.fetchCourses, areaId, filterStr, sortBy);
            if (response) {
                yield put({
                    type: 'saveCoursesWithFilter',
                    payload: {
                        data: response.data,              //list, filters, total, sortBy
                        filterType: type
                    }
                });
            }
        },
        *changePage({ payload: page }, { call, select, put }) {
            const {
                info: { _id: areaId },
                courses: { filters, sortBy }
            } = yield select(state => state.area);
            const normalizeFilter = createNormalizeFilters(filters);
            const filterStr = createFilterStrFromNormalize(normalizeFilter);
            const response = yield call(areaServices.fetchCourses, areaId, filterStr, sortBy, page);
            if (response) {
                yield put({
                    type: 'saveCourses',
                    payload: {
                        ...response.data,
                        sortBy,
                        filters
                    }             //list, filters, total, sortBy
                });
            }
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
        saveCoursesWithFilter(state, { payload }) {
            const { data, filterType } = payload;
            if (filterType !== 'topics' && data.filters[filterType].select.length > 0) {
                data.filters[filterType].list = [...state.courses.filters[filterType].list];
            }
            return {
                ...state,
                courses: data
            }
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