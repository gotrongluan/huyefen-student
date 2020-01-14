import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Tabs, Avatar, Skeleton, Button, Row, Col, Icon, Spin as Loading, List, Statistic, Divider, Card } from 'antd';
import TeacherCourse from '@/components/TeacherCourse';
import COURSES from '@/assets/fakers/mostPopular';
import Spin from '@/elements/spin/secondary';

import styles from './index.less';

const { TabPane } = Tabs;

const Teacher = () => {
    const [loading, setLoading] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    let [courses, setCourses] = useState(undefined);
    const [initLoading, setInitLoading] = useState(false);
    useEffect(() => {
        setInitLoading(true);
        setInfoLoading(true);
        setTimeout(() => {
            setInfoLoading(false);
        }, 2000);
        setTimeout(() => {
            setCourses(COURSES);
            setInitLoading(false);
        }, 2500);
    }, []);
    const teacher = {
        name: 'Ngọc Hạnh Vương',
        avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/51059227_2091470127614437_5419405170205261824_o.jpg?_nc_cat=106&_nc_ohc=LnSzD5KUUN4AX8EolVa&_nc_ht=scontent.fdad1-1.fna&oh=95b1eba87a97f6266a625c07caf68566&oe=5EAE6D56',
        isFollowed: true,
        numOfCourses: 31,
        numOfStudents: 468544,
        numOfReviews: 19203,
        biography: `
        <p></p><p>Andrei is the instructor of the <strong>highest rated&nbsp;Web Development course on Udemy as well as&nbsp;one of the fastest&nbsp;growing.&nbsp;</strong>His graduates have&nbsp;moved&nbsp;on to work for&nbsp;some of the biggest tech&nbsp;companies around the world like Apple, Google, Amazon, JP Morgan, IBM, UNIQLO etc...&nbsp;He&nbsp;has&nbsp;been working as a senior software developer in&nbsp;Silicon Valley and Toronto for many years,&nbsp;and&nbsp;is now taking all that he has learned,&nbsp;to teach&nbsp;programming skills and&nbsp;to help you&nbsp;discover the amazing career opportunities that being a developer allows in&nbsp;life.&nbsp;</p><p>Having been&nbsp;a self taught programmer,&nbsp;he understands that there is an&nbsp;overwhelming number of online courses, tutorials and books&nbsp;that are overly verbose and inadequate at teaching proper skills.&nbsp;Most people feel paralyzed and don't know where to start when learning a complex subject matter, or even worse, most people don't have $20,000 to spend on a coding bootcamp.&nbsp;<strong>Programming skills should be affordable and open to all. An education material&nbsp;should teach real life skills that are current and&nbsp;they should not waste a student's valuable time.</strong>&nbsp;
        Having learned important&nbsp;lessons from working for Fortune 500 companies, tech startups, to even&nbsp;founding his own business, he is now dedicating 100% of his time to&nbsp;teaching others valuable&nbsp;software development skills&nbsp;in order to take control of their life and work in an exciting industry with infinite possibilities.&nbsp;</p><p>Andrei promises you that there are no other courses out there as comprehensive and as well explained.&nbsp;<strong>He believes that in order to learn anything of value, you need to start with the foundation and develop the roots of the tree. Only from there will you be able to learn concepts and specific skills(leaves) that connect to the foundation. Learning becomes exponential when structured in this way.</strong>&nbsp;</p><p>Taking his experience in educational psychology and coding, Andrei's courses will take you on an understanding of complex subjects that you never thought would be possible.&nbsp;&nbsp;
        </p><p><strong>See you inside the courses!</strong></p><p><br></p><p></p>`,
        twitter: 'https://twitter.com/',
        facebook: 'https://fb.com/ngochanhvuong',
        youtube: 'https://youtube.com/',
        instagram: 'https://instagram.com/'
    };
    const icon = teacher.isFollowed ? 'user-delete' : 'user-add';
    const relText = teacher.isFollowed ? 'Unfollow' : 'Follow';
    const handleMoreCourses = () => {
        setLoading(true);
        setTimeout(() => {
            setCourses([...courses, ...COURSES]);
            setLoading(false);
        }, 2000);
    };
    const loadMore = (
        !initLoading && !loading && courses ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreCourses}>More courses</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }}>All courses</Button>
            </div>
        ) : null
    );
    if (loading && courses) courses = _.concat(courses, [
        { key: _.uniqueId('friend_course_loading_'), loading: true },
        { key: _.uniqueId('friend_course_loading_'), loading: true },
        { key: _.uniqueId('friend_course_loading_'), loading: true },
        { key: _.uniqueId('friend_course_loading_'), loading: true }
    ]);
    return (
        <Row className={styles.teacher}>
            <Row className={styles.jumpotron}>
                <div className={styles.info}>
                    <div className={styles.avatarCont}>
                        {infoLoading ? <Skeleton active avatar={{ size: 126, shape: 'circle' }} paragraph={false} title={false} /> : (<Avatar size={120} shape="circle" className={styles.avatar} src={teacher.avatar} />)}
                    </div>
                    <div className={styles.name}>
                        {!infoLoading && teacher.name}
                    </div>
                    <div className={styles.actions}>
                        {infoLoading ? (
                            <Loading indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
                        ) : (
                            <Button type="primary" icon={icon} shape="round">
                                {relText}
                            </Button>
                        )}
                    </div>
                </div>
            </Row>
            <Row className={styles.content}>
                <Tabs
                    defaultActiveKey="courses"
                    className={styles.tabs}
                    tabBarStyle={{
                        height: 40,
                        textAlign: 'center',
                        borderBottom: 'none'
                    }}
                >
                    <TabPane
                        tab={`Courses`}
                        key='courses'
                        className={classNames(styles.tabPane, styles.courses)}  
                    >
                        <Row className={styles.courseContent}>
                            <Spin spinning={!courses || initLoading} fontSize={8} isCenter>
                                <List
                                    grid={{
                                        gutter: 16,
                                        column: 4
                                    }}
                                    loadMore={loadMore}
                                    dataSource={courses}
                                    rowKey={course => (course._id || course.key) + _.uniqueId('teacher_course_')}
                                    renderItem={course => (
                                        <List.Item>
                                            {!course.loading ? (<TeacherCourse course={course} />) : (
                                                <div className={styles.courseSkeleton}>
                                                    <div className={classNames(styles.avatar, styles.skeletonBox)} />
                                                    <div className={styles.info}>
                                                        <div className={classNames(styles.name, styles.skeletonBox)} />
                                                        <div className={classNames(styles.authors, styles.skeletonBox)} />
                                                        <div className={classNames(styles.price, styles.skeletonBox)} />
                                                    </div>
                                                </div> 
                                            )}
                                        </List.Item>
                                    )}
                                />
                            </Spin>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={'Biography'}
                        key='biography'
                        className={classNames(styles.tabPane, styles.biography)} 
                    >
                        <div className={styles.bioContent}>
                            <div className={styles.bio} dangerouslySetInnerHTML={{ __html: teacher.biography }}/>
                            <Row className={styles.statistic} gutter={16}>
                                <Col span={4}>
                                    <Card>
                                        <Statistic
                                            title="Students"
                                            value={teacher.numOfStudents}
                                            valueStyle={{ color: 'tomato', fontSize: '1.1em' }}
                                            prefix={<Icon type="team" />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card>
                                        <Statistic
                                            title="Courses"
                                            value={teacher.numOfCourses}
                                            valueStyle={{ color: 'orange', fontSize: '1.1em' }}
                                            prefix={<Icon type="read" />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card>
                                        <Statistic
                                            title="Reviews"
                                            value={teacher.numOfReviews}
                                            valueStyle={{ color: 'yellow', fontSize: '1.1em' }}
                                            prefix={<Icon type="block" />}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <Divider dashed className={styles.divider} />
                            <div className={styles.social}>
                                <div className={styles.title}>
                                    Contact
                                </div>
                                <div className={styles.links}>
                                    {teacher.twitter && (<a href={teacher.twitter}><Button shape="circle" icon="twitter" size="large" /></a>)}
                                    {teacher.facebook && (<a href={teacher.facebook}><Button shape="circle" icon="facebook" size="large" /></a>)}
                                    {teacher.youtube && (<a href={teacher.youtube}><Button shape="circle" icon="youtube" size="large"/></a>)}
                                    {teacher.instagram && (<a href={teacher.instagram}><Button shape="circle" icon="instagram" size="large"/></a>)}
                                </div>
                            </div>
                        </div>
                        
                    </TabPane>
                </Tabs>
            </Row>
        </Row>
    )
};

export default Teacher;