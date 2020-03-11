import { delay } from '@/utils/utils';
import OLD_MESSAGES from '@/assets/fakers/oldMessages';
import MESSAGES from '@/assets/fakers/messages';
import CONVERSATIONS from '@/assets/fakers/conversations';
import OLD_CONVERSATIONS from '@/assets/fakers/oldConversations';
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
            yield delay(1600);
            yield put({
                type: 'saveConversations',
                payload: {
                    hasMore: true,
                    data: CONVERSATIONS
                }
            });
        },
        fetchMessages: [
            function* ({ payload: converId }, { call, put }) {
                yield delay(1700);
                yield put({
                    type: 'saveMessages',
                    payload: {
                        hasMore: true,
                        data: MESSAGES
                    }
                });
            },
            'takeLastest'
        ],
        fetchUser: [
            function* ({ payload: converId }, { call, put }) {
                yield delay(1200);
                yield put({
                    type: 'saveUser',
                    payload: {
                        converId,
                        ...USER
                    }
                });
            },
            'takeLastest'
        ],
        *moreMessages({ payload: converId }, { call, put, select }) {
            yield delay(1200);
            yield put({
                type: 'shiftMessages',
                payload: {
                    hasMore: false,
                    data: OLD_MESSAGES
                }
            });
        },
        *moreConversations({ payload: converId }, { call, put, select }) {
            yield delay(1000);
            yield put({
                type: 'pushConversations',
                payload: {
                    hasMore: false,
                    data: OLD_CONVERSATIONS
                }
            });
        },
        *send({ payload }, { call, put }) {

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
        pushMessage(state, { payload }) {

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
        reset() {
            return { ...initialState };
        }
    }
}