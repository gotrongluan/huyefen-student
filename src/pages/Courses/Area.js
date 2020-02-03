import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Tabs, List, Carousel, Spin, Icon } from 'antd';
import { range } from '@/utils/utils';
import styles from './Area.less';

const { TabPane } = Tabs;

const Area = ({ match }) => {
    const [areaInfo, setAreaInfo] = useState(null);
    const [recommend, setRecommend] = useState(null);
    const [recommendLoading, setRecommendLoading] = useState(false);
    const [topics, setTopics] = useState(null);
    const [instructors, setInstructors] = useState(null);
    const [courses, setCourses] = useState(null);
    const [coursesLoading, setCoursesLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setAreaInfo({
                _id: 1,
                title: 'Development'
            })
        }, 1000)
    }, [match.params.areaId]);

    const courseSkeletonsCarousel = () => {
        return (
            <Carousel
                arrow={false}
                dots={false}
                slidesToShow={5}
            >
                {_.map(range(5), n => (
                    <div className={styles.courseItem} key={n + _.uniqueId('course_skeleton_')}>
                        <div className={styles.courseSkeleton}>
                            <div className={classNames(styles.avatar, styles.skeletonBox)} />
                            <div className={styles.info}>
                                <div className={classNames(styles.name, styles.skeletonBox)} />
                                <div className={classNames(styles.authors, styles.skeletonBox)} />
                                <div className={classNames(styles.price, styles.skeletonBox)} />
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        )
    };

    return (
        <div className={styles.area}>
            {areaInfo && (
                <div className={styles.jumpotron}>
                    <div className={styles.title}>{`${areaInfo.title} courses`}</div>
                </div>
            )}
            <div className={styles.main}>
                {!recommend || recommendLoading ? (
                    <div className={styles.recommendLoading}>
                        {courseSkeletonsCarousel()}
                    </div>
                ) : (
                    <div></div>
                )}
                {topics && (
                    <div></div>
                )}
                {instructors && (
                    <div></div>
                )}
                {!courses || coursesLoading ? (
                    <div className={styles.coursesLoading}>
                        <Spin indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />} />
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    )
};

export default Area;
