import * as courseService from '@/services/course';
import { delay } from '@/utils/utils';

export default {
	namespace: 'search',
	state: {
		searchText: '',
		data: {
			courses: [],
			teachers: [],
			topics: []
		}
	},
	effects: {
		*suggest({ payload: searchText }, { call, put }) {
			//TODO: Cancel request when another request here.
			const response = yield call(courseService.suggestCourses, searchText);
			if (response) {
				const result = response.data;
				yield put({
					type: 'saveSuggestData',
					payload: {
						data: result,
						searchText
					}
				});
			}
		},
	},
	reducers: {
		saveSuggestData(state, { payload }) {
			return {
				...state,
				...payload
			};
		},
		reset() {
			return {
				searchText: '',
				data: {
					courses: [],
					teachers: [],
					topics: []
				}
			};
		}
	}
}