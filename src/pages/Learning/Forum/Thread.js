import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import router from 'umi/router';
import { connect } from 'dva';
import { EditorState } from 'draft-js';
import { Skeleton, Divider, Row, Col, Avatar, Icon, message, Spin, Button } from 'antd';
import Editor from '@/components/Editor/ImageEditor';
import TimeAgo from 'react-timeago';
import ViewMore from '@/components/ViewMore';
import { exportToHTML } from '@/utils/editor';
import styles from './Thread.less';

const Thread = ({ match, dispatch, ...props }) => {
    const [yourAnswer, setYourAnswer] = useState(EditorState.createEmpty());
    const { threadId } = match.params;
    const {
        thread,
        initLoading,
        loading,
    } = props;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchThread',
            payload: threadId
        });
        return () => dispatch({
            type: 'learning/resetThread'
        });
    }, [threadId]);

    const handleLoadmoreAnswers = () => {
        dispatch({
            type: 'learning/moreAnswers',
            payload: threadId
        });
    };

    const handleToggleVoting = threadId => {
        dispatch({
            type: 'learning/toggleVote',
            payload: threadId
        });
    };

    const handleToggleFollow = threadId => {
        dispatch({
            type: 'learning/toggleFollow',
            payload: threadId
        });
    };

    const handleToggleAnswerVoting = answerId => {
        dispatch({
            type: 'learning/toggleAnswerVote',
            payload: answerId
        });
    };

    const handleAddAnswer = threadId => {
        if (!yourAnswer.getCurrentContent().hasText()) return message.error('You must enter answer!');
        //threadId, 
        const html = exportToHTML(yourAnswer);
        dispatch({
            type: 'learning/answer',
            payload: {
                threadId,
                answer: html
            }
        });
        // setYourAnswerLoading(true);
        // setTimeout(() => {
        //     setThread({
        //         ...thread,
        //         answers: [
        //             {
        //                 _id: _.uniqueId('answer_'),
        //                 user: {
        //                     _id: 1,
        //                     avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/51059227_2091470127614437_5419405170205261824_o.jpg?_nc_cat=106&_nc_ohc=LnSzD5KUUN4AX8EolVa&_nc_ht=scontent.fdad1-1.fna&oh=95b1eba87a97f6266a625c07caf68566&oe=5EAE6D56',
        //                     name: 'Hanjh Cute',
        //                     isInstructor: false
        //                 },
        //                 createdAt: 1578818445997,
        //                 content: html,
        //                 numOfVotings: 0,
        //                 isVoted: false
        //             },
        //             ...thread.answers,
        //         ]
        //     })
        //     setYourAnswerLoading(false);
        // }, 1000);
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
                        <Avatar shape="circle" className={styles.avatar} src={thread.user.avatar} alt="user-avar" size={100} />
                    </Col>
                    <Col span={20} className={styles.right}>
                        <div className={styles.title}>{thread.title}</div>
                        <div className={styles.extra}>
                            <span className={styles.name}>{thread.user.name}</span>
                            <span className={styles.order}>{`Lecture ${thread.lecture.order}`}</span>
                            <span className={styles.time}>
                                <TimeAgo date={thread.createdAt}/>
                            </span>
                        </div>
                        <div className={styles.content} dangerouslySetInnerHTML={{ __html: thread.content }} />
                    </Col>
                    <div className={styles.votings}>
                        <span className={styles.value}>{thread.numOfVotings}</span>
                        <span onClick={() => handleToggleVoting(thread._id)}><Icon type="arrow-up" style={{ color: thread.isVoted ? '#fada5e' : 'inherit' }}/></span>
                    </div>
                </Row>
            )}
            <Row className={styles.beginAnswers}>
                <Col span={12} className={styles.total}>{!thread ||initLoading ? 'Loading...' : `${thread.totalAnswers} ${thread.totalAnswers < 2 ? 'answer' : 'answers'}`}</Col>
                <Col span={12} className={styles.follow}>
                    {thread && (<span style={{ color: thread.isFollowed ? '#fada5e' : 'inherit' }} onClick={() => handleToggleFollow(thread._id)}>{thread.isFollowed ? 'Unfollow' : 'Follow'}</span>)}
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
                                <React.Fragment key={answer._id + _.uniqueId('answer_')}>
                                    {i > 0 && (<Divider dashed className={styles.divider} />)}
                                    {answer.loading ? (
                                        <Skeleton active avatar={{ size: 48, shape: 'circle' }} title={{ width: '25%' }} paragraph={{ rows: 2, width: ['60%', '96%']}}/>
                                    ) : (
                                        <Row className={styles.answer} key={answer._id + _.uniqueId('answer_')}>
                                            <Col span={2} className={styles.avatarCont}>
                                                <Avatar shape="circle" className={styles.avatar} src={answer.user.avatar} alt="user-avar" size={48} />
                                            </Col>
                                            <Col span={22} className={styles.right}>
                                                <div className={styles.name}>
                                                    <span>{answer.user.name}</span>
                                                    {answer.user.isInstructor && (
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
                                                <span className={styles.value}>{answer.numOfVotings}</span>
                                                <span onClick={() => handleToggleAnswerVoting(answer._id)}><Icon type="arrow-up" style={{ color: answer.isVoted ? '#fada5e' : 'inherit' }}/></span>
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