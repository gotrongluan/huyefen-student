import React from 'react';
import _ from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Popover, Card, Button, Icon, Tag, Rate } from 'antd';
import { tagColor, featuredColor } from '@/config/constants';
import { truncate, transAuthors } from '@/utils/utils';
import styles from './index.less';

const CourseCarouselItem = ({ course }) => {

    const topics = [...course.topics, course.category];

    const content = (
        <div className={styles.content}>
            <div className={styles.lastUpdated}>
                {`${formatMessage({ id: 'course.lastupdated' })}: ${course.lastUpdated}`}
            </div>
            <div className={styles.name}>
                {course.name}
            </div>
            {course.featured && !_.isEmpty(course.featured) && (
                <div className={styles.featured}>
                    {_.map(course.featured, (featured, i) => (
                        <Tag color={featuredColor(i)} key={_.uniqueId('course_feature_')}>{formatMessage({ id: featured })}</Tag>
                    ))}
                </div>
            )}
            <div className={styles.topics}>
                {_.map(topics, (topic, i) => (
                    <Tag color={tagColor(i)} key={_.uniqueId('course_topic_')}>{formatMessage({ id: topic })}</Tag>
                ))}
            </div>
            <div className={styles.lectureInfo}>
                <span className={styles.infoItem}>
                    <Icon type="container" style={{ fontSize: '0.5em' }}/>
                    <span>{`${course.numOfLectures} ${formatMessage({ id: 'course.lectures' })}`}</span>
                </span>
                <span className={styles.infoItem}>
                    <Icon type="rocket" style={{ fontSize: '0.5em' }}/>
                    <span>{formatMessage({ id: course.level })}</span>
                </span>
            </div>
            <div className={styles.summary}>
                {truncate(course.summary, 90)}
            </div>
            <div className={styles.whatLearn}>
                <ul className={styles.list}>
                    {_.map(course.whatLearn, item => (
                        <li key={_.uniqueId('what_learn_')}>{truncate(item, 60)}</li>
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
            hoverable
            style={{ width: '100%' }}
            cover={<img alt="cover" src={course.avatar} />}
        >
            <div className={styles.info}>
                <div className={styles.name}>{truncate(course.name, 60)}</div>
                <div className={styles.authors}>{transAuthors(course.authors, 36)}</div>
                <div className={styles.starRating}>
                    <Rate allowHalf value={course.rating} disabled />
                </div>
                <div className={styles.price}>
                    {course.price}
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
        >
            {trigger}
        </Popover>
    )
};

export default CourseCarouselItem;