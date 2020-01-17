import React from 'react';
import moment from 'moment';
import { Row, Col, Icon } from 'antd';
import Check from '@/elements/icon/check';
import CheckAll from '@/elements/icon/checkAll';
import styles from './index.less';

const Message = ({ message }) => {
    const userId = '5cff74fe01b2fcce8819970b';
    let seen = null;
    if (message.userId === userId)
        seen = message.seenAt === -1 ? (<Icon type="clock-circle" style={{ color: '#fada5e' }} />) : (!message.seenAt ? (<Check />) : (<CheckAll />));
    return (
        <Row className={styles.message}>
            <Col className={styles.content} span={22}>
                {(message.content && message.content.trim()) || 'Tin nhắn bị lỗi'}
            </Col>
            <Col className={styles.timeAndStatus} span={2}>
                {seen}
                <span className={styles.time}>{moment(message.createdAt).format("HH:mm")}</span>
            </Col>
        </Row>
    );
}

export default Message;