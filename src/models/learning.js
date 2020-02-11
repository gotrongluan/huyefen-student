import { delay } from '@/utils/utils';
import { message } from 'antd';
import COURSE_INFO from '@/assets/fakers/courseLearningInfo';

const initialState = {
    info: null
};

export default {
    namespace: 'learning',
    state: initialState,
    effects: {
        *fetchInfo({ payload: courseId }, { call, put }) {
            yield delay(1500);
            //fetch Info by courseId
            yield put({
                type: 'saveInfo',
                payload: COURSE_INFO
            });
        },
        *validCourse({ payload }, { call }) {
            const { courseId, onOk, onInvalidCourse, onInvalidStudent } = payload;
            yield delay(1000);
            //call api isValidCourse(courseId)
            const validStatus = 2;
            if (validStatus === 0) onOk();
            else if (validStatus === 1) onInvalidCourse();
            else onInvalidStudent();
        },
    },
    reducers: {
        saveInfo(state, { payload }) {
            return {
                ...state,
                info: { ...payload }
            }
        },
        resetInfo(state, { payload }) {
            return {
                ...state,
                info: null
            };
        }
    }
}