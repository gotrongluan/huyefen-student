import React from 'react';
import { Row, Col, Progress, Tooltip, Card } from 'antd';
import { linearColorTheme } from '@/config/constants';
import styles from './index.less';

const InProgressCourse = ({ course }) => {
    return (
        <Card hoverable style={{ width: '100%' }} className={styles.course}>
            <Row className={styles.info}>
                <Col span={10} className={styles.avatar}>
                    <img alt="avatar" src={course.avatar} />
                </Col>
                <Col span={14} className={styles.name}>
                    {course.name}
                </Col>
            </Row>
            <div className={styles.progress}>
                <Tooltip placement="top" title={`${course.progress}%`}>
                    <Progress percent={course.progress} strokeLinecap="square" showInfo={false} strokeColor={linearColorTheme} />
                </Tooltip>
            </div>
        </Card>
    )
};

export default InProgressCourse;