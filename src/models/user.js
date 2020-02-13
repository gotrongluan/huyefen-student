import { delay } from '@/utils/utils';
import storage from '@/utils/storage';
import router from 'umi/router';

const USER = {
    token: 'foo-token',
    name: 'Ngoc Hanh Vuong',
    avatar: null,
    email: 'ngochanhvuong@gmail.com',
    phone: '0919079306',
    gender: 'female',
    birthday: '1997/12/21',
    facebook: 'ngochanhvuong',
    linkedin: null,
    job: 'developer',
    noOfUsMessage: 7,
    noOfUsNotification: 2,
    catesOfConcern: [4, 13]             //list of categoriy Ids
};

const response = {
    data: USER
}

export default {
    namespace: 'user',
    state: null,
    effects: {
        *fetch({ payload }, { call, put }) {
            const { callback } = payload;
            yield delay(1400);
            yield put({
                type: 'save',
                payload: USER
            });
            if (callback) callback();
            //set FCM token.
        },
        *update({ payload }, { call, put }) {
            //call api with all params in payload
            yield delay(2000);
            //only return info part of user in reponse
            yield put({
                type: 'updateUser',
                payload
            });
        },
        *updateCatesOfConcern({ payload: targetKeys }, { call, put }) {
            yield delay(1800);
            yield put({
                type: 'updateUser',
                payload: {
                    catesOfConcern: targetKeys
                }
            })
        },
        *changePassword({ payload }, { call, put }) {
            const {
                oldPassword,
                newPassword,
                onOk,
                onIncorrect
            } = payload;
            yield delay(2000);
            const status = 1;
            if (status === 0) onOk();
            else onIncorrect();
        },
        *uploadAvatar({ payload }, { call, put }) {
            const { file, callback } = payload;
            //call api to upload file (Base64) to cloud, get url
            yield delay(1000);
            //after get Url, call api to update avatar of user.
            yield delay(1000);
            //response only return avatar part
            yield put({
                type: 'updateUser',
                payload: {
                    avatar: file
                }
            });
            callback();
        },
        *login({ from, payload }, { call, put }) {
            const { phone, password } = payload;
            yield delay(1600);
            if (response) {
                const { data: user } = response;
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
            yield delay(2000);
            router.push('/user/login');
        },
        *logout(action, { put }) {
            storage.setToken(null);
            yield put({ type: 'reset' });
            router.push('/user/login');
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