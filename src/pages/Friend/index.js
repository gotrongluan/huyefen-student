import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import router from 'umi/router';
import classNames from 'classnames';
import { Row, Avatar, Button, Tabs, Skeleton, List, Spin as Loading, Icon } from 'antd';
import FriendCourse from '@/components/FriendCourse';
import Spin from '@/elements/spin/secondary';
import COURSES from '@/assets/fakers/friendCourses';
import FRIENDS from '@/assets/fakers/friends';
import styles from './index.less';

const { TabPane } = Tabs;
const FRIEND = {
    _id: 1,
    name: 'Ngọc Hạnh Vương',
    avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/51059227_2091470127614437_5419405170205261824_o.jpg?_nc_cat=106&_nc_ohc=LnSzD5KUUN4AX8EolVa&_nc_ht=scontent.fdad1-1.fna&oh=95b1eba87a97f6266a625c07caf68566&oe=5EAE6D56',
    status: 3
};
const Friend= ({ match }) => {
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [friendsInitLoading, setFriendsInitLoading] = useState(false);
    const [coursesInitLoading, setCoursesInitLoading] = useState(false);
    const [friend, setFriend] = useState(null);
    let [courses, setCourses] = useState(null);
    let [friends, setFriends] = useState(null);
    const [infoLoading, setInfoLoading] = useState(true);
    useEffect(() => {
        setInfoLoading(true);
        setTimeout(() => {
            setFriend(FRIEND);
            setInfoLoading(false);
        }, 1200);
    }, [match.params.friendId]);
    useEffect(() => {
        setFriendsInitLoading(true);
        setTimeout(() => {
            setCourses(COURSES);
            setFriendsInitLoading(false);
        }, 1600);
    }, [match.params.friendId]);
    useEffect(() => {
        setCoursesInitLoading(true);
        setTimeout(() => {
            setFriends(FRIENDS);
            setCoursesInitLoading(false);
        }, 1400);
    }, [match.params.friendId]);
    let icon;
    let relText;
    if (friend) {
        switch (friend.status) {
            case 1:             //no friend
                icon = "user-add";
                relText = "Add friend";
                break;
            case 2:
                icon = "clock-circle";
                relText = "Sented invitation"
                break;
            case 3:
                icon = "user-delete";
                relText = "Cancel friend";
                break;
            default:
                icon = "user";
        };
    }
    const handleMoreCourses = () => {
        setCoursesLoading(true);
        setTimeout(() => {
            setCourses([...courses, ...COURSES]);
            setCoursesLoading(false);
        }, 2000);
    };
    const loadMore = (
        !coursesInitLoading && !coursesLoading && courses ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreCourses}>More courses</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }}>All courses</Button>
            </div>
        ) : null
    );
    const handleMoreFriends = () => {
        setFriendsLoading(true);
        setTimeout(() => {
            setFriends([...friends, ...FRIENDS]);
            setFriendsLoading(false);
        }, 1500);
    };
    const loadMoreFriends = (
        !friendsLoading && !friendsInitLoading && friends ? (
            <div className={styles.loadMoreFriends}>
                <Button size="small" type="default" onClick={handleMoreFriends}>More friends</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }}>All friends</Button>
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
                        {infoLoading ? <Skeleton active avatar={{ size: 126, shape: 'circle' }} paragraph={false} title={false} /> : (<Avatar alt="friend-avatar" size={120} shape="circle" className={styles.avatar} src={friend.avatar} />)}
                    </div>
                    <div className={styles.name}>
                        {!infoLoading && friend.name}
                    </div>
                    <div className={styles.actions}>
                        {infoLoading ? (
                            <Loading indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
                        ) : (
                            <Button.Group>
                                <Button type="primary" icon={icon} shape="round">
                                    {relText}
                                </Button>
                                <Button type="primary" icon="message" shape="round">
                                    Chat
                                </Button>
                            </Button.Group>
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
                            <Spin spinning={!courses || coursesInitLoading} fontSize={8} isCenter>
                                <List
                                    grid={{
                                        gutter: 16,
                                        column: 4
                                    }}
                                    loadMore={loadMore}
                                    dataSource={!courses ? [] : courses}
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
                            </Spin>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={'Friends'}
                        key='friends'
                        className={classNames(styles.tabPane, styles.friends)} 
                    >
                        <Row className={styles.friendsContent}>
                            <Spin spinning={!friends || friendsInitLoading} fontSize={8} isCenter>
                                <List
                                    dataSource={!friends ? [] : friends}
                                    rowKey={item => (item._id || item.key) + _.uniqueId('friend_')}
                                    loadMore={loadMoreFriends}
                                    itemLayout="horizontal"
                                    renderItem={item => (
                                        <div className={!item.loading ? styles.friendItem : styles.loadingItem} onClick={!item.loading ? () => router.push(`/friend/${item._id}` ) : () => {}}>
                                            <List.Item
                                                style={{ paddingLeft: 12, paddingRight: 12 }}
                                                extra={<span className={styles.extra}>{item.status === 2 ? 'Sented invitation' : item.status === 3 ? 'Friend' : ''}</span>}
                                            >
                                                <Skeleton active title={false} avatar loading={item.loading}
                                                    paragraph={{
                                                        rows: 2,
                                                        width: ['60%', '40%']
                                                    }}
                                                >
                                                    <List.Item.Meta
                                                        avatar={<Avatar src={item.avatar} size={42} />}
                                                        title={<span>{item.name}</span>}
                                                        description={<span style={{ fontSize: 13, color: 'gray'}}>
                                                            {item.numOfMutualFriends > 0 ? `${item.numOfMutualFriends} mutual friends` : `${item.numOfFriends} friends`}
                                                        </span>}
                                                    />
                                                </Skeleton>
                                            </List.Item>
                                            
                                        </div>
                                    )}
                                />
                            </Spin>
                        </Row>
                        
                    </TabPane>
                </Tabs>
            </Row>
        </Row>
    )
};

export default Friend;