import React from 'react';
import _ from 'lodash';
import { Avatar, Row, Col } from 'antd';
import Message from '@/components/Message';
import styles from './List.less';

const MessagesList = (props) => {
    const { messages } = props;
    let current = null;
    return (
        <Row className={styles.messages}>
            {messages.map(message => {
                let avatar = null;
                let name = null;
                //let flag = false;
                if (message.userId !== current) {
                    current = message.userId;
                    avatar = <Avatar src={message.avatar} alt="avatar" size={36} style={{ position: 'relative', top: '5px' }}/>;
                    name = <div className={styles.userName}>{message.userName}</div>;
                    //flag = true;
                }
                return (
                    <Row key={message._id + _.uniqueId('message_')} className={styles.messRow}>
                        <Col span={1} className={styles.avatar}>
                            {avatar}
                        </Col>
                        <Col span={23} className={styles.message}>
                            <React.Fragment>{name}</React.Fragment>
                            <Message message={message} />
                        </Col>
                    </Row>
                )
            })}
        </Row>
    )
}

export default MessagesList;