import { delay } from '@/utils/utils';
import AREAS_MENU from '@/assets/fakers/areasMenu';
import JOBS from '@/assets/fakers/jobs';
import CATEGORIES from '@/assets/fakers/categories';

export default {
    namespace: 'settings',
    state: {
        areasMenu: null,
        jobs: null,
        categories: null
    },
    effects: {
        *fetch(action, { call, put }) {
            yield delay(1200);
            yield put({
                type: 'save',
                payload: {
                    areasMenu: AREAS_MENU,
                    jobs: JOBS,
                    categories: CATEGORIES
                }
            });
        }
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload }
        }
    }
}