import { delay } from '@/utils/utils';
import router from 'umi/router';
import * as messengerService from '@/services/messenger';
import OLD_MESSAGES from '@/assets/fakers/oldMessages';
import MESSAGES from '@/assets/fakers/messages';
import CONVERSATIONS from '@/assets/fakers/conversations';
import OLD_CONVERSATIONS from '@/assets/fakers/oldConversations';
import _ from 'lodash';
const USER = {
    _id: 1,
    name: 'Dang Thuy Huyen',
    avatar: 'https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-9/42526239_1351247001684101_2131590022736904192_o.jpg?_nc_cat=105&_nc_sid=110474&_nc_oc=AQkYcdB2i-E0mZTEXV81owkPhMa-UBcPsdJlGVcrYiCWxodZBaLoxcnoXwD2VNocbrw&_nc_ht=scontent.fsgn2-2.fna&oh=b61af62f10a5c7bc1c98c36d02941ba2&oe=5E95752D'
}

const initialState = {
    conversations: {
        list: null,
        first: null,
        hasMore: true
    },
    messages: {
        list: [],
        sending: [],
        hasMore: true
    },
    user: null
};

export default {
    namespace: 'messenger',
    state: initialState,
    effects: {
        *fetchConversations(action, { call, put }) {
            const response = yield call(messengerService.fetchConversations);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'saveConversations',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        fetchMessages: [
            function* ({ payload: converId }, { call, put }) {
                const response = yield call(messengerService.fetchMessages, converId);
                if (response) {
                    const { hasMore, list } = response.data;
                    yield put({
                        type: 'saveMessages',
                        payload: {
                            hasMore,
                            data: list
                        }
                    });
                }
            },
            'takeLastest'
        ],
        fetchUser: [
            function* ({ payload: converId }, { call, put }) {
                const response = yield call(messengerService.fetchPartner, converId);
                if (response) {
                    yield put({
                        type: 'saveUser',
                        payload: {
                            converId,
                            ...response.data
                        }
                    });
                }
            },
            'takeLastest'
        ],
        *moreMessages({ payload: converId }, { call, put, select }) {
            const { list } = yield select(state => state.messenger.messages);
            const currentExisted = _.size(list);
            const response = yield call(messengerService.fetchMessages, converId, currentExisted);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'shiftMessages',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        *moreConversations(action, { call, put, select }) {
            const { list } = yield select(state => state.messenger.conversations);
            const currentExisted = _.size(_.toArray(list));
            const response = yield call(messengerService.fetchConversations, currentExisted);
            if (response) {
                const { hasMore, list } = response.data;
                yield put({
                    type: 'pushConversations',
                    payload: {
                        hasMore,
                        data: list
                    }
                });
            }
        },
        *send({ payload }, { call, put, select }) {
            const tempId = _.uniqueId('temp_');
            const user = yield select(state => state.user);
            yield put({
                type: 'pushSending',
                payload: {
                    _id: tempId,
                    user,
                    content: payload.content,
                    createdAt: payload.createdAt
                }
            });
            const response = yield call(messengerService.send, payload);
            if (response) {
                const { conversation, message } = response.data;
                if (!payload.converId) {
                    yield put({
                        type: 'clearFirst'
                    });
                }
                yield put({
                    type: 'shift',
                    payload: conversation
                });
                yield put({
                    type: 'messages/shift',
                    payload: conversation
                });
                yield put({
                    type: 'pushMessage',
                    tempId,
                    payload: message
                });
            }
        }
    },
    reducers: {
        saveConversations(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    hasMore,
                    list: { ...data }
                }
            };
        },
        saveMessages(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                messages: {
                    ...state.messages,
                    hasMore,
                    list: [...data]
                }
            };
        },
        pushConversations(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    hasMore,
                    list: {
                        ...state.conversations.list,
                        ...data
                    }
                }
            };
        },
        pushMessage(state, { tempId, payload: message }) {
            const sending = _.filter(state.messages.sending, message => message._id !== tempId);
            return {
                ...state,
                messages: {
                    ...state.messages,
                    sending,
                    list: [
                        ...state.messages.list,
                        message
                    ]
                }
            };
        },
        shiftMessages(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                messages: {
                    ...state.messages,
                    hasMore,
                    list: [
                        ...data,
                        ...state.messages.list
                    ]
                }
            };
        },
        saveUser(state, { payload: user }) {
            return {
                ...state,
                user
            };
        },
        saveFirstConversation(state, { payload }) {
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    first: payload
                }
            };
        },
        resetMessages(state) {
            return {
                ...state,
                messages: {
                    list: [],
                    sending: [],
                    hasMore: true
                }
            };
        },
        shift(state, { payload }) {
            if (!state.conversations.list) return state;
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    list: {
                        ...state.conversations.list,
                        [payload._id]: payload
                    }
                }
            };
        },
        clearFirst(state) {
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    first: null
                }
            };
        },
        pushSending(state, { payload }) {
            const user = payload.user;
            return {
                ...state,
                messages: {
                    ...state.messages,
                    sending: [
                        ...state.messages.sending,
                        {
                            ..._.omit(payload, ['user']),
                            userId: user._id,
                            userName: user.name,
                            avatar: user.avatar,
                            receivedAt: -1,
                            seenAt: -1
                        }
                    ]
                }
            };
        },
        reset() {
            return { ...initialState };
        }
    }
}