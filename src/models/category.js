//import * as categoryServices from '@/services/category';
import * as areaServices from '@/services/area';
import { createFilterStrFromNormalize, createNormalizeFilters, delay, updateOneFilter } from '@/utils/utils';
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
        *fetchInfo({ payload }, { call, put }) {
            const { areaId, categoryId } = payload;
            const response = yield call(areaServices.fetchCategoryInfo, areaId, categoryId);
            if (response) {
                yield put({
                    type: 'saveInfo',
                    payload: response.data
                });
            }
        },
        *fetchRecommendCourses({ payload: categoryId }, { call, put }) {
          const response = yield call(areaServices.fetchRecommendCoursesOfCategory, categoryId);
          if (response) {
            yield put({
              type: 'saveRecommendCourses',
              payload: response.data
            });
          }
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
        *fetchCourses({ payload }, { call, put }) {
            const { categoryId, areaId } = payload;
            const response = yield call(areaServices.fetchCoursesOfCategory, areaId, categoryId);
            if (response) {
                yield put({
                    type: 'saveCourses',
                    payload: response.data
                });
            }
        },
        *sortCourses({ payload: sortBy }, { call, select, put }) {
            const {
                info: { areaId, _id: categoryId },
                courses: { filters }
            } = yield select(state => state.category);
            const normalizeFilter = createNormalizeFilters(filters);
            const filterStr = createFilterStrFromNormalize(normalizeFilter);
            const response = yield call(areaServices.fetchCoursesOfCategory, areaId, categoryId, filterStr, sortBy, 1);
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
        *clear({ payload }, { call, put, select }) {
            const {
                info: { areaId, _id: categoryId },
                courses: { sortBy }
            } = yield select(state => state.category);
            const response = yield call(areaServices.fetchCoursesOfCategory, areaId, categoryId, '', sortBy);
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
                info: { areaId, _id: categoryId },
                courses: { filters, sortBy }
            } = yield select(state => state.category);
            const normalizeFilter = createNormalizeFilters(filters);
            if (normalizeFilter[type]) {
                normalizeFilter[type] = updateOneFilter(normalizeFilter[type], option, checked);
            }
            const filterStr = createFilterStrFromNormalize(normalizeFilter);
            const response = yield call(areaServices.fetchCoursesOfCategory, areaId, categoryId, filterStr, sortBy);
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
                info: { _id: categoryId, areaId },
                courses: { filters, sortBy }
            } = yield select(state => state.category);
            const normalizeFilter = createNormalizeFilters(filters);
            const filterStr = createFilterStrFromNormalize(normalizeFilter);
            const response = yield call(areaServices.fetchCoursesOfCategory, areaId, categoryId, filterStr, sortBy, page);
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
            if (filterType !== 'topics') {
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
