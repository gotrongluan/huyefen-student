import _ from 'lodash';
import { delay } from '@/utils/utils';
import COURSE_INFO from '@/assets/fakers/courseInfo';
import OVERVIEW from '@/assets/fakers/overview';
import SYLLABUS from '@/assets/fakers/syllabus';
import RELATED_COURSES from '@/assets/fakers/relatedCourses';
import INSTRUCTORS from '@/assets/fakers/instructors';
import REVIEWS from '@/assets/fakers/reviews';

export default {
    namespace: 'detail',
    state: {
        info: null,
        overview: null,
        syllabus: null,
        relatedCourses: null,
        instructors: null,
        reviews: null
    },
    effects: {
        *fetchInfo({ payload: courseId }, { call, put }) {
            //
            yield delay(1500);
            yield put({
                type: 'saveInfo',
                payload: COURSE_INFO
            });
        },
        *fetchOverview({ payload: courseId }, { call, put }) {
            yield delay(1400);
            yield put({
                type: 'saveOverview',
                payload: OVERVIEW
            });
        },
        *fetchSyllabus({ payload: courseId }, { call, put }) {
            yield delay(3300);
            yield put({
                type: 'saveSyllabus',
                payload: SYLLABUS 
            });
        },
        *fetchRelatedCourses({ payload: courseId }, { call, put }) {
            yield delay(2000);
            yield put({
                type: 'saveRelatedCourses',
                payload: RELATED_COURSES
            });
        },
        *fetchInstructors({ payload: courseId }, { call, put }) {
            yield delay(2500);
            yield put({
                type: 'saveInstructors',
                payload: INSTRUCTORS
            });
        },
        *fetchReviews({ payload: courseId }, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'saveReviews',
                payload: REVIEWS
            });
        },
        *moreReviews(action, { call, put, select }) {
            const {
                info: { _id: courseId },
                reviews: { list }
            } = yield select(state => state.detail);
            //
            yield delay(1200);
            yield put({
                type: 'addReviews',
                payload: REVIEWS.list
            })
        },
        *preview() {

        },
        *vote({ payload }, { call, put, select }) {
            const { type, reviewId, value, oldValue } = payload;
            yield put({
                type: 'saveVote',
                payload: {
                    type,
                    reviewId,
                    value
                }
            });
            yield delay(1000);
            //if (error) yield put({ saveVote, oldValue })
            //call api (reviewId, value);
            //after finish, update 
        }
    },
    reducers: {
        saveInfo(state, { payload: info }) {
            return { ...state, info };
        },
        saveOverview(state, { payload: overview }) {
            return { ...state, overview };
        },
        saveSyllabus(state, { payload: syllabus }) {
            return { ...state, syllabus };
        },
        saveInstructors(state, { payload: instructors }) {
            return { ...state, instructors };
        },
        saveRelatedCourses(state, { payload: relatedCourses }) {
            return { ...state, relatedCourses };
        },
        saveReviews(state, { payload: reviews }) {
            return { ...state, reviews };
        },
        reset(state) {
            return {
                info: null,
                reviews: null,
                instructors: null,
                syllabus: null,
                overview: null,
                relatedCourses: null
            };
        },
        addReviews(state, { payload: newReviews }) {
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    list: [
                        ...state.reviews.list,
                        ...newReviews
                    ]
                }
            };
        },
        saveVote(state, { payload }) {
            const { reviewId, type, value } = payload;
            const attr = type === 'default' ? 'list' : 'featured';
            const list = [...state.reviews[attr]];
            const index = _.findIndex(list, ['_id', reviewId]);
            list[index].status = value;
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    [type]: [...list]
                }
            }
        }
    }
}