import { delay } from '@/utils/utils';
import storage from '@/utils/storage';
import router from 'umi/router';

const USER = {
    token: 'foo-token',
    name: 'Ngoc Hanh Vuong',
    avatar: "https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-9/44998607_1955450574549727_4051671426044788736_o.jpg?_nc_cat=101&_nc_ohc=m01qO3I_974AX8WBWi3&_nc_ht=scontent.fdad2-1.fna&oh=afa498f2c4556fbb6e345b2d9e6d633b&oe=5EBA7BE5",
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