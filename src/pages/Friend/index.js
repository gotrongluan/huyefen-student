import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import { Row, Card, Avatar, Button, Tabs, Skeleton, List, Spin as Loading, Icon, Modal } from 'antd';
import FriendItem from '@/components/Friend';
import FriendCourse from '@/components/FriendCourse';
import styles from './index.less';

const { TabPane } = Tabs;
const Friend= ({ match, dispatch, ...props }) => {
    const [activeKey, setActiveKey] = useState('courses');
    let {
        user,
        info,
        friends,
        courses,
        hasMoreCourses,
        hasMoreFriends,
        infoLoading,
        friendsInitLoading,
        coursesInitLoading,
        friendsLoading,
        coursesLoading,
        chatLoading
    } = props;
    const { friendId } = match.params;
    useEffect(() => {
        setActiveKey('courses');
        dispatch({
            type: 'friend/fetch',
            payload: friendId
        });
        dispatch({
            type: 'friend/fetchFriends',
            payload: friendId
        });
        dispatch({
            type: 'friend/fetchCourses',
            payload: friendId
        });
        return () => {
            dispatch({
                type: 'friend/reset'
            });
            Modal.destroyAll();
        };
    }, [friendId]);

    let icon;
    let relText;
    if (info) {
        switch (info.status) {
            case 1:             //no friend
                icon = "user-add";
                relText = "Add friend";
                break;
            case 2:
                icon = "clock-circle";
                relText = "Sented invitation"
                break;
            case 3:
                icon = "sync";
                relText = "Invited you";
                break;
            case 4:
                icon = "user-delete";
                relText = "Cancel friend";
                break;
            default:
                icon = "user";
        };
    }
    const handleRelation = (status, friendId) => {
        let modal;
        if (status === 1) {
            //no friend
            dispatch({
                type: 'friend/addFriend',
                payload: friendId
            });
        }
        else if (status === 2) {
            //pending
            modal = Modal.confirm({
                content: 'Do you want to cancel the inviation?',
                onOk: () => {
                    dispatch({
                        type: 'friend/cancelInvitation',
                        payload: friendId
                    });
                    modal.destroy();
                }
            });
        }
        else if (status === 3) {
            //he send to you invitation
            modal = Modal.confirm({
                maskClosable: true,
                content: 'Do you accept this invitation?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => {
                    dispatch({
                        type: 'friend/acceptInvitation',
                        payload: friendId
                    });
                    modal.destroy();
                },
                onCancel: () => {
                    dispatch({
                        type: 'friend/rejectInvitation',
                        payload: friendId
                    });
                    modal.destroy();
                }
            })
        }
        else {
            //status === 4 --> friend
            modal = Modal.confirm({
                content: 'Do you want to unfriend?',
                onOk: () => {
                    dispatch({
                        type: 'friend/unfriend',
                        payload: friendId
                    });
                    modal.destroy();
                }
            });
        }
    };
    const handleChat = (friendId, name, avatar)  => {
        dispatch({
            type: 'friend/chat',
            payload: {
                friendId,
                onYes: converId => router.push(`/messenger/${converId}`),
                onNo: () => {
                    dispatch({
                        type: 'messenger/saveFirstConversation',
                        payload: {
                            _id: 'new_conver',
                            avatar,
                            name,
                            lastMessage: 'Typing message...'
                        }
                    });
                    router.push('/messenger');
                }
            }
        })
    };
    const handleMoreCourses = () => {
        dispatch({
            type: 'friend/moreCourses',
            payload: friendId
        });
    };
    const handleAllCourses = () => {
        dispatch({
            type: 'friend/allCourses',
            payload: friendId
        });
    };
    const loadMoreCourses = (
        !coursesInitLoading && !coursesLoading && courses && hasMoreCourses ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreCourses}>More courses</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }} onClick={handleAllCourses}>All courses</Button>
            </div>
        ) : null
    );
    const handleMoreFriends = () => {
        dispatch({
            type: 'friend/moreFriends',
            payload: friendId
        });
    };
    const handleAllFriends = () => {
        dispatch({
            type: 'friend/allFriends',
            payload: friendId
        });
    };
    const loadMoreFriends = (
        !friendsLoading && !friendsInitLoading && friends && hasMoreFriends ? (
            <div className={styles.loadMoreFriends}>
                <Button size="small" type="default" onClick={handleMoreFriends}>More friends</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }} onClick={handleAllFriends}>All friends</Button>
            </div>
        ) : null
    );
    if (coursesLoading && courses) courses = _.concat(courses, [
        { key: _.uniqueId('friend_course_loading_'), loading: true },
        { key: _.uniqueId('friend_course_loading_'), loading: true },
        { key: _.uniqueId('friend_course_loading_'), loading: true },
        { key: _.uniqueId('friend_course_loading_'), loading: true }
    ]);
    if (friendsLoading && friends) friends = _.concat(friends, [{
        key: _.uniqueId('friend_loading_'),
        loading: true
    }, {
        key: _.uniqueId('friend_loading_'),
        loading: true
    }, {
        key: _.uniqueId('friend_loading_'),
        loading: true
    }]);

    return (
        <Row className={styles.friend}>
            <Row className={styles.jumpotron}>
                <div className={styles.info}>
                    <div className={styles.avatarCont}>
                        {!info || infoLoading ? <Skeleton active avatar={{ size: 126, shape: 'circle' }} paragraph={false} title={false} /> : (<Avatar alt="friend-avatar" size={120} shape="circle" className={styles.avatar} src={info.avatar} />)}
                    </div>
                    <div className={styles.name}>
                        {info && !infoLoading && info.name}
                    </div>
                    <div className={styles.actions}>
                        {!info || infoLoading ? (
                            <Loading indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
                        ) : (
                            user ? (
                                <Button.Group>
                                    <Button type="primary" icon={icon} shape="round" onClick={() => handleRelation(info.status, info._id)}>
                                        {relText}
                                    </Button>
                                    <Button type="primary" icon={chatLoading ? "loading" : "message"} shape="round" onClick={() => handleChat(info._id, info.name, info.avatar)}>
                                        Chat
                                    </Button>
                                </Button.Group>
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
                                    <Loading indicator={<Icon type="loading" style={{ fontSize: 64 }} spin/>} />
                                </div>
                            ) : (
                                <List
                                    grid={{
                                        gutter: 16,
                                        column: 4
                                    }}
                                    loadMore={loadMoreCourses}
                                    dataSource={courses}
                                    rowKey={course => (course._id || course.key) + _.uniqueId('friend_course_')}
                                    renderItem={course => (
                                        <List.Item>
                                            {!course.loading ? (<FriendCourse course={course} />) : (
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
                        tab={'Friends'}
                        key='friends'
                        className={classNames(styles.tabPane, styles.friends)} 
                    >
                        <Row className={styles.friendsContent}>
                            {!friends || friendsInitLoading ? (
                                <div className={styles.loading}>
                                    <Loading indicator={<Icon type="loading" style={{ fontSize: 64 }} spin/>} /> 
                                </div>
                            ) : (
                                <List
                                    dataSource={friends}
                                    rowKey={item => (item._id || item.key) + _.uniqueId('friend_')}
                                    loadMore={loadMoreFriends}
                                    grid={{
                                        column: 3,
                                        gutter: 16
                                    }}
                                    renderItem={item => (
                                        <div className={!item.loading ? styles.friendItem : styles.loadingItem} onClick={!item.loading ? () => router.push(`/friend/${item._id}` ) : () => {}}>
                                            <List.Item
                                                style={{ paddingLeft: 12, paddingRight: 12 }}
                                            >
                                                {item.loading ? (
                                                    <Card
                                                        style={{ width: '100%', borderRadius: '6px' }}
                                                    >
                                                        <Skeleton active title={false} avatar loading={item.loading} className={styles.skeletonCard}
                                                            paragraph={{
                                                                rows: 2,
                                                                width: ['60%', '80%']
                                                            }}
                                                        />
                                                    </Card>
                                                ) : (
                                                    <FriendItem friend={item} isExtra />
                                                )}
                                            </List.Item>
                                            
                                        </div>
                                    )}
                                />
                            )}
                        </Row>
                        
                    </TabPane>
                </Tabs>
            </Row>
        </Row>
    )
};

export default connect(
    ({ user, friend, loading }) => ({
        user: user,
        info: friend.info,
        courses: friend.courses.list,
        friends: friend.friends.list,
        hasMoreCourses: friend.courses.hasMore,
        hasMoreFriends: friend.friends.hasMore,
        infoLoading: !!loading.effects['friend/fetch'],
        coursesInitLoading: !!loading.effects['friend/fetchCourses'],
        friendsInitLoading: !!loading.effects['friend/fetchFriends'],
        coursesLoading: !!loading.effects['friend/moreCourses'] || !!loading.effects['friend/allCourses'],
        friendsLoading: !!loading.effects['friend/moreFriends'] || !!loading.effects['friend/allFriends'],
        chatLoading: !!loading.effects['friend/chat']
    })
)(Friend);