import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Link from 'umi/link';
import FeaturedBadge from '@/components/FeaturedBadge';
import { Card, Rate } from 'antd';
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
                        {course.featured && (
                            <div className={styles.featured}>
                                <FeaturedBadge type={course.featured} />
                            </div>
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
                            {course.realPrice > course.price && (
                                <span className={styles.realPriceVal}>
                                    {`$${_.round(course.realPrice, 2)}`}
                                </span>
                            )}
                            <span className={styles.priceVal}>
                                {`$${_.round(course.price, 2)}`}
                            </span>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    )
};

export default TeacherCourse;