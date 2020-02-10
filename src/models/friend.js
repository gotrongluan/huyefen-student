

export default {
    namespace: 'friend',
    state: {
        info: null,
        courses: {
            hasMore: true,
            list: null
        },
        friends: {
            hasMore: true,
            list: null
        }
    },
    effects: {
        *fetch(action, { call, put }) {

        },
        *fetchCourses(action, { call, put }) {

        },
        *fetchFriends(action, { call, put }) {

        },
        *moreCourses(action, { call, put, select }) {

        },
        *allFriends(action, { call, put, select }) {

        },
        *allCourses(action, { call, put, select }) {

        }
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                info: payload
            };
        },
        saveCourses(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                courses: {
                    hasMore,
                    list: [...data]
                }
            };
        },
        saveFriends(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                friends: {
                    hasMore,
                    list: [...data]
                }
            };
        },
        pushCourses(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                courses: {
                    hasMore,
                    list: [
                        ...state.courses.list,
                        ...data
                    ]
                }
            };
        },
        pushFriends(state, { payload }) {
            const { hasMore, data } = payload;
            return {
                ...state,
                friends: {
                    hasMore,
                    list: [
                        ...state.friends.list,
                        ...data
                    ]
                }
            };
        }
    }
}