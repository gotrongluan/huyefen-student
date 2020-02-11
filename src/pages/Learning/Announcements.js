import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Skeleton, Avatar, Row, Col, Input, List, Button, Divider, Icon, message } from 'antd';
import TimeAgo from 'react-timeago';
import ViewMore from '@/components/ViewMore';
import { avatarSrc } from '@/config/constants';
import styles from './Announcements.less';

const LoadingAnnouncement = () => {
    return (
        <div className={styles.loadingAnnouncement}>
            <Skeleton active title={null} paragraph={{ rows: 2, width: ['98%', '62%'] }} avatar={{ size: 60, shape: 'circle' }} />
        </div>
    )
};

const CommentInput = ({ onPressEnter }) => {
    const [value, setValue] = useState('');
    const handlePressEnter = e => {
        if (!e.shiftKey) {
            e.preventDefault();
            onPressEnter(value);
            setValue('');
        }
    };
    return (
        <Input.TextArea
            className={styles.textArea}
            value={value}
            onChange={e => setValue(e.target.value)}
            onPressEnter={handlePressEnter}
            placeholder="Enter comment..."
            autoSize={{
                minRows: 2,
                maxRows: 5
            }}
        />
    )
};

const Announcements = ({ match, dispatch, ...props }) => {
    const {
        announcements,
        loading,
        initLoading,
        hasMore
    } = props;
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchAnnouncements',
            payload: courseId
        });
    }, [courseId]);
    const handleMoreAnnouncements = () => {
        dispatch({
            type: 'learning/moreAnnouncements',
            payload: courseId
        });
    };
    const handleMoreComments = announcementId => {
        dispatch({
            type: 'learning/moreComments',
            payload: announcementId
        });
        // setAnnouncements({
        //     ...announcements,
        //     list: {
        //         ...announcements.list,
        //         [announcementId]: {
        //             ...announcements.list[announcementId],
        //             commentsLoading: true
        //         }
        //     }
        // });

        // setTimeout(() => {
        //     setAnnouncements({
        //         ...announcements,
        //         list: {
        //             ...announcements.list,
        //             [announcementId]: {
        //                 ...announcements.list[announcementId],
        //                 comments: [
        //                     ...announcements.list[announcementId]['comments'],
        //                     ...COMMENTS
        //                 ],
        //                 commentsLoading: false
        //             }
        //         }
        //     });
        // }, 1200);
    };
    const handleComment = (annoucementId, comment) => {
        if (comment !== '') {
            message.success(comment);
        }
    };
    const loadMore = (
        (!initLoading && !loading && announcements && hasMore) ? (
            <div className={styles.loadMore}>
                <Button size="small" onClick={handleMoreAnnouncements}>More announcements</Button>
            </div>
        ) : null
    );

    let announcementData = announcements ? _.orderBy(announcements, ['createdAt'], ['desc']) : null;
    if (loading && announcementData) {
        announcementData = _.concat(announcementData, [
            {
                _id: _.uniqueId('announcement_loading_'),
                loading: true
            }
        ]);
    }
    return (
        <div className={styles.announcements}>
            {!announcements || initLoading ? (
                <React.Fragment>
                    <LoadingAnnouncement />
                    <div style={{ height: 60 }}/>
                    <LoadingAnnouncement />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <List
                        className={styles.list}
                        itemLayout="horizontal"
                        dataSource={announcementData}
                        rowKey={announcement => announcement._id + _.uniqueId('announcement_')}
                        split={false}
                        renderItem={announcement => (
                            <React.Fragment>
                                {announcement.loading ? (
                                    <div>
                                        <div style={{ height: 60 }}/>
                                        <LoadingAnnouncement />
                                    </div>
                                ) : (
                                    <div className={styles.announcement}>
                                        <div className={styles.announce}>
                                            <div className={styles.user}>
                                                <div className={styles.avatarCont}>
                                                    <Avatar alt="ins-ava" size={60} className={styles.avatar} shape="circle" src={announcement.user.avatar} />
                                                </div>
                                                <div className={styles.txt}>
                                                    <div className={styles.name}>{announcement.user.name}</div>
                                                    <div className={styles.time}><TimeAgo date={announcement.createdAt} /></div>
                                                </div>
                                            </div>
                                            <Row className={styles.content}>
                                                <div dangerouslySetInnerHTML={{ __html: announcement.content }}/>
                                            </Row>
                                        </div>
                                        <Divider dashed className={styles.divider} />
                                        <div className={styles.comments}>
                                            {!_.isEmpty(announcement.comments) && (
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={announcement.comments}
                                                    rowKey={comment => comment._id + _.uniqueId('comment_')}
                                                    split={false}
                                                    renderItem={comment => (
                                                        <Row className={styles.comment}>
                                                            <Col span={2} className={styles.avatarCont}>
                                                                <Avatar shape="circle" className={styles.avatar} src={comment.user.avatar} alt="user-avar" size={48}/>
                                                            </Col>
                                                            <Col span={22} className={styles.right}>
                                                                <div className={styles.nameAndTime}>
                                                                    <span className={styles.name}>
                                                                        <span>{comment.user.name}</span>
                                                                        {comment.user.isInstructor && (
                                                                            <span style={{ marginLeft: 10 }}>{'(Instructor)'}</span>
                                                                        )}
                                                                    </span>
                                                                    <span className={styles.time}><TimeAgo date={comment.createdAt} /></span>
                                                                </div>
                                                                <ViewMore height={200}>
                                                                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: comment.content }} />
                                                                </ViewMore>
                                                            </Col>
                                                        </Row>
                                                    )}
                                                />
                                            )}
                                        </div>
                                        {announcement.moreComments && (
                                            <div className={styles.moreComments}>
                                                <span
                                                    className={styles.txt}
                                                    onClick={() => handleMoreComments(announcement._id)}
                                                >
                                                    <Icon type="plus" style={{ fontSize: '0.8em' }} /> More comments
                                                </span>
                                                {announcement.commentsLoading && (
                                                    <span className={styles.iconLoading}>
                                                        <Icon type="loading-3-quarters" style={{ fontSize: '0.8em' }} spin/>
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <Row className={styles.yourComment}>
                                            <Col span={2} className={styles.avatarCont}>
                                                <Avatar shape="circle" className={styles.avatar} src={avatarSrc} alt="your-avar" size={48}/>
                                            </Col>
                                            <Col span={22} className={styles.input}>
                                                <CommentInput onPressEnter={value => handleComment(announcement._id, value)}/>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    />
                    {loadMore}
                </React.Fragment>
            )}
        </div>
    )
};

export default connect(
    ({ learning, loading }) => ({
        initLoading: !!loading.effects['learning/fetchAnnouncements'],
        loading: !!loading.effects['learning/moreAnnouncements'],
        announcements: learning.announcements.list,
        hasMore: learning.announcements.hasMore
    })
)(Announcements);