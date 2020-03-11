import { delay } from '@/utils/utils';
import CART from '@/assets/fakers/cart';
import storage from '@/utils/storage';
import { message } from 'antd';
export default {
    namespace: 'cart',
    state: [],
    effects: {
        *fetch({ payload: items }, { call, put }) {
            message.success('fuck');
            yield delay(1000);
            //call api with item ids list, server return list item with full info.
            yield put({
                type: 'save',
                payload: CART
            });
        },
        *add({ payload }, { call, put }) {
            const { _id, type } = payload;
            const item = {
                _id, type
            };
            let current = storage.getShoppingCart();
            if (current) current = [item, ...current];
            else current = [item];
            storage.setShoppingCart(current);
            yield put({
                type: 'shift',
                payload: payload,
            });
        }
    },
    reducers: {
        save(state, { payload }) {
            return [...payload]
        },
        shift(state, { payload: item }) {
            return [
                item,
                ...state
            ];
        },
        reset() {
            return [];
        }
    }
}