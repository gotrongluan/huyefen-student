/* eslint-disable */
import { apiGet, apiPost, apiDelete } from '@/utils/request';
import { join } from 'lodash';

export async function fetch(courseId, params, page = 1, limit = 12) {
    const {
        sort,
        lecture,
        questionTypes
    } = params;
    const questionTypesStr = join(questionTypes, ',');
    const queryStr = `page=${page}&limit=${limit}&courseId=${courseId}&sort=${sort}&lecture=${lecture}&questionTypes=${questionTypesStr}`;
    return apiGet(`${QUESTION_API_URL}?${queryStr}`);
};

export async function fetchThread(courseId, questionId) {
    return apiGet(`${QUESTION_API_URL}/courses/${courseId}/${questionId}`);
}

export async function fetchAnswers(courseId, questionId, skip = 0, limit = 5) {
    return apiGet(`${QUESTION_API_URL}/courses/${courseId}/${questionId}/answers?skip=${skip}&limit=${limit}`);
}

export async function vote(courseId, threadId) {
    return apiPost(`${QUESTION_API_URL}/courses/${courseId}/${threadId}/vote`);
}

export async function unvote(courseId, threadId) {
    return apiDelete(`${QUESTION_API_URL}/courses/${courseId}/${threadId}/unvote`);
}

export async function follow(courseId, threadId) {
    return apiPost(`${QUESTION_API_URL}/courses/${courseId}/${threadId}/follow`);
}

export async function unfollow(courseId, threadId) {
    return apiDelete(`${QUESTION_API_URL}/courses/${courseId}/${threadId}/unfollow`);
}

export async function voteAnswer(courseId, threadId, answerId) {
    return apiPost(`${QUESTION_API_URL}/answers/${answerId}/vote`, {
        body: {
            courseId,
            questionId: threadId
        }
    });
}

export async function unvoteAnswer(courseId, threadId, answerId) {
    return apiDelete(`${QUESTION_API_URL}/answers/${answerId}/unvote?courseId=${courseId}&questionId=${threadId}`);
}

export async function answer(courseId, threadId, answer) {
    return apiPost(`${QUESTION_API_URL}/courses/${courseId}/${threadId}/answers`, {
        body: {
            content: answer
        }
    });
}