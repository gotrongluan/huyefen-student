import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import styles from './Messenger.less';
import { Icon, Input, Spin as Loading, Row, Col, Badge, List, Avatar, Button } from 'antd';
import MessageView from '@/pages/Messenger/MessageView';
import moment from 'moment';
import _ from 'lodash';
import io from 'socket.io-client';
import UserAvatar from '@/components/Avatar';
import { Link } from 'umi';

const LearningMessenger = ({ dispatch, match, ...props }) => {
    const { courseId } = match.params;
    const {
      loading,
      moreLoading,
      hasMoreMessages,
      messages,
      members,
      memberLoading,
      hasMoreMembers,
      moreMemberLoading,
      userId
    } = props;
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  useEffect(() => {
      dispatch({
        type: 'learningMessenger/fetchMessages',
        payload: courseId
      });
      dispatch({
        type: 'learningMessenger/fetchMembers',
        payload: courseId
      });
    if (!socket) {
      const newSocket = io(`https://localhost:3443/course-messenger?userId=${userId}`);
      newSocket.on('connect', () => {
        console.log('Connect socket successfully!');
      });
      newSocket.on('disconnect', () => {
        console.log('Disconnect socket!');
      });
      newSocket.on('message', handleReceivedMessage);
      newSocket.on('startOk', () => {
        console.log(`Successfully started!`);
      });
      newSocket.on('endOk', () => {
        console.log(`Successfully left!`);
      });
      setSocket(newSocket);
    }
      return () => dispatch({
        type: 'learningMessenger/reset'
      });
  }, []);
  useEffect(() => {
    if (socket) {
      socket.emit('start', { userId, courseId });
      return () => socket.emit('end', { userId });
    }
  }, [socket, courseId]);

  useEffect(() => {
    if (socket) {
      return () => socket.disconnect();
    }
  }, [socket]);

  const handleReceivedMessage = message => {
    dispatch({
      type: 'learningMessenger/pushReceivedMessage',
      payload: message
    });
  };

  const fetchOldMessages = () => {
    if (hasMoreMessages)
      dispatch({
        type: 'learningMessenger/moreMessages',
        payload: courseId
      });
  };
  const handleSendMessage = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const chatText = inputMessage.trim();
      if (chatText.length === 0) return;
      sendTextMessage(chatText);
      setInputMessage('');
    }
  };
  const sendTextMessage = (textMessage) => {
    dispatch({
      type: 'learningMessenger/sendTextMessage',
      payload: {
        courseId,
        content: textMessage
      }
    });
  }
  const parseToMessageListsByDate = messages => {
    let messageListsByDate = [];
    let currentTime = null;
    let currentObj = null;
    console.log(messages);
    for (let i = 0; i < messages.length; ++i) {
      const message = messages[i];
      const time = moment(message.createdAt).format("MMM D");
      if (time !== currentTime) {
        currentTime = time;
        currentObj = {
          day: currentTime,
          messages: [message],
        };
        messageListsByDate.push(currentObj);
      }
      else {
        currentObj.messages.push(message);
      }
    }
    return messageListsByDate;
  };
  const handleGetMoreMembers = () => {
    dispatch({
      type: 'learningMessenger/moreMembers',
      payload: courseId
    });
  }
  const messagesData = parseToMessageListsByDate(messages);
  const disabledInput = loading || moreLoading;
  const hasMoreBtn = hasMoreMembers ? (
    <Button type="primary" size="small" onClick={handleGetMoreMembers}>
      More members
    </Button>
  ) : null;
    return (
      <Row className={styles.messenger}>
        <Col span={16} className={styles.messages}>
          {loading ? (
            <div className={styles.loading}>
              <Loading indicator={<Icon type="loading-3-quarters" style={{ fontSize: 64 }} spin />} />
            </div>
          ) : (
            <div className={styles.mess}>
              <MessageView
                userId={userId}
                messages={messagesData}
                converId={courseId}
                fetchOldMessages={fetchOldMessages}
                oldLoading={moreLoading}
              />
            </div>
          )}
          <div className={styles.typeMessage}>
            <div className={styles.textBox}>
              <Input.TextArea
                  disabled={disabledInput}
                  className={styles.textArea}
                  autoSize={{ minRows: 2 }}
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Enter message"
                  onPressEnter={handleSendMessage}
              />
            </div>
            <div className={styles.upload}>
              <span className={styles.icon}><Icon type="file-image" /></span>
              <span className={styles.icon}><Icon type="smile" /></span>
            </div>
          </div>
        </Col>
        <Col span={8} className={styles.members}>
          <div className={styles.title}>
            Members
          </div>
          <div className={styles.list}>
            <List
              loading={memberLoading}
              dataSource={members}
              itemLayout="horizontal"
              rowKey={item => item._id}
              renderItem={item => (
                <List.Item

                >
                  <List.Item.Meta
                    avatar={
                      <UserAvatar
                        src={item.user.avatar}
                        alt="test"
                        size={36}
                        textSize={36}
                        borderWidth={0}
                        text={item.user.name}
                        //style={{ color: 'black', background: '#fada5e' }}
                      />
                    }
                    title={<Link to={`/friend/${item.user._id}`}>{item.user.name}</Link>}
                    description={item.isOnline ? <Badge color="#87d068" text="Online" /> : <Badge color="#f50" text="Offline" />}
                  />
                </List.Item>
              )}
            />
            <div className={styles.more}>
              {moreMemberLoading ? (
                <div>
                  <Loading indicator={<Icon type="loading-3-quarters" style={{ fontSize: 32 }} spin />} />
                </div>
              ) : (
                <div className={styles.btn}>{hasMoreBtn}</div>
                )}

            </div>
          </div>
        </Col>
      </Row>
    )
};

export default connect(({ loading, user, learningMessenger }) => ({
  loading: !!loading.effects['learningMessenger/fetchMessages'],
  moreLoading: !!loading.effects['learningMessenger/moreMessages'],
  hasMoreMessages: learningMessenger.hasMore,
  hasMoreMembers: learningMessenger.hasMoreMember,
  messages: _.concat(learningMessenger.list, learningMessenger.sending),
  members: learningMessenger.members,
  memberLoading: !!loading.effects['learningMessenger/fetchMembers'],
  moreMemberLoading: !!loading.effects['learningMessenger/moreMembers'],
  userId: user._id
}))(LearningMessenger);
