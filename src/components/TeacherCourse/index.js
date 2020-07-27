import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Link from 'umi/link';
import FeaturedBadge from '@/components/FeaturedBadge';
import { Card, Rate } from 'antd';
import { truncate, transAuthors, roundStarRating, mapKeyToPrice } from '@/utils/utils';
import styles from './index.less';
const defaultPhoto = "https://images.pexels.com/photos/3662845/pexels-photo-3662845.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";

const TeacherCourse = ({ course }) => {
    const price = mapKeyToPrice(course.price);
    const realPrice = mapKeyToPrice(course.realPrice);
    const priceText = price > 0 ? `$${_.round(price, 2)}` : 'Free';
    const realPriceText = realPrice > 0 ? `$${_.round(realPrice, 2)}` : 'Free';

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
                        <img alt="cover" src={course.avatar || defaultPhoto} />
                    </div>
                    
                )}
            >
                <div className={styles.info}>
                    <div className={styles.name}>{truncate(course.title, 50)}</div>
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
                            {realPrice > price && (
                                <span className={styles.realPriceVal}>
                                    {realPriceText}
                                </span>
                            )}
                            <span className={styles.priceVal}>
                                {priceText}
                            </span>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    )
};

export default TeacherCourse;