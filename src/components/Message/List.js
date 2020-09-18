import React from 'react';
import _ from 'lodash';
import { Row, Col, Avatar } from 'antd';
import styles from './List.less';
import moment from 'moment';

const Message = ({ message, userId }) => {
  let seen = null;
  if (message.userId === userId)
    seen = message.seenAt === -1 ? 'Đang gửi...' : (!message.seenAt ? 'Đã gửi' : 'Đã xem');
  return (
    <div className={styles.messageItem}>
      <div className={styles.messageContent}>
        <div className={styles.messageText}>
          {message.content.text || 'Tin nhắn bị lỗi'}
        </div>
      </div>
      <div className={styles.messageExtra}>
        <div className={styles.messageTime}>
          {moment(message.createdAt).format('HH:mm A')}
        </div>
        {seen && (
          <div className={styles.seen}>
            {seen}
          </div>
        )}
      </div>
    </div>
  )
}

const UserMessages = ({ messages, userId }) => {
  return (
    <div className={styles.userMessages}>
      <div className={styles.messages}>
        {messages.map(message => (
          <Message
            key={message._id}
            userId={userId}
            message={message}
          />
        ))}
      </div>
    </div>
  )
};

const OtherMessages = ({ messages, sender, userId }) => {
    const { name, avatar } = sender;
    return (
      <div className={styles.otherMessages}>
        <div className={styles.avatar}>
          <Avatar size={38} alt="usr" src={avatar} />
        </div>
        <div>
          <div className={styles.name}>{name}</div>
          <div className={styles.messages}>
            {messages.map(message => (
              <Message
                key={message._id}
                userId={userId}
                message={message}
              />
            ))}
          </div>
        </div>
      </div>
    )
};

const MessagesList = (props) => {
    const { messages, userId } = props;
    const groupedMessagesBySender = (messages) => {
      const resultGroups = [];
      let lastSenderId = null;
      let lastGroup;
      messages.forEach((message, index) => {
        if (message.userId !== lastSenderId) {
          lastGroup = {
            senderId: message.userId,
            senderName: message.userName,
            senderAvatar: message.avatar,
            key: `${message.userId}_${index}`,
            messagesOfSender: [message]
          }
          lastSenderId = message.userId;
          resultGroups.push(lastGroup);
        }
        else {
          lastGroup.messagesOfSender.push(message);
        }
      });
      return resultGroups;
    };
    const messagesData = groupedMessagesBySender(messages);
    return (
        <Row className={styles.messages}>
          {messagesData.map(groupBySender => {
            return groupBySender.senderId === userId ? (
              <UserMessages key={groupBySender.key} messages={groupBySender.messagesOfSender} userId={userId} />
            ) : (
              <OtherMessages key={groupBySender.key} sender={{ name: groupBySender.senderName, avatar: groupBySender.senderAvatar }} messages={groupBySender.messagesOfSender} userId={userId} />
            )
          })}
        </Row>
    )
}

export default MessagesList;
