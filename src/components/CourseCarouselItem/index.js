import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import router from 'umi/router';
import Link from 'umi/link';
import { formatMessage } from 'umi-plugin-react/locale';
import { Popover, Card, Button, Icon, Rate, Row, Col, Divider } from 'antd';
import FeaturedBadge from '@/components/FeaturedBadge';
import { truncate, transAuthors, roundStarRating } from '@/utils/utils';
import styles from './index.less';

const CourseCarouselItem = ({ course }) => {

    const content = (
        <div className={styles.content}>
            <div className={styles.lastUpdated}>
                {`${formatMessage({ id: 'course.lastupdated' })}: ${moment(course.lastUpdated).format("YYYY-MM-DD")}`}
            </div>
            <div className={styles.name}>
                {truncate(course.title, 100)}
            </div>
            {course.featured ? (
                <div className={styles.topic}>
                    <FeaturedBadge type={course.featured} style={{ marginRight: '12px' }}/>
                    in <Link to="/">{course.area}</Link>
                    <Divider type="vertical" style={{ background: 'white' }} />
                    <span>{course.primaryTopic}</span>
                </div>
            ) : (
                <div className={styles.topic}>
                    <Link to="/">{course.area}</Link>
                    <Divider type="vertical" style={{ background: 'white' }} />
                    <span>{course.primaryTopic}</span>
                </div>
            )}
            <Row className={styles.lectureInfo}>
                <Col className={styles.infoItem} span={12}>
                    <Icon type="container" theme="filled" />
                    <span>{`${course.numOfStudents} students`}</span>
                </Col>
                <Col className={styles.infoItem} span={12}>
                    <Icon type="rocket" theme="filled" />
                    <span>{course.level}</span>
                </Col>
            </Row>
            <div className={styles.summary}>
                {truncate(course.subTitle, 130)}
            </div>
            <div className={styles.whatLearn}>
                <ul className={styles.list}>
                    {_.map(course.whatLearns, item => (
                        <li key={item._id}>{truncate(item.title, 120)}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.addToCart}>
                <Button type="primary" size="large" icon="shopping-cart">{formatMessage({ id: 'course.addToCart' })}</Button>
            </div>
        </div>
    );

    const trigger = (
        <Card
            className={styles.course}
            hoverable
            onClick={() => router.push(`/course/${course._id}`)}
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
                <div className={styles.name}>{truncate(course.title, 44)}</div>
                <div className={styles.authors}>{transAuthors(course.authors, 26)}</div>
                <div className={styles.starRating}>
                    <Rate allowHalf value={roundStarRating(course.starRating)} disabled className={styles.stars} />
                    <span className={styles.ratingVal}>{_.round(course.starRating, 1)}</span>
                </div>
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
            </div>
        </Card>

    );

    return (
        <Popover
            placement="right"
            popupClassName={styles.popover}
            trigger="hover"
            content={content}
            mouseEnterDelay={0.5}
        >
            {trigger}
        </Popover>
    )
};

export default CourseCarouselItem;
