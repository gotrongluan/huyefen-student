import { delay } from '@/utils/utils';
import { message } from 'antd';
import COURSE_INFO from '@/assets/fakers/courseLearningInfo';
import COURSE_OVERVIEW from '@/assets/fakers/courseOverview';
import INSTRUCTORS from '@/assets/fakers/instructors';

const initialState = {
    info: null,
    overview: null,
    instructors: null
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
        *fetchOverview({ payload: courseId }, { call, put }) {
            yield delay(2800);
            yield put({
                type: 'saveOverview',
                payload: COURSE_OVERVIEW
            });
        },
        *fetchInstructors({ payload: courseId }, { call, put }) {
            yield delay(1600);
            yield put({
                type: 'saveInstructors',
                payload: INSTRUCTORS
            });
        },
        *validCourse({ payload }, { call }) {
            const { courseId, onOk, onInvalidCourse, onInvalidStudent } = payload;
            yield delay(1000);
            //call api isValidCourse(courseId)
            const validStatus = 0;
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
        resetInfo(state) {
            return {
                ...state,
                info: null
            };
        },
        saveOverview(state, { payload }) {
            return { ...state, overview: { ...payload } };
        },
        resetOverview(state) {
            return { ...state, overview: null };
        },
        saveInstructors(state, { payload }) {
            return {
                ...state,
                instructors: [...payload]
            };
        },
        resetInstructors(state) {
            return { ...state, instructors: null };
        }
    }
}