import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Link from 'umi/link';
import { Parallax } from 'react-parallax';
import { Row, Col, Tabs, Carousel, Button, Tag } from 'antd';
import Spin from '@/elements/spin/secondary';
import { formatMessage } from 'umi-plugin-react/locale';
import Course from '@/components/CourseCarouselItem';
import Friend from '@/components/Friend';
import InProgressCourse from '@/components/InProgressCourse';
import MOST_POPULAR from '@/assets/fakers/mostPopular';
import TOP_RATING from '@/assets/fakers/topRating';
import TOP_COURSES_OF_CATES from '@/assets/fakers/topCoursesOfCates';
import TOP_TOPICS from '@/assets/fakers/topTopics';
import TOP_FRIENDS from '@/assets/fakers/topFriends';
import MY_COURSES from '@/assets/fakers/mycourses';
import homeJumpotronImg from '@/assets/images/homeJumpotronImg.jpg';
import { tagColor } from '@/config/constants';
import { range } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;

const Homepage = () => {
    // let loading = false;
    // let categories = CATEGORIES;
    const personal = false;
    const mostPopularCourses = MOST_POPULAR;
    const topRatingCourses = TOP_RATING;
    const topTopics = TOP_TOPICS;
    const topFriends = TOP_FRIENDS;
    const backCourses = MY_COURSES;
    const loading = false
    const isBack = true;
    const backLoading = false;
    const recommendLoading = false;
    let recommender = null;
    const topCoursesOfCates = TOP_COURSES_OF_CATES;
    const coursesCarousel = (courses) => {
        // const chunks = _.chunk(courses, chunkSize);
        // return (
        //     <Carousel
        //         arrows
        //         dots={false}
        //         prevArrow={<Button shape="circle" icon="left" size="large" />}
        //         nextArrow={<Button shape="circle" icon="right" size="large" />}
        //     >
        //         {_.map(chunks, courses => (
        //             <Row key={_.uniqueId('panel_courses_')} gutter={24}>
        //                 {_.map(courses, course => (
        //                     <Col span={6} key={_.uniqueId('course_')}>
        //                         <Course course={course} />
        //                     </Col>
        //                 ))}
        //             </Row>
        //         ))}
        //     </Carousel>
        // );
        return (
            <Carousel
                arrows
                dots={false}
                slidesToShow={5}
                slidesToScroll={3}
                speed={500}
                prevArrow={<Button shape="circle" icon="left" size="large" />}
                nextArrow={<Button shape="circle" icon="right" size="large" />}
            >
                {_.map(courses, (course, i) => (
                    <div className={styles.courseItem} key={course._id + _.uniqueId('course_')}>
                        <Course course={course} />
                    </div>
                ))}
                {_.map(range(5 - courses.length), n => (<div key={n} className={styles.courseItem} />))}
            </Carousel>
        )
    };

    const friendsCarousel = (friends) => {
        return (
            <Carousel
                arrows={false}
                slidesToShow={4}
                slidesToScroll={2}
                speed={500}
                autoplay
                autoplaySpeed={3500}
            >
                {_.map(friends, (friend, i) => (
                    <div className={styles.friendItem} key={friend._id + _.uniqueId('friend_')}>
                        <Friend friend={friend} />
                    </div>
                ))}
                {_.map(range(4 - friends.length), n => (<div key={n} className={styles.friendItem} />))}
            </Carousel>
        )
    };

    const backCoursesCarousel = backCourses => {
        return (
            <Carousel
                arrows
                dots={false}
                slidesToShow={3}
                slidesToScroll={2}
                speed={500}
                prevArrow={<Button shape="circle" icon="left" size="large" />}
                nextArrow={<Button shape="circle" icon="right" size="large" />}
            >
                {_.map(backCourses, backCourse => (
                    <div className={styles.backCourseItem} key={backCourse._id + _.uniqueId('backCourse_')}>
                        <InProgressCourse course={backCourse} />
                    </div>
                ))}
                {_.map(range(3 - backCourses.length), n => (<div key={n} className={styles.backCourseItem} />))}
            </Carousel>
        )
    }

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

    if (!personal) {
        recommender = (
            <React.Fragment>
                <Row className={styles.title}>{formatMessage({ id: 'home.title.whatshould' })}</Row>
                <Row className={styles.topCoursesCont}>
                    <Row className={styles.subTitle}>{formatMessage({ id: 'home.subtitle.topcourses' })}</Row>
                    <Row className={styles.topCourses}>
                        <Tabs defaultActiveKey="most-popular" animated={false}>
                            <TabPane tab={formatMessage({ id: 'home.topcourses.mostpopular' })} key="most-popular">
                                {coursesCarousel(mostPopularCourses)}
                            </TabPane>
                            <TabPane tab={formatMessage({ id: 'home.topcourses.toprating' })} key="top-rating">
                                {coursesCarousel(topRatingCourses)}
                            </TabPane>
                        </Tabs>
                    </Row>
                </Row>
                {_.map(topCoursesOfCates, topCourses => (
                    <Row className={styles.topCoursesOfCateCont} key={topCourses.cateId + _.uniqueId('top_courses_of_cate_')}>
                        <Row className={styles.subTitle}>{`${formatMessage({ id: 'home.subtitle.topcoursesofcate' })} `}<span className={styles.cateName}>{`${formatMessage({ id: topCourses.cateName})}`}</span></Row>
                        <Row className={styles.topCoursesOfCate}>
                            {coursesCarousel(topCourses.courses)}
                        </Row>
                    </Row>
                ))}
                <Row className={styles.topFriendsCont}>
                    <Row className={styles.subTitle}>{`${formatMessage({ id: 'home.subtitle.topfriends' })} `}</Row>
                    <Row className={styles.topFriends}>
                        {friendsCarousel(topFriends)}
                    </Row>
                </Row>
                <Row className={styles.topTopicsCont}>
                    <Row className={styles.subTitle}>{`${formatMessage({ id: 'home.subtitle.toptopics' })} `}</Row>
                    <Row className={styles.topTopics}>
                        {_.map(topTopics, (topic, i) => (
                            <Link to="/teaching" key={topic._id + _.uniqueId("topic_")}>
                                <Tag color={tagColor(i)}>{formatMessage({ id: topic.name })}</Tag>
                            </Link>
                        ))}
                    </Row>
                </Row>
            </React.Fragment>
        )
    }
    else {

    }
    return (
        <div className={styles.homepage}>
            {/* <div className={styles.cateBar}>
                <CategoriesBar loading={loading} categories={categories} />
            </div> */}
            <Row className={styles.jumpotron}>
                <Parallax
                    bgImage={homeJumpotronImg}
                    renderLayer={() => (
                        <div>
                            <div
                                style={{
                                    background: `rgba(0, 0, 0, 0.5)`,
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute'
                                }}
                            />
                        </div>
                        
                    )}
                >
                    <div style={{ height: 400 }}>
                        <div className={styles.inlineDiv}>
                            <div className={styles.bigSlogan}>
                                {formatMessage({ id: 'home.jumpotron.bigslogan' })}
                            </div>
                            <div className={styles.smallSlogan}>
                                {formatMessage({ id: 'home.jumpotron.smallslogan' })}
                            </div>
                        </div>
                    </div>
                </Parallax>
            </Row>
            {loading ? (
                <div className={styles.loading}>
                    <Spin spinning fontSize={10} isCenter/>
                </div>
            ) : (
                <React.Fragment>
                    {isBack && (
                        <Row className={styles.back}>
                            {backLoading ? (
                                <div className={styles.backLoading}>
                                    <div className={classNames(styles.titleSkeleton, styles.skeletonBox)} />
                                    <Row className={styles.coursesSkeleton} gutter={16}>
                                        <Col span={12} className={styles.course}>
                                            <Row>
                                                <Col span={10} className={styles.avatarCol}>
                                                    <div className={classNames(styles.avatar, styles.skeletonBox)} />
                                                </Col>
                                                <Col span={14} className={styles.infoCol}>
                                                    <div className={classNames(styles.name, styles.skeletonBox)} />
                                                    <div className={classNames(styles.progress, styles.skeletonBox)} />
                                                    <div className={classNames(styles.authors, styles.skeletonBox)} />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={12} className={styles.course}>
                                            <Row>
                                                <Col span={10} className={styles.avatarCol}>
                                                    <div className={classNames(styles.avatar, styles.skeletonBox)} />
                                                </Col>
                                                <Col span={14} className={styles.infoCol}>
                                                    <div className={classNames(styles.name, styles.skeletonBox)} />
                                                    <div className={classNames(styles.progress, styles.skeletonBox)} />
                                                    <div className={classNames(styles.authors, styles.skeletonBox)} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            ) : (
                                <>
                                    <Row className={styles.title}>{`${formatMessage({ id: 'home.title.back' })}, Ngọc Hạnh`}</Row>
                                    <Row className={styles.backCoursesCont}>
                                        <Row className={styles.subTitle}>{formatMessage({ id: 'home.subtitle.back' })}</Row>
                                        <Row className={styles.backCourses}>
                                            {backCoursesCarousel(backCourses)}
                                        </Row>
                                    </Row>
                                </>
                            )}
                        </Row>
                    )}
                    <Row className={styles.recommender}>
                        {recommendLoading ? (
                            <div className={styles.recommendLoading}>
                                <div className={classNames(styles.titleSkeleton, styles.skeletonBox)} />
                                <div className={styles.coursesSkeleton}>
                                    {courseSkeletonsCarousel()}
                                </div>
                            </div>
                        ) : recommender}
                    </Row>
                </React.Fragment>
            )}
        </div>
    )
};

export default Homepage;