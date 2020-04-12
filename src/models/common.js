import { delay } from '@/utils/utils';

export default {
    namespace: 'common',
    state: {},
    effects: {
        *upload({ payload }, { call }) {
            //must have token, if not token --> 403/401
            const { file, callback } = payload;
            yield delay(1200);
            if (callback) callback(file);
        }
    }
}