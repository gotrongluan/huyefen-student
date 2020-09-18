import _ from 'lodash';
import RELATED_COURSES from '@/assets/fakers/relatedCourses';
import * as courseServices from '@/services/course';

export default {
    namespace: 'detail',
    state: {
        info: null,
        overview: null,
        syllabus: null,
        relatedCourses: null,
        instructors: null,
        reviews: {
            list: null,
            featured: null,
            hasMore: true,
        }
    },
    effects: {
        *submitView({ payload: courseId }, { call }) {
            yield call(courseServices.submitView, courseId);
        },
        *fetchInfo({ payload: courseId }, { call, put }) {
            const response = yield call(courseServices.fetchPublicInfo, courseId);
            if (response) {
                yield put({
                    type: 'saveInfo',
                    payload: response.data
                })
            }
        },
        *fetchOverview({ payload: courseId }, { call, put }) {
            const response = yield call(courseServices.fetchOverviewPublic, courseId);
            if (response) {
                yield put({
                    type: 'saveOverview',
                    payload: response.data
                });
            }
        },
        *fetchSyllabus({ payload: courseId }, { call, put }) {
            const response = yield call(courseServices.fetchSyllabusPublic, courseId);
            if (response) {
                yield put({
                    type: 'saveSyllabus',
                    payload: response.data
                })
            }
        },
        *fetchRelatedCourses({ payload: courseId }, { call, put }) {
            const response = yield call(courseServices.fetchRelatedCourses, courseId);
            if (response) {
              yield put({
                type: 'saveRelatedCourses',
                payload: response.data
              });
            }
        },
        *fetchInstructors({ payload: courseId }, { call, put }) {
            const response = yield call(courseServices.fetchInstructorsPublic, courseId);
            if (response) {
                yield put({
                    type: 'saveInstructors',
                    payload: response.data
                });
            }
        },
        *fetchReviews({ payload: courseId }, { call, put }) {
            const response = yield call(courseServices.fetchPublicReviews, courseId);
            if (response) {
                const { list: reviewsData, hasMore } = response.data;
                let featuredReviews = [];
                let featuredMaxLength = _.min([2, reviewsData]);
                for (let i = 0; i < featuredMaxLength; i++) {
                    const review = reviewsData[i];
                    if (
                        (review.numOfLikes > 0 && review.numOfLikes >= review.numOfDislikes)
                        || (review.numOfDislikes === 0 && review.answers.length > 0)
                    ) {
                        featuredReviews.push(review);
                    }
                    else break;
                }
                const normalReviews = _.slice(reviewsData, featuredReviews.length);
                yield put({
                    type: 'saveReviews',
                    payload: {
                        featured: featuredReviews,
                        list: normalReviews,
                        hasMore
                    }
                });
            }
        },
        *moreReviews({ payload: courseId }, { call, put, select }) {
            const {
                reviews: { list, featured }
            } = yield select(state => state.detail);
            const numCurrentReviews = list.length + featured.length;
            const currentPage = numCurrentReviews / 8;
            const response = yield call(courseServices.fetchPublicReviews, courseId, currentPage + 1);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'pushReviews',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        *preview() {

        },
        *vote({ payload }, { call, put, select }) {
            const {
                type,
                reviewId,
                value,
                courseId,
                oldValue
            } = payload;
            yield put({
                type: 'saveVote',
                payload: {
                    type,
                    reviewId,
                    value
                }
            });
            const response = yield call(courseServices.voteReview, courseId, reviewId, value);
            if (response) {
                const errorCode = 1 * response.errorCode;
                if (errorCode > 0) {
                    yield put({
                        type: 'saveVote',
                        payload: {
                            type,
                            reviewId,
                            oldValue
                        }
                    });
                }
            }
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
                reviews: {
                    list: null,
                    featured: null,
                    hasMore: true
                },
                instructors: null,
                syllabus: null,
                overview: null,
                relatedCourses: null
            };
        },
        pushReviews(state, { payload }) {
            const { data: newReviews, hasMore } = payload;
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    hasMore,
                    list: [
                        ...state.reviews.list,
                        ...newReviews
                    ]
                }
            };
        },
        saveVote(state, { payload }) {
            const {
                type,
                reviewId,
                value
            } = payload;
            const mapValueToProp = {
                '1': 'numOfLikes',
                '-1': 'numOfDislikes'
            };
            const attr = type === 'default' ? 'list' : 'featured';
            const list = [...state.reviews[attr]];
            const index = _.findIndex(list, ['_id', reviewId]);
            if (list[index].status !== 0) {
                if ((list[index].status) === 1) {
                    list[index].numOfLikes -= 1;
                }
                else if (list[index].status === -1) {
                    list[index].numOfDislikes -= 1;
                }
            }
            if (value !== 0) {
                const prop = mapValueToProp[value.toString()];
                list[index][prop] += 1;
            }
            list[index].status = value;
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    [attr]: [...list]
                }
            }
        }
    }
}
