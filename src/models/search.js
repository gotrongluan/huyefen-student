import * as courseService from '@/services/course';
import { delay } from '@/utils/utils';

export default {
	namespace: 'search',
	state: {
		searchText: '',
		data: {
			courses: [],
			authors: [],
			users: []
		}
	},
	effects: {
		*suggest({ payload: searchText }, { call, put }) {
			//TODO: Cancel request when another request here.
			//const response = yield call(courseService.suggestCourses, searchText);
			console.log('ffdafd');
			yield delay(1000);
			const response = {
				data: {
					courses: [
						{ _id: 1, title: `Hello ${new Date().getTime() /1000}` },
						{ _id: 2, title: `Name ${new Date().getTime() /1000}` }
					],
					users: [
						{ _id: 1, name: `Thuy Huyen ${new Date().getTime() /1000}` },
						{ _id: 2, name: `Ngoc Hanh ${new Date().getTime() /1000}` }
					],
					authors: [
						{ _id: 1, name: `Trong Nhan ${new Date().getTime() /1000}` },
						{ _id: 2, name: `SKT Faker ${new Date().getTime() /1000}` }
					]
				}
			}
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
					authors: [],
					users: []
				}
			};
		}
	}
}