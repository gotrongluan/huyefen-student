import { delay } from '@/utils/utils';
import CART from '@/assets/fakers/cart';

export default {
    namespace: 'cart',
    state: [],
    effects: {
        *fetch({ payload: items }, { call, put }) {
            yield delay(1000);
            //call api with item ids list, server return list item with full info.
            yield put({
                type: 'save',
                payload: CART
            });
        }
    },
    reducers: {
        save(state, { payload }) {
            return [...payload]
        }
    }
}