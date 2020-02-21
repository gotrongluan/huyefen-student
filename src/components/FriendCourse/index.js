import React from 'react';
import classNames from 'classnames';
import Link from 'umi/link';
import { Card, Rate, Tooltip } from 'antd';
import { truncate, transAuthors, roundStarRating } from '@/utils/utils';
import Same from '@/elements/icon/same';
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
                    {course.isRegistered && (
                        <div className={styles.same}>
                            <Tooltip placement="bottom" title="You and your friend bought this course together"><Same /></Tooltip>
                        </div>
                    )}
                </div>
            </Card> 
        </Link>
    );
};

export default FriendCourse;
