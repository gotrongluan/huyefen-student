import { delay } from '@/utils/utils';
import { message } from 'antd';
import _ from 'lodash';
import COURSE_INFO from '@/assets/fakers/courseLearningInfo';
import COURSE_OVERVIEW from '@/assets/fakers/courseOverview';
import INSTRUCTORS from '@/assets/fakers/instructors';
import ANNOUNCEMENTS from '@/assets/fakers/announcements';
import OLD_ANNOUNCEMENTS from '@/assets/fakers/oldAnnouncements';
import COMMENTS from '@/assets/fakers/answers';
import LECTURE_OPTIONS from '@/assets/fakers/syllabus';
import QUESTIONS from '@/assets/fakers/questions';

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
    review: null,
    forum: {
        total: null,
        list: null,
        lectureOptions: null,
        hasMore: null,
        filters: {
            lecture: 'all',
            sortBy: "recommend",
            questionTypes: []
        }
    },
    announcements: {
        hasMore: true,
        list: null
    }
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
        *fetchAnnouncements({ payload: courseId }, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'saveAnnouncements',
                payload: {
                    hasMore: true,
                    data: ANNOUNCEMENTS
                }
            })
        },
        *moreAnnouncements({ payload: courseId }, { call, put, select }) {
            const { announcements: { list } } = yield select(state => state.learning);
            yield delay(1200);
            yield put({
                type: 'pushAnnouncements',
                payload: {
                    hasMore: false,
                    data: OLD_ANNOUNCEMENTS
                }
            });
        },
        *moreComments({ payload: announcementId }, { call, put, select }) {
            yield put({
                type: 'saveCommentsLoading',
                payload: {
                    announcementId,
                    value: true
                }
            });
            const { announcements } = yield select(state => state.learning);
            const comments = announcements.list[announcementId].comments;
            //
            yield delay(1200);
            yield put({
                type: 'pushComments',
                payload: {
                    announcementId,
                    hasMore: false,
                    data: COMMENTS
                }
            })
            yield put({
                type: 'saveCommentsLoading',
                payload: {
                    announcementId,
                    value: false
                }
            });
        },
        *fetchQuestions({ payload: courseId }, { call, put }) {
            yield delay(2000);
            yield put({
                type: 'saveQuestions',
                payload: {
                    hasMore: true,
                    total: 4197,
                    data: QUESTIONS
                }
            });
        },
        *moreQuestions({ payload: courseId }, { call, put, select }) {
            const { forum } = yield select(state => state.learning);
            const {
                filters: {
                    sortBy,
                    lecture,
                    questionTypes
                },
                list
            } = forum;
            //base on list and filters values.
            yield delay(1500);
            yield put({
                type: 'pushQuestions',
                payload: {
                    hasMore: false,
                    data: QUESTIONS
                }
            });
        },
        *fetchLectureOpts({ payload: courseId }, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'saveLectureOpts',
                payload: LECTURE_OPTIONS
            });
        },
        *sortQuestions({ payload }, { call, put, select }) {
            const { courseId, value } = payload;
            yield put({
                type: 'saveFilters',
                payload: {
                    type: 'sortBy',
                    value
                }
            });
            const { forum } = yield select(state => state.learning);
            const {
                filters: {
                    lecture,
                    questionTypes
                }
            } = forum;
            //sort with lecture, types and value == sortBy
            yield delay(1500);
            yield put({
                type: 'saveQuestions',
                payload: {
                    hasMore: true,
                    total: 4197,
                    data: QUESTIONS
                }
            });
        },
        *filterQuestionsByLecture({ payload }, { call, put, select }) {
            const { courseId, value } = payload;
            yield put({
                type: 'saveFilters',
                payload: {
                    type: 'lecture',
                    value
                }
            });
            const { forum } = yield select(state => state.learning);
            const {
                filters: {
                    sortBy,
                    questionTypes
                }
            } = forum;
            //sort with lecture, types and value == lecture
            yield delay(1500);
            yield put({
                type: 'saveQuestions',
                payload: {
                    hasMore: true,
                    total: 4197,
                    data: QUESTIONS
                }
            });
        },
        *filterQuestionsByTypes({ payload }, { call, put, select }) {
            const { courseId, values } = payload;
            yield put({
                type: 'saveFilters',
                payload: {
                    type: 'questionTypes',
                    value: values
                }
            });
            const { forum } = yield select(state => state.learning);
            const {
                filters: {
                    sortBy,
                    lecture
                }
            } = forum;
            //sort with lecture, types and value == lecture
            yield delay(1500);
            yield put({
                type: 'saveQuestions',
                payload: {
                    hasMore: true,
                    total: 4197,
                    data: QUESTIONS
                }
            });
        },
        *askQuestion({ payload }, { call, put }){

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
        },
        saveAnnouncements(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                announcements: {
                    hasMore,
                    list: { ...data }
                }
            };
        },
        pushAnnouncements(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                announcements: {
                    hasMore,
                    list: {
                        ...state.announcements.list,
                        ...data
                    }
                }
            };
        },
        pushComments(state, { payload }) {
            const { hasMore, data, announcementId } = payload;
            return {
                ...state,
                announcements: {
                    ...state.announcements,
                    list: {
                        ...state.announcements.list,
                        [announcementId]: {
                            ...state.announcements.list[announcementId],
                            moreComments: hasMore,
                            comments: [
                                ...state.announcements.list[announcementId].comments,
                                ...data
                            ]
                        }
                    }
                }
            }
        },
        saveCommentsLoading(state, { payload }) {
            const { announcementId, value } = payload;
            return {
                ...state,
                announcements: {
                    ...state.announcements,
                    list: {
                        ...state.announcements.list,
                        [announcementId]: {
                            ...state.announcements.list[announcementId],
                            commentsLoading: value
                        }
                    }
                }
            };
        },
        saveQuestions(state, { payload }) {
            const { hasMore, total, data } = payload;
            return {
                ...state,
                forum: {
                    ...state.forum,
                    total,
                    hasMore,
                    list: [...data]
                }
            };
        },
        pushQuestions(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                forum: {
                    ...state.forum,
                    hasMore,
                    list: [...state.forum.list, ...data]
                }
            };
        },
        saveLectureOpts(state, { payload }) {
            return {
                ...state,
                forum: {
                    ...state.forum,
                    lectureOptions: [...payload]
                }
            };
        },
        saveFilters(state, { payload }) {
            const { type, value } = payload;
            return {
                ...state,
                forum: {
                    ...state.forum,
                    filters: {
                        ...state.forum.filters,
                        [type]: value
                    }
                }
            };
        },
        resetForum(state) {
            return {
                ...state,
                forum: {
                    total: null,
                    list: null,
                    lectureOptions: null,
                    hasMore: null,
                    filters: {
                        lectures: 'all',
                        sortBy: "recommend",
                        questionTypes: []
                    }
                }
            };
        }
    }
}