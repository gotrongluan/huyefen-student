import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import classNames from 'classnames';
import router from 'umi/router';
import { Row, Col, Tabs, Button, Skeleton, Icon, Modal, Spin as Loading, List, Statistic, Divider, Card } from 'antd';
import UserAvatar from '@/components/Avatar';
import TeacherCourse from '@/components/TeacherCourse';
import styles from './index.less';

const { TabPane } = Tabs;

const Teacher = ({ match, dispatch, ...props }) => {
    const [activeKey, setActiveKey] = useState('courses');
    let {
        user,
        info,
        infoLoading,
        courses,
        hasMore,
        coursesLoading,
        coursesInitLoading
    } = props;
    const { teacherId } = match.params;
    useEffect(() => {
        setActiveKey('courses');
        dispatch({
            type: 'teacher/fetch',
            payload: teacherId
        });
        dispatch({
            type: 'teacher/fetchCourses',
            payload: teacherId
        });
        return () => {
            dispatch({
                type: 'teacher/reset'
            });
            Modal.destroyAll();
        }
    }, [teacherId]);

    let icon;
    let relText;
    if (info) icon = info.isFollowed ? 'user-delete' : 'user-add';
    if (info) relText = info.isFollowed ? 'Unfollow' : 'Follow';
    const handleFollow = (status, teacherId) => {
        if (status) {
            //followed --> click --> unfollowed
            const modal = Modal.confirm({
                content: 'Do you want to unfollow teacher?',
                onOk: () => {
                    dispatch({
                        type: 'teacher/unfollow',
                        payload: teacherId
                    });
                    modal.destroy();
                }
            })
        }
        else {
            dispatch({
                type: 'teacher/follow'
            });
        }
    };
    const handleMoreCourses = () => {
        dispatch({
            type: 'teacher/moreCourses',
            payload: teacherId
        });
    };
    const handleAllCourses = () => {
        dispatch({
            type: 'teacher/allCourses',
            payload: teacherId
        });
    };
    const loadMore = (
        !coursesInitLoading && !coursesLoading && courses && hasMore ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreCourses}>More courses</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }} onClick={handleAllCourses}>All courses</Button>
            </div>
        ) : null
    );
    if (coursesLoading && courses) courses = _.concat(courses, [
        { key: _.uniqueId('teacher_course_loading_'), loading: true },
        { key: _.uniqueId('teacher_course_loading_'), loading: true },
        { key: _.uniqueId('teacher_course_loading_'), loading: true },
        { key: _.uniqueId('teacher_course_loading_'), loading: true }
    ]);
    return (
        <Row className={styles.teacher}>
            <Row className={styles.jumpotron}>
                <div className={styles.info}>
                    <div className={styles.avatarContainer}>
                        {!info || infoLoading ? <Skeleton active avatar={{ size: 126, shape: 'circle' }} paragraph={false} title={false} /> : (
                            <UserAvatar
                                src={info.avatar}
                                size={120}
                                textSize={126}
                                borderWidth={6}
                                text={info.name}
                                style={{ background: 'black', color: '#fada5e', fontSize: '52px' }}
                            />
                        )}
                    </div>
                    <div className={styles.name}>
                        {!infoLoading && info && info.name}
                    </div>
                    <div className={styles.actions}>
                        {!info || infoLoading ? (
                            <Loading indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
                        ) : (
                            user ? (
                                    <Button type="primary" icon={icon} shape="round" onClick={() => handleFollow(info.isFollowed, info._id)}>
                                    {relText}
                                </Button>
                            ) : null
                        )}
                    </div>
                </div>
            </Row>
            <Row className={styles.content}>
                <Tabs
                    activeKey={activeKey}
                    className={styles.tabs}
                    tabBarStyle={{
                        height: 40,
                        textAlign: 'center',
                        borderBottom: 'none'
                    }}
                    onChange={activeKey => setActiveKey(activeKey)}
                >
                    <TabPane
                        tab={`Courses`}
                        key='courses'
                        className={classNames(styles.tabPane, styles.courses)}  
                    >
                        <Row className={styles.courseContent}>
                            {!courses || coursesInitLoading ? (
                                <div className={styles.loading}>
                                    <Loading indicator={<Icon type="loading" style={{ fontSize: 64 }} spin />}/>
                                </div>
                            ) : (
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
                            )}
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={'Biography'}
                        key='biography'
                        className={classNames(styles.tabPane, styles.biography)} 
                    >
                        {!info || infoLoading ? (
                            <div className={styles.loading}>
                                <Loading indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />} />
                            </div>
                        ) : (
                            <div className={styles.bioContent}>
                                <div className={styles.bio} dangerouslySetInnerHTML={{ __html: info.biography }}/>
                                <Row className={styles.statistic} gutter={16}>
                                    <Col span={4}>
                                        <Card>
                                            <Statistic
                                                title="Students"
                                                value={info.numOfStudents}
                                                valueStyle={{ color: 'tomato', fontSize: '1.1em' }}
                                                prefix={<Icon type="team" />}
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card>
                                            <Statistic
                                                title="Courses"
                                                value={info.numOfCourses}
                                                valueStyle={{ color: 'orange', fontSize: '1.1em' }}
                                                prefix={<Icon type="read" />}
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={4}>
                                        <Card>
                                            <Statistic
                                                title="Reviews"
                                                value={info.numOfReviews}
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
                                        {info.twitter && (<a href={info.twitter}><Button shape="circle" icon="twitter" size="large" /></a>)}
                                        {info.facebook && (<a href={info.facebook}><Button shape="circle" icon="facebook" size="large" /></a>)}
                                        {info.youtube && (<a href={info.youtube}><Button shape="circle" icon="youtube" size="large"/></a>)}
                                        {info.instagram && (<a href={info.instagram}><Button shape="circle" icon="instagram" size="large"/></a>)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabPane>
                </Tabs>
            </Row>
        </Row>
    )
};

export default connect(
    ({ user, teacher, loading }) => ({
        user: user,
        info: teacher.info,
        infoLoading: !!loading.effects['teacher/fetch'],
        courses: teacher.courses.list,
        hasMore: teacher.courses.hasMore,
        coursesInitLoading: !!loading.effects['teacher/fetchCourses'],
        coursesLoading: !!loading.effects['teacher/moreCourses'] || !!loading.effects['teacher/allCourses']
    })
)(Teacher);