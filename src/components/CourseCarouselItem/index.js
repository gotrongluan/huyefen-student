import React from 'react';
import _ from 'lodash';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import { Popover, Card, Button, Icon, Tag, Rate, Row, Col } from 'antd';
import { tagColor, featuredColor } from '@/config/constants';
import { truncate, transAuthors, roundStarRating } from '@/utils/utils';
import styles from './index.less';

const CourseCarouselItem = ({ course }) => {

    const topics = [...course.topics, course.category];

    const content = (
        <div className={styles.content}>
            <div className={styles.lastUpdated}>
                {`${formatMessage({ id: 'course.lastupdated' })}: ${course.lastUpdated}`}
            </div>
            <div className={styles.name}>
                {truncate(course.name, 100)}
            </div>
            {course.featured && !_.isEmpty(course.featured) && (
                <div className={styles.featured}>
                    {_.map(course.featured, (featured, i) => (
                        <Tag color={featuredColor(i)} key={_.uniqueId('course_feature_')}>{_.toUpper(formatMessage({ id: featured }))}</Tag>
                    ))}
                </div>
            )}
            <div className={styles.topics}>
                {_.map(topics, (topic, i) => (
                    <Tag color={tagColor(i)} key={_.uniqueId('course_topic_')}>{formatMessage({ id: topic })}</Tag>
                ))}
            </div>
            <Row className={styles.lectureInfo}>
                <Col className={styles.infoItem} span={12}>
                    <Icon type="container" theme="filled" />
                    <span>{`${course.numOfLectures} ${formatMessage({ id: 'course.lectures' })}`}</span>
                </Col>
                <Col className={styles.infoItem} span={12}>
                    <Icon type="rocket" theme="filled" />
                    <span>{formatMessage({ id: course.level })}</span>
                </Col>
            </Row>
            <div className={styles.summary}>
                {truncate(course.summary, 130)}
            </div>
            <div className={styles.whatLearn}>
                <ul className={styles.list}>
                    {_.map(course.whatLearn, item => (
                        <li key={_.uniqueId('what_learn_')}>{truncate(item, 120)}</li>
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
            onClick={() => router.push('/course/123')}
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
                <div className={styles.price}>
                    {`$${_.round(course.price, 2)}`}
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