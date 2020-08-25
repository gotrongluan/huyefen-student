import * as courseService from '@/services/course';
import { delay } from '@/utils/utils';
import COURSES from '@/assets/fakers/coursesInArea';

export default {
	namespace: 'searchCourses',
	state: {
		page: 1,
		pageSize: 8,
		total: 0,
		list: [],
		q: ''
	},
	effects: {
		*search({ payload }, { call, put, select }) {
			const { page, pageSize, q } = yield select(state => state.searchCourses);
			//const response = yield call(courseService.searchCourses, q, page, pageSize);
			yield delay(2000);
			const response = {
				data: {
					list: COURSES.list,
					total: COURSES.list.length * 3
				}
			}
			if (response) {
				yield put({
					type: 'saveCoursesData',
					payload: response.data
				})
			}
		}
	},
	reducers: {
		setNewPage(state, { payload: newPage }) {
			return {
				...state,
				page: newPage
			};
		},
		setQueryKeyword(state, { payload }) {
			return {
				...state,
				q: payload
			}
		},
		saveCoursesData(state, { payload: data }) {
			return {
				...state,
				...data
			};
		},
		reset() {
			return {
				page: 1,
				pageSize: 8,
				total: 0,
				list: [],
				q: ''
			}
		}
	}
}