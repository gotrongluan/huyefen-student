import { delay } from '@/utils/utils';

export default {
    namespace: 'common',
    state: {},
    effects: {
        *upload({ payload }, { call }) {
            const { file, callback } = payload;
            yield delay(1200);
            if (callback) callback(file);
        }
    }
}