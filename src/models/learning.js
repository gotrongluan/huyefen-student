import { delay } from '@/utils/utils';
import { message } from 'antd';
import COURSE_INFO from '@/assets/fakers/courseLearningInfo';
import COURSE_OVERVIEW from '@/assets/fakers/courseOverview';
import INSTRUCTORS from '@/assets/fakers/instructors';

const REVIEW = {
    _id: 1,
    starRating: 3.5,
    comment: '<p>Hi Nick, This is a really good beginner\'s Django 2.2 course. I have bought your advanced one as I want to know about CRUD functions in Django and forms. Your explanations are clear and precise. I like your sense of humour in the course. If you can please produce courses on more frameworks of python like flask and using different databases for example MongoDB. Well Done Nick on creating this course.</p><div>This is a very good course. I think if I want to fuck my love, I will learn this course. Thao is my ex-girl friend. I put my pennis into her and she feel very very Oh oh.</div><div>I will be here today. See you again!!</div>',
    createdAt: 1578813445900
};

const initialState = {
    info: null,
    overview: null,
    instructors: null,
    review: null
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
        *fetchReview({ payload: courseId }, { call, put }) {
            yield delay(1100);
            //empty review = {}
            yield put({
                type: 'saveReview',
                payload: REVIEW
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
        },
        saveReview(state, { payload }) {
            return {
                ...state,
                review: { ...payload }
            }
        },
        resetReview(state) {
            return { ...state, review: null };
        }
    }
}