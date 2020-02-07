import { delay } from '@/utils/utils';
import MYCOURSES from '@/assets/fakers/mycourses';

export default {
    namespace: 'myCourses',
    state: null,
    effects: {
        *fetch(action, { call, put }) {
            //
            yield delay(1500);
            yield put({
                type: 'save',
                payload: MYCOURSES
            });
        }
    },
    reducers: {
        save(state, { payload }) {
            return [...payload];
        },
        reset() {
            return null;
        }
    }
}