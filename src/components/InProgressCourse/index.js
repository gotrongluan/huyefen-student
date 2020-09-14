import React from 'react';
import Link from 'umi/link';
import { Row, Col, Progress, Tooltip, Card } from 'antd';
import { linearColorTheme } from '@/config/constants';
import styles from './index.less';
import { truncate } from '@/utils/utils';

const InProgressCourse = ({ course }) => {
    return (
        <Link to={`/course/${course._id}`}>
            <Card hoverable style={{ width: '100%' }} className={styles.course}>
                <Row className={styles.info}>
                    <Col span={10} className={styles.avatar}>
                        <img alt="avatar" src={course.avatar} />
                    </Col>
                    <Col span={14} className={styles.name}>
                        {course.title}
                    </Col>
                </Row>
                <div className={styles.progress}>
                    <Tooltip placement="top" title={`${course.progress}%`}>
                        <Progress percent={course.progress} strokeLinecap="square" showInfo={false} strokeColor={linearColorTheme} />
                    </Tooltip>
                </div>
            </Card>
        </Link>
    );
};

export default InProgressCourse;
