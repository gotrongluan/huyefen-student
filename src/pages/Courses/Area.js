import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Tabs, List, Carousel, Spin, Icon } from 'antd';
import ArrowCarousel from '@/components/ArrowCarousel';
import Course from '@/components/CourseCarouselItem';
import Instructor from '@/components/Instructor';
import { range } from '@/utils/utils';
import RECOMMEND from '@/assets/fakers/recommends';
import TOP_TOPICS from '@/assets/fakers/topTopics';
import INSTRUCTORS from '@/assets/fakers/instructors1';
import styles from './Area.less';
import router from 'umi/router';

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
    useEffect(() => {
        setRecommendLoading(true);
        setTimeout(() => {
            setRecommend(RECOMMEND);
            setRecommendLoading(false);
        }, 2000);
    }, [match.params.areaId]);
    useEffect(() => {
        setTimeout(() => {
            setTopics(TOP_TOPICS);
        }, 1600);
    }, [match.params.areaId]);
    useEffect(() => {
        setTimeout(() => {
            setInstructors(INSTRUCTORS);
        }, 1900);
    }, [match.params.areaId]);
    const coursesCarousel = (courses) => {
        return (
            <ArrowCarousel
                pageSize={5}
                speed={500}
                buttonSize={34}
                dataSource={courses}
                renderItem={course => (
                    <div className={styles.courseItem} key={course._id + _.uniqueId('course_')}>
                        <Course course={course} />
                    </div>
                )}
                renderEmptyItem={() => <div className={styles.courseItem} />}
            />
        )
    };
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

    const topicsCarousel = topics => {
        const topicsData = _.chunk(topics, 2);
        return (
            <ArrowCarousel
                pageSize={5}
                speed={500}
                buttonSize={34}
                dataSource={topicsData}
                renderItem={topicsPair => (
                    <div className={styles.pairItem} key={topicsPair[0]._id + _.uniqueId('topics_')}>
                        <div className={styles.topic} style={{ marginBottom: '10px' }} onClick={() => router.push(`/courses/topic/${topicsPair[0]._id}`)}>{formatMessage({ id: topicsPair[0].name })}</div>
                        {topicsPair[1] && <div className={styles.topic} onClick={() => router.push(`/courses/topic/${topicsPair[1]._id}`)}>{formatMessage({ id: topicsPair[1].name })}</div>}
                    </div>
                )}
                renderEmptyItem={() => <div className={styles.pairtem} />}
            />
        )
    };

    const instructorsCarousel = instructors => {
        return (
            <ArrowCarousel
                pageSize={5}
                speed={500}
                buttonSize={34}
                dataSource={instructors}
                renderItem={instructor => (
                    <div className={styles.instructorItem} key={instructor._id + _.uniqueId('instructor_')}>
                        <Instructor instructor={instructor} />
                    </div>
                )}
                renderEmptyItem={() => <div className={styles.instructorItem} />}
            />
        )
    }

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
                    <div className={styles.recommend}>
                        <div className={styles.title}>Courses to get you started</div>
                        <div className={styles.content}>
                            <Tabs animated={false}>
                                {_.map(recommend, recommendType => (
                                    <TabPane tab={recommendType.title} key={recommendType.key}>
                                        <div>{coursesCarousel(recommendType.courses)}</div>
                                    </TabPane>
                                ))}
                            </Tabs>
                        </div>
                    </div>
                )}
                {topics && !_.isEmpty(topics) && (
                    <div className={styles.topics}>
                        <div className={styles.title}>Most popular topics</div>
                        <div className={styles.content}>
                            {topicsCarousel(topics)}
                        </div>
                    </div>
                )}
                {instructors && !_.isEmpty(instructors) && (
                    <div className={styles.instructors}>
                        <div className={styles.title}>Popular instructors</div>
                        <div className={styles.content}>
                            {instructorsCarousel(instructors)}
                        </div>
                    </div>
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
