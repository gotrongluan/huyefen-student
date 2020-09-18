import * as courseServices from '@/services/course';
import _ from 'lodash';
import * as messengerService from '@/services/messenger';

export default {
  namespace: 'learningMessenger',
  state: {
    list: [],
    sending: [],
    hasMore: true,
    hasMoreMember: true,
    members: []
  },
  effects: {
    fetchMessages: [
      function* ({ payload: courseId }, { call, put }) {
        const response = yield call(courseServices.fetchMessagesOfCourse, courseId);
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
    *fetchMembers({ payload: courseId }, { call, put }) {
      const response = yield call(courseServices.fetchMembersOfCourse, courseId);
      if (response) {
        const { hasMore, list } = response.data;
        yield put({
          type: 'saveMembers',
          payload: {
            hasMore,
            data: list
          }
        })
      }
    },
    *moreMembers({ payload }, { call, put, select }) {
      const courseId = payload;
      const members = yield select(state => state.learningMessenger.members);
      const response = yield call(courseServices.fetchMembersOfCourse, courseId, members.length);
      if (response) {
        const { hasMore, list } = response.data;
        yield put({
          type: 'pushMembers',
          payload: {
            hasMore,
            data: list
          }
        })
      }
    },
    *moreMessages({ payload: courseId }, { call, put, select }) {
      const list = yield select(state => state.learningMessenger.list);
      const currentExisted = _.size(list);
      const response = yield call(courseServices.fetchMessagesOfCourse, courseId, currentExisted);
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
    *sendTextMessage({ payload }, { call, put, select }) {
      const { courseId, content } = payload;
      const tempId = _.uniqueId('temp_');
      const user = yield select(state => state.user);
      yield put({
        type: 'pushSending',
        payload: {
          _id: tempId,
          user,
          content: {
            text: content
          },
          createdAt: Date.now()
        }
      });
      const response = yield call(courseServices.sendCourseMessage, courseId, content);
      if (response) {
        yield put({
          type: 'pushMessage',
          tempId,
          payload: response.data
        });
      }
    }
  },
  reducers: {
    pushSending(state, { payload }) {
      const user = payload.user;
      return {
        ...state,
        sending: [
          ...state.sending,
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
    },
    pushMessage(state, { tempId, payload: message }) {
      const sending = _.filter(state.sending, message => message._id !== tempId);
      return {
        ...state,
        sending,
        list: [
          ...state.list,
          message
        ]
      };
    },
    pushReceivedMessage(state, { payload: message }) {
      return {
        ...state,
        list: [
          ...state.list,
          message
        ]
      };
    },
    saveMembers(state, { payload: {hasMore, data }}) {
        return {
          ...state,
          hasMoreMember: hasMore,
          members: data
        };
    },
    pushMembers(state, { payload: {hasMore, data }}) {
      return {
        ...state,
        hasMoreMember: hasMore,
        members: [
          ...state.members,
          ...data
        ]
      };
    },
    shiftMessages(state, { payload: {hasMore, data }}) {
        return {
          ...state,
          hasMore,
          list: [
            ...data,
            ...state.list
          ]
        }
    },
    saveMessages(state,{ payload: {hasMore, data }}) {
      return {
        ...state,
        hasMore,
        list: data
      };
    },
    reset() {
      return {
        list: [],
        sending: [],
        hasMore: true,
        hasMoreMember: true,
        members: []
      }
    }
  }
}
