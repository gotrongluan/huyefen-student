import { delay } from '@/utils/utils';
import funcPurchase from '@/assets/fakers/purchaseHistory';
import _ from 'lodash';

export default {
    namespace: 'purchase',
    state: {
        list: null,
        total: null
    },
    effects: {
        *fetch(action, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'save',
                payload: {
                    total: 32,
                    list: funcPurchase(1)
                }
            });
        },
        *more({ payload }, { call, put }) {
            const { callback, start, end } = payload;
            yield delay(2400);
            const skip = end - start;
            let newData = [];
            for (let i = 1; i <= skip; ++i) {
                newData = _.concat(newData, funcPurchase(start + i));
            }
            yield put({
                type: 'push',
                payload: newData
            });
            if (callback) callback();
        }
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
        push(state, { payload: newData }) {
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