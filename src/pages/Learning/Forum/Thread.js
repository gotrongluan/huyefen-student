import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import router from 'umi/router';
import { EditorState } from 'draft-js';
import { Skeleton, Divider, Row, Col, Avatar, Icon, message, Spin, Button } from 'antd';
import Editor from '@/components/Editor/ImageEditor';
import TimeAgo from 'react-timeago';
import THREAD from '@/assets/fakers/thread';
import ANSWERS from '@/assets/fakers/answers';
import styles from './Thread.less';

const Thread = ({ match }) => {
    const [thread, setThread] = useState(null);
    const [threadLoading, setThreadLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [yourAnswer, setYourAnswer] = useState(EditorState.createEmpty());
    useEffect(() => {
        setThreadLoading(true);
        setTimeout(() => {
            setThread(THREAD);
            setThreadLoading(false);
        }, 1400);
    }, []);

    const handleLoadmoreAnswers = () => {
        setLoading(true);
        setTimeout(() => {
            setThread({
                ...thread,
                answers: [
                    ...thread.answers,
                    ...ANSWERS
                ]
            });
            setLoading(false);
        }, 3200);
    };

    const handleToggleVoting = threadId => {
        message.info(`You toggled vote of thread ${threadId}`);
    };

    const handleToggleFollow = threadId => {
        message.info(`You toggled follow of thread ${threadId}`);
    };

    const handleToggleAnswerVoting = answerId => message.info(`You toggled voting of answer ${answerId}`);

    const loadMore = (
        !threadLoading && !loading && thread ? (
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
            {!thread || threadLoading ? (
                <div className={styles.loading}>
                    <div className={styles.inlineDiv}>
                        <Spin indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />}/>
                    </div>
                </div>
            ) : (
                <Row className={styles.question}>
                    <Col span={4} className={styles.avatarCont}>
                        <Avatar shape="circle" className={styles.avatar} src={thread.user.avatar} alt="user-avar"/>
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
                <Col span={12} className={styles.total}>{!thread || threadLoading ? 'Loading...' : `${thread.totalAnswers} ${thread.totalAnswers < 2 ? 'answer' : 'answers'}`}</Col>
                <Col span={12} className={styles.follow}>
                    {thread && (<span style={{ color: thread.isFollowed ? '#fada5e' : 'inherit' }} onClick={() => handleToggleFollow(thread._id)}>{thread.isFollowed ? 'Unfollow' : 'Follow'}</span>)}
                </Col>
            </Row>
            <Divider className={styles.divider} />
            {!thread || threadLoading ? (
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
                                                <Avatar shape="circle" className={styles.avatar} src={answer.user.avatar} alt="user-avar" />
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
                                                <div className={styles.content} dangerouslySetInnerHTML={{ __html: answer.content }} />
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
                        <Editor
                            editorState={yourAnswer}
                            onChange={editorState => setYourAnswer(editorState)}
                            placeholder="Enter answer..."
                        />
                    </div>
                </div>
            )}
        </div>
    )
};

export default Thread;