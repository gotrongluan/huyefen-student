import { delay } from '@/utils/utils';

const initialState = {
    info: null,
    courses: {
        hasMore: true,
        list: null
    }
};

export default {
    namespace: 'teacher',
    state: initialState,
    effects: {
        *fetch()
    },
    reducers: {

    }
}