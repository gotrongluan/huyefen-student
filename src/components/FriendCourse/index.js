import React from 'react';
import classNames from 'classnames';
import { Card, Rate, Icon } from 'antd';
import { truncate, transAuthors, roundStarRating } from '@/utils/utils';
import styles from './index.less';

const FriendCourse = ({ course }) => {
    return (
        <Card
            className={course.isRegistered ? classNames(styles.course, styles.registered) : styles.course}
            style={{ width: '100%' }}
            hoverable
            cover={
                <div className={styles.cover}>
                    {course.isRegistered && (
                        <div className={styles.ticked}>
                            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                        </div>
                    )}
                    <img alt="avatar" src={course.avatar} />
                </div>
            }
        >
            <div className={styles.info}>
                <div className={styles.name}>{truncate(course.name, 35)}</div>
                <div className={styles.authors}>{transAuthors(course.authors, 26)}</div>
                <div className={styles.starRating}>
                    <Rate allowHalf value={roundStarRating(course.starRating)} disabled className={styles.stars} />
                    <span className={styles.ratingVal}>{course.starRating}</span>
                </div>
            </div>
        </Card> 
    )
};

export default FriendCourse;
