import * as settingsService from '@/services/settings';

export default {
    namespace: 'settings',
    state: {
        areasMenu: null,
        jobs: null,
        categories: null
    },
    effects: {
        *fetch(action, { all, call, put }) {
            const [menuResponse, jobsResponse, catesResponse] = yield all([
                call(settingsService.fetchAreasMenu),
                call(settingsService.fetchJobs),
                call(settingsService.fetchCategories)
            ]);
            if (menuResponse && jobsResponse && catesResponse) {
                yield put({
                    type: 'save',
                    payload: {
                        areasMenu: menuResponse.data,
                        jobs: jobsResponse.data,
                        categories: catesResponse.data
                    }
                });
            }
        }
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload }
        }
    }
}