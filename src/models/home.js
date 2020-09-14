import { fetchMyCourses, fetchRecommendCourses } from '@/services/myCourses';

export default {
  namespace: 'home',
  state: {
    myCourses: null,
    recommendCourses: null,
  },
  effects: {
    *fetchMyCourses(_, { call, put }) {
      const response = yield call(fetchMyCourses, 'complete-non', 0, 6);
      if (response) {
        yield put({
          type: 'saveMyCourses',
          payload: response.data.list
        });
      }
    },
    *fetchRecommendCourses(_, { call, put }) {
      const response = yield call(fetchRecommendCourses);
      if (response) {
        yield put({
          type: 'saveRecommendCourses',
          payload: response.data
        });
      }
    }
  },
  reducers: {
    resetHomeCourses() {
      return {
        myCourses: null,
        recommendCourses: null
      };
    },
    saveMyCourses(state, { payload }) {
      return {
        ...state,
        myCourses: payload
      }
    },
    saveRecommendCourses(state, { payload }) {
      return {
        ...state,
        recommendCourses: payload
      };
    }
  }
}
