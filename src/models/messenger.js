import { delay } from '@/utils/utils';
import OLD_MESSAGES from '@/assets/fakers/oldMessages';
import MESSAGES from '@/assets/fakers/messages';
import CONVERSATIONS from '@/assets/fakers/conversations';
import OLD_CONVERSATIONS from '@/assets/fakers/oldConversations';
const USER = {
    _id: 1,
    name: 'Ngoc Hanh Vuong',
    avatar: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-0/p640x640/42792810_1917076911720427_2309321533291495424_o.jpg?_nc_cat=110&_nc_ohc=GAtqnLxcynIAX8VZhpo&_nc_ht=scontent.fdad2-1.fna&_nc_tp=1002&oh=67837b802b62d8b1fb6423a3dc393017&oe=5E9B0CF0'
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