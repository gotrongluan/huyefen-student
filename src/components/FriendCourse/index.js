import React from 'react';
import _ from 'lodash';
import Link from 'umi/link';
import { Card, Rate, Tooltip, Tag } from 'antd';
import { truncate, transAuthors, roundStarRating } from '@/utils/utils';
import defaultAvatar from '@/assets/images/logo_trans.png';
import styles from './index.less';

const FriendCourse = ({ course }) => {
    return (
        <Link to={`/course/${course._id}`}>
            <Card
                className={styles.course}
                style={{ width: '100%' }}
                hoverable
                cover={
                    <div className={styles.cover}>
                        <img alt="avatar" src={course.avatar || defaultAvatar} />
                    </div>
                }
            >
                <div className={styles.info}>
                    <div className={styles.name}>{truncate(course.title, 50)}</div>
                    <div className={styles.authors}>{transAuthors(course.authors, 26)}</div>
                    <div className={styles.starRating}>
                        <Rate allowHalf value={roundStarRating(course.starRating)} disabled className={styles.stars} />
                        <span className={styles.ratingVal}>{_.round(course.starRating, 1)}</span>
                    </div>
                    {course.isRegistered && (
                        <div className={styles.same}>
                            <Tooltip placement="bottom" title="You also bought this course">
                                <Tag color="#87d068">Bought</Tag>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
};

export default FriendCourse;
