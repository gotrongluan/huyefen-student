import { delay } from '@/utils/utils';
import { message } from 'antd';
import _ from 'lodash';
import router from 'umi/router';
import * as courseService from '@/services/course';
import * as questionService from '@/services/question';
import COURSE_INFO from '@/assets/fakers/courseLearningInfo';
import ANNOUNCEMENTS from '@/assets/fakers/announcements';
import OLD_ANNOUNCEMENTS from '@/assets/fakers/oldAnnouncements';
import COMMENTS from '@/assets/fakers/answers';
import LECTURE_OPTIONS from '@/assets/fakers/syllabus';
import QUESTIONS from '@/assets/fakers/questions';
import THREAD from '@/assets/fakers/thread';
import ANSWERS from '@/assets/fakers/answers';
import LECTURE from '@/assets/fakers/lecture';
import VIDEO_LECTURE from '@/assets/fakers/videoLecture';
import INSTRUCTOR_REVIEWS from '@/assets/fakers/instructorReviews';

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
    instructorReviews: null,
    review: null,
    forum: {
        total: null,
        list: null,
        lectureOptions: null,
        hasMore: null,
        filters: {
            lecture: 'all',
            sortBy: "relevance",
            questionTypes: []
        }
    },
    thread: null,
    announcements: {
        hasMore: true,
        list: null
    },
    lecture: null
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
            const response = yield call(courseService.overview, courseId);
            if (response) {
                yield put({
                    type: 'saveOverview',
                    payload: response.data
                });
            }
        },
        *fetchInstructors({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.instructors, courseId);
            if (response) {
                yield put({
                    type: 'saveInstructors',
                    payload: response.data
                });
            }
        },
        *fetchReview({ payload: courseId }, { call, put }) {
            yield delay(1100);
            //empty review = {}
            yield put({
                type: 'saveReview',
                payload: REVIEW
            });
        },
        *fetchInstructorReviews({ payload: courseId }, { call, put }) {
            yield delay(1600);
            yield put({
                type: 'saveInstructorReviews',
                payload: INSTRUCTOR_REVIEWS
            });
        },
        *reviewInstructor({ payload }, { call, put }) {
            const {
                courseId,
                instructorId,
                starRating,
                ratingContent,
                callback
            } = payload;
            yield delay(1200);
            yield put({
                type: 'updateInstructorReview',
                payload: {
                    _id: instructorId,
                    starRating,
                    ratingContent
                }
            });
            if (callback) callback();
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
        *moreComments({ payload }, { call, put, select }) {
            const {
                courseId,
                announcementId
            } = payload;
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
        *comment({ payload }, { call, put }) {
            const { announcementId, content } = payload;
            yield delay(1900);
            yield put({
                type: 'shiftComment',
                payload: {
                    data: {
                        _id: 'new',
                        user: {
                            _id: 1,
                            avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/52607910_2117264761701640_9035195513728663552_o.jpg?_nc_cat=102&_nc_ohc=_tJCZ8LLC10AX-zKJMI&_nc_ht=scontent.fdad1-1.fna&oh=52df2a0b6310de771d0888f065dc6837&oe=5EBD3DB8',
                            name: 'My love',
                            isInstructor: false
                        },
                        createdAt: 1578813445900,
                        content
                    },
                    announcementId
                }
            });
        },
        *fetchQuestions({ payload: courseId }, { call, put }) {
            const response = yield call(questionService.fetch, courseId, {
                sort: 'relevance',
                lecture: 'all',
                questionTypes: []
            });
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'saveQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
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
            const currentPage = _.size(list) / 12;
            const response = yield call(questionService.fetch, courseId, {
                sort: sortBy,
                lecture,
                questionTypes
            }, currentPage + 1);
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'pushQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
        },
        *fetchQuestionsAgain({ payload: courseId }, { call, put, select }) {
            const {
                forum: {
                    filters: {
                        lecture,
                        sortBy,
                        questionTypes
                    }
                }
            } = yield select(state => state.learning);
            //fetch again with all above params, courseId
            yield delay(1300);
            yield put({
                type: 'saveQuestions',
                payload: {
                    hasMore: true,
                    total: 243,
                    data: QUESTIONS
                }
            });
        },
        *fetchLectureOpts({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchChaptersDetail, courseId);
            if (response) {
                yield put({
                    type: 'saveLectureOpts',
                    payload: response.data
                });
            }
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
            const response = yield call(questionService.fetch, courseId, {
                lecture,
                sort: value,
                questionTypes
            });
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'saveQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
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
            const response = yield call(questionService.fetch, courseId, {
                lecture: value,
                sort: sortBy,
                questionTypes
            });
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'saveQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
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
            const response = yield call(questionService.fetch, courseId, {
                sort: sortBy,
                lecture,
                questionTypes: values
            });
            if (response) {
                const { hasMore, total, list } = response.data;
                yield put({
                    type: 'saveQuestions',
                    payload: {
                        hasMore,
                        total,
                        data: list
                    }
                });
            }
        },
        *askQuestion({ payload }, { call, put }){
            const {
                courseId,
                title,
                lecture,
                content
            } = payload;
            //call api with 4 above variables 
            yield delay(1400);
            //get question from response
            //if no error -> redirect to thread/${questionId}
            yield put({
                type: 'fetchQuestionsAgain',
                payload: courseId
            });
            router.push(`/learning/${courseId}/forum/thread/new-question`);

        },
        *fetchThread({ payload }, { call, put }) {
            const { courseId, threadId } = payload;
            const response = yield call(questionService.fetchThread, courseId, threadId);
            if (response) {
                yield put({
                    type: 'saveThread',
                    payload: response.data
                });
            }
        },
        *moreAnswers({ payload }, { call, put, select }) {
            const {
                courseId,
                threadId
            } = payload;
            const { thread } = yield select(state => state.learning);
            const {
                answers
            } = thread;
            const skip = _.size(answers);
            const response = yield call(questionService.fetchAnswers, courseId, threadId, skip);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'pushAnswers',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        *toggleVote({ payload }, { call, put }) {
            const {
                threadId,
                courseId,
                value
            } = payload;
            yield put({
                type: 'toggleVoting'
            });
            let response;
            if (value) {
                response = yield call(questionService.unvote, courseId, threadId);
            }
            else {
                response = yield call(questionService.vote, courseId, threadId);
            }
            if (!response) {
                yield put({
                    type: 'toggleVoting'
                });
            }
        },
        *toggleFollow({ payload }, { call, put }) {
            const {
                threadId,
                courseId,
                value
            } = payload;
            yield put({
                type: 'toggleFollowing'
            });
            let response;
            if (value) {
                response = yield call(questionService.unfollow, courseId, threadId);
            }
            else {
                response = yield call(questionService.follow, courseId, threadId);
            }
            if (!response) {
                yield put({
                    type: 'toggleFollowing'
                });
            }
        },
        *toggleAnswerVote({ payload }, { call, put }) {
            const {
                threadId,
                courseId,
                answerId,
                value
            } = payload;
            yield put({
                type: 'toggleAnswerVoting',
                payload: answerId
            });
            let response;
            if (value) {
                response = yield call(questionService.unvoteAnswer, courseId, threadId, answerId);
            }
            else {
                response = yield call(questionService.voteAnswer, courseId, threadId, answerId);
            }
            if (!response) {
                yield put({
                    type: 'toggleAnswerVoting',
                    payload: answerId
                });
            }
        },
        *answer({ payload }, { call, put }) {
            const { courseId, threadId, answer } = payload;
            const response = yield call(questionService.answer, courseId, threadId, answer);
            if (response) {
                yield put({
                    type: 'shiftAnswer',
                    payload: response.data
                });
            }
        },
        *fetchLecture({ payload }, { call, put }) {
            const { courseId, lectureId, type } = payload;
            yield delay(1500);
            //call api with courseId, lectureId --> for checking whether lecture belong to the course, is exist lecture
            const status = 0;
            if (status === 0) {
                if (type) {
                    yield put({
                        type: 'saveLecture',
                        payload: {
                            ...LECTURE,
                            _id: lectureId
                        }
                    });
                }
                else
                    yield put({
                        type: 'saveLecture',
                        payload: {
                            ...VIDEO_LECTURE,
                            _id: lectureId
                        }
                    })
            }
                
            else router.replace('/error/404');
        },
        *toggleComplete({ payload: lectureId }, { call, put }) {
            yield put({
                type: 'toggleCompleteStatus',
                payload: lectureId
            });
            yield delay(1000);
        },
        *askQuestionDirectly({ payload }, { call, put }) {
            const {
                courseId,
                title,
                lecture,
                content,
                callback
            } = payload;
            //call api with 4 above variables 
            yield delay(1400);
            if (callback) callback();
        },
        *validCourse({ payload }, { call }) {
            const { courseId, onOk, onInvalidCourse, onInvalidStudent } = payload;
            const response = yield call(courseService.validCourse, courseId);
            if (response) {
                const status = response.data;
                if (status === 0)
                    onOk();
                else if (status === 1)
                    onInvalidCourse();
                else
                    onInvalidStudent();
            }
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
        saveInstructorReviews(state, { payload }) {
            return {
                ...state,
                instructorReviews: [...payload]
            };
        },
        updateInstructorReview(state, { payload }) {
            const { _id: instructorId, starRating, ratingContent } = payload;
            const newData = _.cloneDeep(state.instructorReviews);
            const index = _.findIndex(newData, ['_id', instructorId]);
            newData[index] = {
                ...newData[index],
                ...payload
            };
            return {
                ...state,
                instructorReviews: [...newData]
            };
        },
        resetInstructorReviews(state) {
            return {
                ...state,
                instructorReviews: null
            };
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
        shiftComment(state, { payload }) {
            const { data, announcementId } = payload;
            console.log(announcementId);
            return {
                ...state,
                announcements: {
                    ...state.announcements,
                    list: {
                        ...state.announcements.list,
                        [announcementId]: {
                            ...state.announcements.list[announcementId],
                            comments: [
                                { ...data },
                                ...state.announcements.list[announcementId].comments
                            ]
                        }
                    }
                }
            }
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
        resetAnnouncements(state) {
            return {
                ...state,
                announcements: {
                    hasMore: true,
                    list: null
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
                        lecture: 'all',
                        sortBy: 'relevance',
                        questionTypes: []
                    }
                }
            };
        },
        saveThread(state, { payload }) {
            return {
                ...state,
                thread: { ...payload }
            }
        },
        pushAnswers(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                thread: {
                    ...state.thread,
                    moreAnswers: hasMore,
                    answers: [
                        ...state.thread.answers,
                        ...data
                    ]
                }
            };
        },
        shiftAnswer(state, { payload: answer }) {
            return {
                ...state,
                thread: {
                    ...state.thread,
                    numOfAnswers: state.thread.numOfAnswers + 1,
                    answers: [answer, ...state.thread.answers]
                }
            };
        },
        toggleVoting(state) {
            const numOfVotes = state.thread.isVoted ? state.thread.numOfVotes - 1 : state.thread.numOfVotes + 1;
            return {
                ...state,
                thread: {
                    ...state.thread,
                    numOfVotes,
                    isVoted: !state.thread.isVoted
                }
            };
        },
        toggleFollowing(state) {
            return {
                ...state,
                thread: {
                    ...state.thread,
                    isFollowed: !state.thread.isFollowed
                }
            };
        },
        toggleAnswerVoting(state, { payload: answerId }) {
            const answersData = [...state.thread.answers];
            const index = _.findIndex(answersData, ['_id', answerId]);
            if (answersData[index].isVoted) answersData[index].numOfVotes -= 1;
            else answersData[index].numOfVotes += 1;
            answersData[index].isVoted = !answersData[index].isVoted;
            return {
                ...state,
                thread: {
                    ...state.thread,
                    answers: [...answersData]
                }
            };
        },
        resetThread(state) {
            return { ...state, thread: null };
        },
        saveLecture(state, { payload }) {
            return {
                ...state,
                lecture: { ...payload }
            };
        },
        saveResolution(state, { payload }) {
            if (state.lecture.videoRes)
                return {
                    ...state,
                    lecture: {
                        ...state.lecture,
                        videoRes: payload
                    }
                };
            return { ...state };
        },
        toggleCompleteStatus(state, { payload: lectureId }) {
            let lectureData = state.lecture && { ...state.lecture };
            let syllabusData = [...state.info.syllabus];
            if (lectureData && lectureData._id === lectureId) {
                lectureData.isCompleted = !lectureData.isCompleted;
            }
            let lectureIndex;
            const chapterIndex = _.findIndex(syllabusData, chapter => (lectureIndex = _.findIndex(chapter.lectures, lecture => lecture._id === lectureId)) > -1);
            syllabusData[chapterIndex].lectures[lectureIndex].isCompleted = !syllabusData[chapterIndex].lectures[lectureIndex].isCompleted;
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [...syllabusData]
                },
                lecture: { ...lectureData }
            };
        },
        resetLecture(state) {
            return {
                ...state,
                lecture: null
            };
        }
    }
}