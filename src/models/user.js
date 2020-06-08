import { delay } from '@/utils/utils';
import storage from '@/utils/storage';
import _ from 'lodash';
import router from 'umi/router';
import * as userService from '@/services/user';
import { message } from 'antd';

const USER = {
    token: 'foo-token',
    name: 'Đặng Thuý Huyền',
    avatar: 'https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-9/39442849_1322314787910656_4254099750170656768_o.jpg?_nc_cat=100&_nc_sid=110474&_nc_oc=AQnpje9w7kXAivIISZ1Y1ds2ElPdPW0ebhHBfAT5adMSUe52THQnYmAQ4le1Skg62ak&_nc_ht=scontent.fsgn2-2.fna&oh=90cafddd7f2617ab94224a728ebfb6c0&oe=5EA74057',
    email: 'huyen.huyen.0901@gmail.com',
    phone: '0919079306',
    gender: 'female',
    birthday: '1999/01/09',
    facebook: 'huyen.dang',
    linkedin: null,
    job: 'developer',
    noOfUsMessage: 7,
    noOfUsNotification: 2,
    catesOfConcern: [4, 13]             //list of categoriy Ids
};

export default {
    namespace: 'user',
    state: null,
    effects: {
        *fetch({ payload }, { call, put }) {
            const { callback } = payload;
            const response = yield call(userService.fetch);
            if (response) {
                const user = response.data;
                yield put({ type: 'save', payload: user });
                if (callback) callback();
                // const items = storage.getShoppingCart();
                // if (!_.isEmpty(items)) {
                //     yield put({
                //         type: 'cart/fetch',
                //         payload: items
                //     });
                // }
                // FCM token
            }
        },
        *update({ payload }, { call, put }) {
            const response = yield call(userService.update, payload);
            if (response) {
                yield put({
                    type: 'updateUser',
                    payload: response.data
                });
            }
        },
        *updateCatesOfConcern({ payload: targetKeys }, { call, put }) {
            const response = yield call(userService.updateInterestedCates, targetKeys);
            if (response) {
                const catesOfConcern = response.data && response.data.catesOfConcern;
                yield put({
                    type: 'updateUser',
                    payload: {
                        catesOfConcern
                    }
                });
            }
        },
        *changePassword({ payload }, { call, put }) {
            const {
                oldPassword,
                newPassword,
                onOk,
                onIncorrect
            } = payload;
            const response = yield call(userService.updatePassword, oldPassword, newPassword);
            if (response) {
                const errorCode = 1 * response.errorCode;
                if (errorCode === 0)
                    onOk();
                else
                    onIncorrect();
            }
        },
        *uploadAvatar({ payload }, { call, put }) {
            const { file, callback } = payload;
            //call api to upload file (Base64) to cloud, get url
            yield delay(1000);
            const avatarUrl = 'https://images.pexels.com/photos/2451616/pexels-photo-2451616.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
            const response = yield call(userService.updateAvatar, avatarUrl);
            if (response) {
                yield put({
                    type: 'updateUser',
                    payload: response.data
                });
                if (callback) callback();
            }
        },
        *login({ from, payload }, { call, put }) {
            const { phone, password } = payload;
            const response = yield call(userService.signIn, phone, password);
            if (response) {
                const user = response.data;
                const token = user.token;
                storage.setToken(token);
                yield put({
                    type: 'save',
                    payload: user
                });
                //set FCM token
                router.replace(from);
            }
        },
        *register({ payload }, { call }) {
            const response = yield call(userService.register, payload);
            if (response) {
                message.success('Register success!');
                router.push('/user/login');
            }
        },
        *logout(action, { put }) {
            storage.setToken(null);
            storage.setShoppingCart(null);
            router.push('/user/login');
            yield put({ type: 'reset' });
            yield put({ type: 'cart/reset' });
        }
    },
    reducers: {
        save(state, { payload }) {
            return { ...payload };
        },
        saveNoUsMessage(state, { payload }) {
            return {
                ...state,
                noUsMessage: payload
            };
        },
        saveNoUsNotification(state, { payload }) {
            return {
                ...state,
                noUsNotification: payload
            };
        },
        updateUser(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
        reset() {
            return null;
        }
    }
}