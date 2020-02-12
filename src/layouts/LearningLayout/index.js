import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Layout, Menu, Checkbox, Skeleton, Row, message, Spin, Icon, Button } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import ScrollLayout from '@/components/ScrollLayout';
import styles from './index.less';

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const MenuItem = Menu.Item;

const Header = ({ loading, name, authors, courseId }) => {
    return (
        <div className={styles.header}>
            <Row className={styles.info}>
                <div className={styles.name}>
                    <Skeleton loading={loading} active title={false} paragraph={{ rows: 1, width: '25%' }} className={styles.skeleton}>
                        <Link to={`/course/${courseId}`}>{name}</Link>
                    </Skeleton>
                </div>
                <div className={styles.authors}>
                    <Skeleton loading={loading} active title={false} paragraph={{ rows: 1, width: '18%' }}>
                        {`Created by ${_.join(authors, ', ')}`}
                    </Skeleton>
                </div>
                <div className={styles.btns}>
                    {!loading && (
                        <Button className={styles.backToHome} type="primary" onClick={() => router.push('/')}>
                            Back to home
                        </Button>
                    )}
                </div>
            </Row>
            
        </div>
    )
};


const LearningLayout = ({ children, match, location, dispatch, ...props }) => {
    const { courseId } = match.params;
    const {
        courseInfo,
        loading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchInfo',
            payload: courseId
        });
        return () => dispatch({ type: 'learning/resetInfo' });
    }, [courseId]);
    const handleChangeLectureStatus = (lectureId, status) => {
        message.success(`You save ${lectureId} with ${status}`);
    };
    let openKeys;
    if (courseInfo) {
        openKeys = _.map(courseInfo.syllabus, chapter => chapter._id);
    }
    return (
        <Layout className={styles.learningLayout}>
            <Header loading={!courseInfo || courseInfo.loading} name={courseInfo && courseInfo.name} authors={courseInfo && courseInfo.authors} courseId={courseInfo && courseInfo._id} />
            <ScrollLayout>
                <Sider 
                    className={styles.sider}
                    width={250}
                >
                    {!courseInfo || loading ? (
                        <div className={styles.inlineDiv}>
                            <Spin indicator={<Icon type="loading" style={{ fontSize: 44 }} spin />} />
                        </div>
                    ) : (
                        <Menu
                            mode="inline"
                            className={styles.menu}
                            defaultOpenKeys={openKeys}
                            selectedKeys={[_.replace(location.pathname, match.url, '')]}
                        >
                            <MenuItem key="/overview">
                                <Link to={`${match.url}/overview`}>Overview</Link>
                            </MenuItem>
                            <MenuItem key="/forum">
                                <Link to={`${match.url}/forum`}>Forum</Link>
                            </MenuItem>
                            <MenuItem key="/announcements">
                                <Link to={`${match.url}/announcements`}>Announcements</Link>
                            </MenuItem>
                            <MenuItem key="/review">
                                <Link to={`${match.url}/review`}>Review</Link>
                            </MenuItem>
                            {_.map(courseInfo.syllabus, chapter => (
                                <SubMenu key={chapter._id} title={chapter.title} className={styles.chapter} popupClassName={styles.subMenuPopup}>
                                    {_.map(chapter.lectures, lecture => (
                                        <MenuItem key={`/lecture/${lecture._id}`} className={styles.lecture}>
                                            <div>
                                                <Link className={styles.name} to={`${match.url}/lecture/${lecture._id}`}>{lecture.title}</Link>
                                                <Checkbox checked={lecture.isCompleted} className={styles.status} onChange={e => handleChangeLectureStatus(lecture._id, e.target.value)}/>
                                            </div>
                                            
                                                
                                                
                                            
                                        </MenuItem>
                                    ))}
                                </SubMenu>
                            ))}
                        </Menu>
                    )}
                </Sider>
                <Layout className={styles.content}>
                    <Content>
                        {children}
                    </Content>
                </Layout>
                
            </ScrollLayout>
        </Layout>
    )
};

export default connect(
    ({ learning, loading }) => ({
        courseInfo: learning.info,
        loading: !!loading.effects['learning/fetchInfo']
    })
)(LearningLayout);