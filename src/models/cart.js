import { delay } from '@/utils/utils';
import CART from '@/assets/fakers/cart';
import storage from '@/utils/storage';
import { message } from 'antd';
import _ from 'lodash';

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
        },
        *add({ payload }, { call, put }) {
            const { _id, type } = payload;
            const itemData = {
                _id, type
            };
            let current = storage.getShoppingCart();
            if (current) {
                if (_.findIndex(current, item => item._id === itemData._id && item.type === itemData.type) > -1) return;
                current = [itemData, ...current];
            }
            else current = [itemData];
            storage.setShoppingCart(current);
            yield put({
                type: 'shift',
                payload: payload,
            });
        }
    },
    reducers: {
        save(state, { payload }) {
            return [...state, ...payload]
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