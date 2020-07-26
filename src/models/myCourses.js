import * as myCoursesServices from '@/services/myCourses';

export default {
    namespace: 'myCourses',
    state: null,
    effects: {
        *fetch(action, { call, put }) {
            const response = yield call(myCoursesServices.fetchMyCourses, 'recent-enroll', 0, 4);
            if (response) {
                yield put({
                    type: 'save',
                    payload: response.data.list
                })
            }
        }
    },
    reducers: {
        save(state, { payload }) {
            return [...payload];
        },
        reset() {
            return null;
        }
    }
}