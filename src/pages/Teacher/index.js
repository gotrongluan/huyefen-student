import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Tabs, Avatar, Skeleton, Button, Row, Icon, Spin as Loading, List } from 'antd';
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
        isFollowed: true
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
                        
                        
                    </TabPane>
                </Tabs>
            </Row>
        </Row>
    )
};

export default Teacher;