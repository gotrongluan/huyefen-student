import React from 'react';
import _ from 'lodash';
import { Row, Col, Tabs, Carousel, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import CategoriesBar from '@/components/CategoriesBar';
import Course from '@/components/CourseCarouselItem';
import CATEGORIES from '@/assets/fakers/categories';
import MOST_POPULAR from '@/assets/fakers/mostPopular';
import TOP_RATING from '@/assets/fakers/topRating';
import TOP_COURSES_OF_CATES from '@/assets/fakers/topCoursesOfCates'
import { range } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;

const Homepage = () => {
    let loading = false;
    let categories = CATEGORIES;
    let personal = false;
    let mostPopularCourses = MOST_POPULAR;
    let topRatingCourses = TOP_RATING;
    let recommender = null;
    const topCoursesOfCates = TOP_COURSES_OF_CATES;
    const coursesCarousel = (courses, chunkSize = 4) => {
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
                    <div className={styles.courseItem} key={_.uniqueId('course_')}>
                        <Course course={course} />
                    </div>
                ))}
                {_.map(range(5 - courses.length), n => (<div className={styles.courseItem} />))}
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
            </Row>
            <Row className={styles.recommender}>
                {recommender}
            </Row>
        </div>
    )
};

export default Homepage;