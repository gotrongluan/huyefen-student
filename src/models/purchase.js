import { delay } from '@/utils/utils';
import funcPurchase from '@/assets/fakers/purchaseHistory';
import _ from 'lodash';
import * as purchaseService from '@/services/purchase';

export default {
    namespace: 'purchase',
    state: {
        list: null,
        total: null
    },
    effects: {
        *fetch(action, { call, put }) {
            const response = yield call(purchaseService.fetch);
            if (response) {
                yield put({
                    type: 'savePurchaseHistory',
                    payload: response.data
                })
            }
        },
        *more({ payload }, { call, put }) {
            const { callback, start, end } = payload;
            const limit = (end - start) * 4;
            const skip = start * 4;
            const response = yield call(purchaseService.fetch, skip, limit);
            if (response) {
                yield put({
                    type: 'pushPurchaseHistory',
                    payload: response.data.list
                });
                if (callback) callback();
            }
        }
    },
    reducers: {
        savePurchaseHistory(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
        pushPurchaseHistory(state, { payload: newData }) {
            return {
                ...state,
                list: [...state.list, ...newData]
            }
        },
        reset() {
            return {
                total: null,
                list: null
            };
        }
    }
};