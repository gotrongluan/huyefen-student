import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import router from 'umi/router';
import { connect } from 'dva';
import { EditorState } from 'draft-js';
import { Skeleton, Divider, Row, Col, Avatar, Icon, message, Spin, Button } from 'antd';
import UserAvatar from '@/components/Avatar';
import Editor from '@/components/Editor/ImageEditor';
import TimeAgo from 'react-timeago';
import ViewMore from '@/components/ViewMore';
import { exportToHTML } from '@/utils/editor';
import styles from './Thread.less';

const Thread = ({ match, dispatch, ...props }) => {
    const [yourAnswer, setYourAnswer] = useState(EditorState.createEmpty());
    const { threadId, courseId } = match.params;
    const {
        thread,
        initLoading,
        loading,
    } = props;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchThread',
            payload: {
                courseId,
                threadId
            }
        });
        return () => dispatch({
            type: 'learning/resetThread'
        });
    }, [threadId]);

    const handleLoadmoreAnswers = () => {
        dispatch({
            type: 'learning/moreAnswers',
            payload: {
                courseId,
                threadId
            }
        });
    };

    const handleToggleVoting = (threadId, value) => {
        dispatch({
            type: 'learning/toggleVote',
            payload: {
                threadId,
                courseId,
                value
            }
        });
    };

    const handleToggleFollow = (threadId, value) => {
        dispatch({
            type: 'learning/toggleFollow',
            payload: {
                threadId,
                value,
                courseId
            }
        });
    };

    const handleToggleAnswerVoting = (answerId, value) => {
        dispatch({
            type: 'learning/toggleAnswerVote',
            payload: {
                answerId,
                value,
                courseId,
                threadId
            }
        });
    };

    const handleAddAnswer = threadId => {
        if (!yourAnswer.getCurrentContent().hasText()) return message.error('You must enter answer!');
        //threadId, 
        const html = exportToHTML(yourAnswer);
        dispatch({
            type: 'learning/answer',
            payload: {
                courseId,
                threadId,
                answer: html
            }
        });
        setYourAnswer(EditorState.createEmpty());
    };

    const loadMore = (
        !initLoading && !loading && thread && thread.moreAnswers ? (
            <div className={styles.loadMore}>
                <Button size="small" onClick={handleLoadmoreAnswers}>More answers</Button>
            </div>
        ) : null
    );

    const answersData = loading ? _.concat(thread.answers, [{
        _id: _.uniqueId('loading_answer_'),
        loading: true
    }, {
        _id: _.uniqueId('loading_answer_'),
        loading: true
    }]) : (thread && thread.answers);
    return (
        <div className={styles.thread}>
            <div className={styles.back}>
                <span onClick={() => router.push(`/learning/${match.params.courseId}/forum`)}>
                    <Icon type="arrow-left" />
                    <span className={styles.text}>Back to forum</span>
                </span>
            </div>
            {!thread ||initLoading ? (
                <div className={styles.loading}>
                    <div className={styles.inlineDiv}>
                        <Spin indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />}/>
                    </div>
                </div>
            ) : (
                <Row className={styles.question}>
                    <Col span={4} className={styles.avatarCont}>
                        <UserAvatar
                            src={thread.user.avatar}
                            alt="user-avatar"
                            size={100}
                            textSize={103}
                            borderWidth={3}
                            text={thread.user.name}
                            style={{ background: 'white', color: 'black', fontSize: '30px' }}
                        />
                    </Col>
                    <Col span={20} className={styles.right}>
                        <div className={styles.title}>{thread.title}</div>
                        <div className={styles.extra}>
                            <span className={styles.name}>{thread.user.name}</span>
                            <span className={styles.order}>{`Lecture ${thread.lectureIndex}`}</span>
                            <span className={styles.time}>
                                <TimeAgo date={thread.createdAt}/>
                            </span>
                        </div>
                        <div className={styles.content} dangerouslySetInnerHTML={{ __html: thread.content }} />
                    </Col>
                    <div className={styles.votings}>
                        <span className={styles.value}>{thread.numOfVotes}</span>
                        <span onClick={() => handleToggleVoting(thread._id, thread.isVoted)}><Icon type="arrow-up" style={{ color: thread.isVoted ? '#fada5e' : 'inherit' }}/></span>
                    </div>
                </Row>
            )}
            <Row className={styles.beginAnswers}>
                <Col span={12} className={styles.total}>{!thread ||initLoading ? 'Loading...' : `${thread.numOfAnswers} ${thread.numOfAnswers < 2 ? 'answer' : 'answers'}`}</Col>
                <Col span={12} className={styles.follow}>
                    {thread && (<span style={{ color: thread.isFollowed ? '#fada5e' : 'inherit' }} onClick={() => handleToggleFollow(thread._id, thread.isFollowed)}>{thread.isFollowed ? 'Unfollow' : 'Follow'}</span>)}
                </Col>
            </Row>
            <Divider className={styles.divider} />
            {!thread ||initLoading ? (
                <div className={styles.answersLoading}>
                    <Skeleton active avatar={{ size: 48, shape: 'circle' }} title={{ width: '25%' }} paragraph={{ rows: 2, width: ['60%', '96%']}}/>
                </div>
            ) : (
                <div className={styles.answers}>
                    {_.isEmpty(thread.answers) ? (
                        <div className={styles.empty}>
                            This question doesn't have any answer.
                        </div>
                    ) : (
                        <React.Fragment>
                            {_.map(answersData, (answer, i) => (
                                <React.Fragment key={answer._id}>
                                    {i > 0 && (<Divider dashed className={styles.divider} />)}
                                    {answer.loading ? (
                                        <Skeleton active avatar={{ size: 48, shape: 'circle' }} title={{ width: '25%' }} paragraph={{ rows: 2, width: ['60%', '96%']}}/>
                                    ) : (
                                        <Row className={styles.answer} key={answer._id}>
                                            <Col span={2} className={styles.avatarCont}>
                                                <UserAvatar
                                                    src={answer.owner.avatar}
                                                    alt="user-avatar"
                                                    size={48}
                                                    textSize={50}
                                                    borderWidth={3}
                                                    text={answer.owner.name}
                                                    style={{ background: 'white', color: 'black' }}
                                                />
                                            </Col>
                                            <Col span={22} className={styles.right}>
                                                <div className={styles.name}>
                                                    <span>{answer.owner.name}</span>
                                                    {answer.ownerType === 'Teacher' && (
                                                        <span style={{ marginLeft: 10 }}>{'(Instructor)'}</span>
                                                    )}
                                                </div>
                                                <div className={styles.time}>
                                                    <TimeAgo date={answer.createdAt} />
                                                </div>
                                                <ViewMore height={250}>
                                                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: answer.content }} />
                                                </ViewMore>
                                            </Col>
                                            <div className={styles.votings}>
                                                <span className={styles.value}>{answer.numOfVotes}</span>
                                                <span onClick={() => handleToggleAnswerVoting(answer._id, answer.isVoted)}><Icon type="arrow-up" style={{ color: answer.isVoted ? '#fada5e' : 'inherit' }}/></span>
                                            </div>
                                        </Row>
                                    )}
                                </React.Fragment>
                            ))}
                            {loadMore}
                        </React.Fragment>
                    )}
                    <div className={styles.yourAnswer}>
                        <div className={styles.editor}>
                            <Editor
                                editorState={yourAnswer}
                                onChange={editorState => setYourAnswer(editorState)}
                                placeholder="Enter answer..."
                            />
                        </div>
                        <Button type="primary" style={{ marginTop: 20 }} onClick={() => handleAddAnswer(thread._id)}>Add an answer</Button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default connect(
    ({ learning, loading }) => ({
        thread: learning.thread,
        initLoading: !!loading.effects['learning/fetchThread'],
        loading: !!loading.effects['learning/moreAnswers']
    })
)(Thread);