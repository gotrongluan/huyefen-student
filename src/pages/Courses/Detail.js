import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { Row, Col, Rate, Button, Tabs, Icon, Skeleton, Spin, List, Divider, Avatar, Collapse, Table, message } from 'antd';
import TeacherCourse from '@/components/TeacherCourse';
import ViewMore from '@/components/ViewMore';
import Sticky from 'react-sticky-el';
import { roundStarRating, numberWithCommas, minutesToHour } from '@/utils/utils';
import COURSE_INFO from '@/assets/fakers/courseInfo';
import OVERVIEW from '@/assets/fakers/overview';
import SYLLABUS from '@/assets/fakers/syllabus';
import RELATED_COURSES from '@/assets/fakers/relatedCourses';
import styles from './Detail.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const Loading = () => {
    return (
        <div className={styles.loading}>
            <div className={styles.inlineDiv}>
                <Spin indicator={<Icon type="loading" style={{ fontSize:'5em' }} spin />} />
            </div>
        </div>
    );
};

const Syllabus = ({ data: syllabus, handlePreview }) => {
    const countLecturesAll = _.map(syllabus, chapter => chapter.lectures.length);
    const totalLectures = _.sum(countLecturesAll);
    const times = _.map(syllabus, chapter => _.sumBy(chapter.lectures, 'time'));
    const totalTime = _.sum(times);
    const defaultActiveKey = _.map(syllabus, chapter => chapter._id);
    return (
        <React.Fragment>
            <Row className={styles.header}>
                <Col span={12} className={styles.title}>
                    Course content
                </Col>
                <Col span={12} className={styles.extra}>
                    <span className={styles.totalLectures}>{`${totalLectures} lectures`}</span>
                    <span className={styles.totalTime}>{`${minutesToHour(totalTime)}`}</span>
                </Col>
            </Row>
            <Row className={styles.main}>
                <Collapse
                    defaultActiveKey={defaultActiveKey}
                >
                    {_.map(syllabus, (chapter, index) => (
                        <Panel
                            header={chapter.title}
                            key={chapter._id}
                            extra={(
                                <>
                                    <span className={styles.countLectures}>{`${countLecturesAll[index]} lectures`}</span>
                                    <span className={styles.allTime}>{`${minutesToHour(times[index])}`}</span>
                                </>
                            )}
                        >
                            <List
                                className={styles.chapter}
                                itemLayout="horizontal"
                                rowKey={item => `${chapter._id}_${item._id}`}
                                dataSource={chapter.lectures}
                                renderItem={lecture => (
                                    <List.Item
                                        className={styles.lecture}
                                        extra={lecture.type === 0 ? (
                                            <span className={styles.time}>{`${minutesToHour(lecture.time)}`}</span>
                                        ) : (
                                            <>
                                                <span className={styles.preview} onClick={() => handlePreview(lecture._id)}>Preview</span>
                                                <span className={styles.time}>{`${minutesToHour(lecture.time)}`}</span>
                                            </>
                                        )}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar size={16} icon="read" style={{ background: '#fada5e', color: 'black', position: 'relative', top: '3px' }}/>}
                                            title={<span className={styles.lectureName}>{lecture.title}</span>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    ))}
                </Collapse>
            </Row>
        </React.Fragment>
    )
};

const RelatedCourses = ({ data }) => {
    if (!data.alsoBought && !data.frequent && !data.sameAuthors) {
        return (
            <div>Empty.</div>
        )
    };
    const renderAlsoBoughtCourse = course => {
        const { lastUpdated, name, numOfLectures, avatar } = course;
        return (
            <Row className={styles.course}>
                <Col span={8} className={styles.avatar}>
                    <img alt="course-ava" src={avatar} />
                    <div className={styles.numOfLectures}>{`${numOfLectures} lectures`}</div>
                </Col>
                <Col span={16} className={styles.info}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.updatedTime}>{`Updated at ${moment(lastUpdated).format('MM/YYYY')}`}</div>
                </Col>
            </Row>
        )
    };
    const renderRating = rating => {
        return (
            <div className={styles.starRating}>
                <Icon type="star" theme="filled" style={{ color: '#fada5e' }} />
                <span className={styles.value}>{rating}</span>
            </div>
        )
    };
    const renderNumOfEnrolled = num => {
        return (
            <div className={styles.numOfEnrolled}>
                <Icon type="team" />
                <span className={styles.value}>{numberWithCommas(num)}</span>
            </div>
        );
    };
    const renderPrice = price => {
        return (<span className={styles.price}>{`$${_.round(price, 2)}`}</span>);
    };
    const alsoBoughtColumns = [
        {
            title: 'Course',
            dataIndex: '',
            key: 'course',
            width: '55%',
            render: course => renderAlsoBoughtCourse(course)
        },
        {
            title: 'Ratings',
            dataIndex: 'starRating',
            key: 'ratings',
            width: '15%',
            render: rating => renderRating(rating)
        },
        {
            title: 'Num enrolled',
            dataIndex: 'numOfEnrolled',
            key: 'numOfEnrolled',
            width: '15%',
            render: num => renderNumOfEnrolled(num)
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '15%',
            render: price => renderPrice(price)
        }
    ];

    return (
        <React.Fragment>
            {data.alsoBought && !_.isEmpty(data.alsoBought) && (
                <Row className={styles.alsoBought}>
                    <div className={styles.title}>People also bought</div>
                    <div className={styles.main}>
                        <ViewMore height={400}>
                            <Table
                                columns={alsoBoughtColumns}
                                dataSource={data.alsoBought}
                                rowKey={item => item._id + _.uniqueId('also_course_')}
                                showHeader={false}
                                className={styles.table}
                                pagination={false}
                            />
                        </ViewMore>
                    </div>
                </Row>
            )}
            {data.frequent && !_.isEmpty(data.frequent) && (
                <Row className={styles.frequent}>
                    <div className={styles.title}>Frequent bought together</div>
                    <div className={styles.main}>
                        <List
                            grid={{
                                gutter: 16,
                                column: 4
                            }}
                            dataSource={data.frequent}
                            rowKey={course => (course._id || course.key) + _.uniqueId('freq_course_')}
                            renderItem={course => (
                                <List.Item>
                                    <TeacherCourse course={course} />
                                </List.Item>
                            )}
                        />
                        <div className={styles.icon}>
                            <Icon type="gift" theme="filled" />
                        </div>
                        <div className={styles.total}>
                            {`Total: $${_.round(_.sumBy(data.frequent, 'price'), 2)}`}
                        </div>
                        <div className={styles.addToCart}>
                            <Button type="primary" icon="shopping" size="large">Add all to cart</Button>
                        </div>
                    </div>
                </Row>
            )}
            {data.sameAuthors && !_.isEmpty(data.sameAuthors) && (
                <Row className={styles.sameAuthors}>
                    <div className={styles.title}>More courses by same authors</div>
                    <div className={styles.main}>
                        <List
                            grid={{
                                gutter: 16,
                                column: 4
                            }}
                            dataSource={data.sameAuthors}
                            rowKey={course => (course._id || course.key) + _.uniqueId('same_authors_course_')}
                            renderItem={course => (
                                <List.Item>
                                    <TeacherCourse course={course} />
                                </List.Item>
                            )}
                        />
                    </div>
                </Row>
            )}
        </React.Fragment>
    )
}

const DetailCourse = () => {
    const [sticky, setSticky] = useState(false);
    const [courseInfo, setCourseInfo] = useState(null);
    const [courseInfoLoading, setCourseInfoLoading] = useState(false);
    const [overview, setOverview] = useState(null);
    const [overviewLoading, setOverviewLoading] = useState(false);
    const [syllabus, setSyllabus] = useState(null);
    const [syllabusLoading, setSyllabusLoading] = useState(false);
    const [relatedCourses, setRelatedCourses] = useState(null);
    const [relatedCoursesLoading, setRelatedCoursesLoading] = useState(false);
    useEffect(() => {
        setCourseInfoLoading(true);
        setOverviewLoading(true);
        setTimeout(() => {
            setCourseInfo(COURSE_INFO);
            setCourseInfoLoading(false);
            setOverview(OVERVIEW);
            setOverviewLoading(false);
        }, 1500);
    }, []);
    const fetchSyllabus = courseId => {
        setSyllabusLoading(true);
        setTimeout(() => {
            setSyllabus(SYLLABUS);
            setSyllabusLoading(false);
        }, 1200);
    };
    const fetchRelatedCourses = courseId => {
        setRelatedCoursesLoading(true);
        setTimeout(() => {
            setRelatedCourses(RELATED_COURSES);
            setRelatedCoursesLoading(false);
        }, 1000);
    };
    const handleChangeTabs = activeKey => {
        if (activeKey === 'overview') {

        }
        else if (activeKey === 'syllabus') {
            if (!syllabus) {
                fetchSyllabus(courseInfo._id);
            }
        }
        else if (activeKey === 'relatedCourses') {
            if (!relatedCourses) {
                fetchRelatedCourses(courseInfo._id);
            }
        }
        else if (activeKey === 'reviews') {

        }
        else if (activeKey === 'instructors') {

        }
    };
    const handlePreview = lectureId => {
        message.success(`review lecture ${lectureId}`);
    };
    return (
        <div className={styles.detail}>
            <Row className={styles.jumpotron}>
                <Row className={styles.courseInfo}>
                    <div className={styles.info}>
                        {!courseInfo || courseInfoLoading ? (
                            <Skeleton active title={false} paragraph={{ rows: 4, width: ['80%', '70%', '45%', '55%'] }}/>
                        ) : (
                            <div>
                                <div className={styles.name}>{courseInfo.name}</div>
                                <div className={styles.summary}>{courseInfo.summary}</div>
                                <div className={styles.statistic}>
                                    <Rate allowHalf value={roundStarRating(courseInfo.starRating)} disabled className={styles.stars} />
                                    <span className={styles.ratingVal}>{courseInfo.starRating}</span>
                                    <span className={styles.numOfRatings}>{`(${numberWithCommas(courseInfo.numOfRatings)} ratings)`}</span>
                                    <span className={styles.numOfEnrolled}>{`${numberWithCommas(courseInfo.numOfEnrolled)} students enrolled`}</span>
                                </div>
                                <div className={styles.authors}>
                                    {`Created by ${_.join(courseInfo.authors, ', ')}`}
                                </div>
                                <div className={styles.extra}>
                                    <span className={styles.level}>
                                        <Icon type="rocket" />
                                        <span className={styles.levelVal}>{courseInfo.level}</span>
                                    </span>
                                    <span className={styles.language}>
                                        <Icon type="block" />
                                        <span className={styles.languageVal}>{courseInfo.language}</span>
                                    </span>
                                    <span className={styles.lastUpdated}>
                                        <Icon type="history" />
                                        <span className={styles.lastUpdatedVal}>{`Last updated ${moment(courseInfo.lastUpdated).format('MM/YYYY')}`}</span>
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className={styles.btns}>
                            {!courseInfo || courseInfoLoading ? (
                                <div className={styles.btnsLoading}>
                                    <Skeleton active avatar={false} title={false} paragraph={{ rows: 2, width: [150, 150] }}/>
                                </div>
                            ) : courseInfo.isRegistered ? (
                                <React.Fragment>
                                    <div className={styles.goToCourse}>
                                        <Button type="primary" icon="play-circle" size="large">Go to course</Button>
                                    </div>
                                    {courseInfo.refundable && (
                                        <div className={styles.refund}>
                                            <Button icon="rollback" size="large">Refund</Button>
                                        </div>
                                    )}
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <div className={styles.addToCart}>
                                        <Button type="primary" icon="shopping-cart" size="large">Add to cart</Button>
                                    </div>
                                    <div className={styles.buyNow}>
                                        <Button icon="audit" size="large">Buy now</Button>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    
                </Row>
            </Row>
            <Sticky
                scrollElement="#mainScrollbar"
                onFixedToggle={fixed => setSticky(!fixed)}
                disabled={!courseInfo || courseInfoLoading}
                stickyStyle={{ zIndex: 100 }}
            >
                {sticky ? (
                    <div className={styles.stickyBar}>
                        <Row className={styles.info}>
                            <div className={styles.name}>
                                {courseInfo.name}
                            </div>
                            <div className={styles.statistic}>
                                <Rate allowHalf value={roundStarRating(courseInfo.starRating)} disabled className={styles.stars} />
                                <span className={styles.ratingVal}>{courseInfo.starRating}</span>
                                <span className={styles.numOfRatings}>{`(${numberWithCommas(courseInfo.numOfRatings)} ratings)`}</span>
                                <span className={styles.numOfEnrolled}>{`${numberWithCommas(courseInfo.numOfEnrolled)} students enrolled`}</span>
                            </div>
                            <div className={styles.btns}>
                                {courseInfo.isRegistered ? (
                                    <React.Fragment>
                                        <Button className={styles.goToCourse} type="primary">
                                            Go to course
                                        </Button>
                                        {courseInfo.refundable && (
                                            <Button className={styles.refund}>
                                                Refund
                                            </Button>
                                        )}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <Button className={styles.addToCart} type="primary">
                                            Add to cart
                                        </Button>
                                        <Button className={styles.buyNow}>
                                            Buy now
                                        </Button>
                                    </React.Fragment>
                                )}
                            </div>
                        </Row>
                        
                    </div>
                ) : (
                    <div />
                )}
            </Sticky>
            <Row className={styles.content}>
                {!overview || overviewLoading ? (
                    <Loading />
                ) : (
                    <Tabs
                        defaultActiveKey="overview"
                        className={styles.tabs}
                        tabBarStyle={{
                            borderBottom: 'none',
                            textAlign: 'center'
                        }}
                        size="large"
                        onChange={handleChangeTabs}
                    >
                        <TabPane
                            tab="Overview"
                            key="overview"
                            className={classNames(styles.tabPane, styles.overview)}
                        >
                            <div className={styles.whatLearn}>
                                <div className={styles.title}>What you'll learn</div>
                                <div className={styles.content}>
                                    <List
                                        dataSource={overview.whatLearn}
                                        itemLayout="horizontal"
                                        split={false}
                                        grid={{
                                            column: 2,
                                            gutter: 24
                                        }}
                                        renderItem={item => (
                                            <List.Item key={_.uniqueId('what_learn_')} className={styles.listItem}>
                                                <List.Item.Meta
                                                    avatar={<Avatar size={28} icon="check" style={{ background: '#fada5e', color: 'black' }}/>}
                                                    title={<span className={styles.item} dangerouslySetInnerHTML={{ __html: item }}/>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                            <Divider dashed className={styles.divider} />
                            <div className={styles.requirements}>
                                <div className={styles.title}>Requirements</div>
                                <div className={styles.content}>
                                    <List
                                        dataSource={overview.requirements}
                                        itemLayout="horizontal"
                                        split={false}
                                        renderItem={item => (
                                            <List.Item key={_.uniqueId('requirement_')}>
                                                <List.Item.Meta
                                                    avatar={<Avatar size={28} icon="link" style={{ background: '#fada5e', color: 'black' }}/>}
                                                    title={<span className={styles.item} dangerouslySetInnerHTML={{ __html: item }}/>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                            <Divider dashed className={styles.divider} />
                            <div className={styles.description}>
                                <div className={styles.title}>Description</div>
                                <div className={styles.content} dangerouslySetInnerHTML={{ __html: overview.description }}/>
                            </div>
                        </TabPane>
                        <TabPane
                            tab="Syllabus"
                            key="syllabus"
                            className={classNames(styles.tabPane, styles.syllabus)}
                        >
                            {!syllabus && syllabusLoading ? (
                                <Loading />
                            ) : (
                                <Syllabus data={syllabus} handlePreview={handlePreview} />
                            )}
                        </TabPane>
                        <TabPane
                            tab="Related courses"
                            key="relatedCourses"
                            className={classNames(styles.tabPane, styles.relatedCourses)}
                        >
                            {!relatedCourses || relatedCoursesLoading ? (
                                <Loading />
                            ) : (
                                <RelatedCourses data={relatedCourses} />
                            )}
                        </TabPane>
                        <TabPane
                            tab="Reviews"
                            key="reviews"
                            className={classNames(styles.tabPane, styles.reviews)}
                        >

                        </TabPane>
                        <TabPane
                            tab="About instructors"
                            key="instructors"
                            className={classNames(styles.tabPane, styles.instructors)}
                        >

                        </TabPane>
                    </Tabs>
                )}
            </Row>
        </div>
    )
};

export default DetailCourse;