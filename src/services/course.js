/* eslint-disable */
import { apiGet, apiPut, apiPost } from '@/utils/request';

export async function validCourse(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/validate/user`);
}

export async function fetchInfo() {}

export async function overview(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/overview`);
}

export async function instructors(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/instructors`);
}

export async function fetchChaptersDetail(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/chapters/detail`);
}

export async function fetchReviews(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/reviews`);
}

export async function addReview({ courseId, starVal, comment }) {
    return apiPost(`${COURSE_API_URL}/${courseId}/reviews`, {
        body: {
            starRating: starVal,
            comment
        }
    });
}

export async function fetchInstructorReviews(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/reviews/instructor`);
}

export async function reviewInstructor(courseId, { instructorId, starRating, ratingContent }) {
    return apiPut(`${COURSE_API_URL}/${courseId}/reviews/instructor`, {
        body: {
            instructorId,
            starRating,
            comment: ratingContent
        }
    });
}

export async function fetchOverviewPublic(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/overview/public`);
}

export async function fetchInstructorsPublic(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/instructors/public`);
}

export async function fetchPublicReviews(courseId, page = 1, limit = 8) {
    return apiGet(`${COURSE_API_URL}/${courseId}/reviews/public?page=${page}&limit=${limit}`);
}

export async function voteReview(courseId, reviewId, value) {
    return apiPut(`${COURSE_API_URL}/${courseId}/reviews/${reviewId}/vote`, {
        body: {
            value
        }
    })
}

export async function fetchPublicInfo(courseId) {
    return apiGet(`${COURSE_API_URL}/${courseId}/info/public`);
}