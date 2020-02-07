import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Card, Rate, Tag } from 'antd';
import { featuredColor } from '@/config/constants';
import { truncate, transAuthors, roundStarRating } from '@/utils/utils';
import styles from './index.less';

const TeacherCourse = ({ course }) => {
    return (
        <Link to={`/course/${course._id}`}>
            <Card
                className={course.isRegistered ? classNames(styles.course, styles.isRegistered) : styles.course}
                hoverable
                style={{ width: '100%' }}
                cover={(
                    <div className={styles.cover}>
                        {course.featured && !_.isEmpty(course.featured) && (
                            <Tag color={featuredColor(0)} key={_.uniqueId('course_feature_')}>{_.toUpper(formatMessage({ id: course.featured[0] }))}</Tag>
                        )}
                        <img alt="cover" src={course.avatar} />
                    </div>
                    
                )}
            >
                <div className={styles.info}>
                    <div className={styles.name}>{truncate(course.name, 35)}</div>
                    <div className={styles.authors}>{transAuthors(course.authors, 26)}</div>
                    <div className={styles.starRating}>
                        <Rate allowHalf value={roundStarRating(course.starRating)} disabled className={styles.stars} />
                        <span className={styles.ratingVal}>{course.starRating}</span>
                    </div>
                    {course.isRegistered ? (
                        <div className={styles.registered}>
                            Registered
                        </div>
                    ) : (
                        <div className={styles.price}>
                            {`$${_.round(course.price, 2)}`}
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    )
};

export default TeacherCourse;