import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { Row, Col, Rate, Button, Tabs, Icon, Skeleton, Spin, List, Divider, Avatar } from 'antd';
import Sticky from 'react-sticky-el';
import { roundStarRating, numberWithCommas } from '@/utils/utils';
import COURSE_INFO from '@/assets/fakers/courseInfo';
import OVERVIEW from '@/assets/fakers/overview';
import styles from './Detail.less';

const { TabPane } = Tabs;

const Loading = () => {
    return (
        <div className={styles.loading}>
            <div className={styles.inlineDiv}>
                <Spin indicator={<Icon type="loading" style={{ fontSize:'5em' }} spin />} />
            </div>
        </div>
    );
};

const DetailCourse = () => {
    const [sticky, setSticky] = useState(false);
    const [courseInfo, setCourseInfo] = useState(null);
    const [courseInfoLoading, setCourseInfoLoading] = useState(false);
    const [overview, setOverview] = useState(null);
    const [overviewLoading, setOverviewLoading] = useState(false);
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

                        </TabPane>
                        <TabPane
                            tab="Related courses"
                            key="relatedCourses"
                            className={classNames(styles.tabPane, styles.relatedCourses)}
                        >

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