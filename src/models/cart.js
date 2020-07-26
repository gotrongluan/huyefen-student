import storage from '@/utils/storage';
import * as cartServices from '@/services/cart.js';
import _ from 'lodash';
import { message } from 'antd';
import router from 'umi/router';

export default {
    namespace: 'cart',
    state: [],
    effects: {
        *fetch({ payload: items }, { call, put }) {
            const response = yield call(cartServices.fetchItemsInfo, items);
            if (response) {
                yield put({
                    type: 'saveCartItems',
                    payload: response.data
                });
            }
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
        },
        *buy(action, { call, put, select }) {
            const boughtItemsWithFull = yield select(state => state.cart);
            const boughtItems = _.map(boughtItemsWithFull, item => ({
                _id: item._id,
                type: item.type
            }));
            const response = yield call(cartServices.buyItems, boughtItems);
            if (response) {
                message.success('Bought items successfully!');
                router.push('/my-courses');
                yield put({ type: 'cart/reset' });
                storage.setShoppingCart(null);
            }
        }
    },
    reducers: {
        saveCartItems(state, { payload }) {
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