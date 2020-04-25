import React, { useState, useEffect } from 'react';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import { EditorState } from 'draft-js';
import Editor from '@/components/editor/ImageEditor';
import { Row, Col, Skeleton, Icon, Modal, Spin, Divider, Button, Form, Input, message, Descriptions, Popover, Tooltip } from 'antd';
import { FileTextFilled, ClockCircleFilled, RightOutlined, LeftOutlined } from '@ant-design/icons';
import UserAvatar from '@/components/Avatar';
import TimeAgo from 'react-timeago';
import { exportToHTML } from '@/utils/editor';
import { minutesToHour } from '@/utils/utils';
import styles from './ArticleLecture.less';

const FormItem = Form.Item;

const ArticleLecture = ({ match, dispatch, ...props }) => {
    const [questionVisible, setQuestionVisible] = useState(false);
    const [questionTitle, setQuestionTitle] = useState({
        value: '',
        validateStatus: 'success',
        help: ''
    });
    const [questionContent, setQuestionContent] = useState(EditorState.createEmpty());
    const {
        lecture,
        initLoading,
        askQuestionLoading
    } = props;
    const { lectureId, courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchLecture',
            payload: {
                courseId,
                lectureId
            }
        });
        return () => dispatch({ 
            type: 'learning/resetLecture'
        });
    }, [courseId, lectureId]);
    const handleCompleteLecture = () => {
        dispatch({
            type: 'learning/toggleComplete',
            payload: lectureId
        });
    };
    const handleAskQuestion = () => setQuestionVisible(true);
    const goToLecture = lectureId => {
        const { courseId } = match.params;
        router.push(`/learning/${courseId}/lecture/${lectureId}`);
    };
    const handleChangeQuestionTitle = e => {
        const val = e.target.value;
        if (!val || val.length === '') {
            setQuestionTitle({
                validateStatus: 'error',
                help: 'You must enter title',
                value: val
            });
        }
        else setQuestionTitle({
            validateStatus: 'success',
            help: '',
            value: val
        });
    };
    const handleCancelAskQuestion = () => {
        setQuestionTitle({
            validateStatus: 'success',
            help: '',
            value: ''
        });
        setQuestionContent(EditorState.createEmpty());
        setQuestionVisible(false);
    };
    const handleSubmitQuestion = () => {
        if (questionTitle.value === '') return message.error('You must enter title!');
        else {
            const contentState = questionContent.getCurrentContent();
            if (!contentState.hasText()) return message.error('You must enter question!');
        };
        //do something
        //call exportToHTML
        const html = exportToHTML(questionContent);
        dispatch({
            type: 'learning/askQuestionDirectly',
            payload: {
                courseId,
                title: questionTitle.value,
                lecture: lectureId,
                content: html,
                callback: () => message.success('Your question submitted successfully!')
            }
        });
        handleCancelAskQuestion();
    };
    const handleOpenResources = () => {

    };
    const getMetadata = article => {
        return (
            <Descriptions
                title={null}
                column={1}
                size="middle"
            >
                <Descriptions.Item label="Title">
                    {article.title}
                </Descriptions.Item>
                <Descriptions.Item label="Chapter">
                    {article.chapter.title}
                </Descriptions.Item>
                <Descriptions.Item label="Type">
                    Article
                </Descriptions.Item>
                <Descriptions.Item label="Creator">
                    <span className={styles.userName}>
                        {article.owner.name}
                    </span>
                    <span className={styles.avatar}>
                        <UserAvatar
                            alt="user-avatar"
                            src={article.owner.avatar}
                            size={28}
                            textSize={28}
                            text={article.owner.name}
                            borderWidth={0}
                            style={{ color: 'white', background: '#fada5e', fontSize: '1em' }}
                        />
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="Created at">
                    {moment(article.createdAt).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Last updated">
                    <TimeAgo date={article.updatedAt} />
                </Descriptions.Item>
            </Descriptions>
        );
    };

    return (
        <div className={styles.article}>
            <div className={styles.header}>
                <Row className={styles.infor}>
                    <Col span={1} className={styles.iconCol}>
                        <FileTextFilled className={styles.icon} />
                    </Col>
                    <Col span={17} className={styles.textInfo}>
                        {!lecture || initLoading ? (
                            <div className={styles.loading}>
                                <Skeleton active title={null} paragraph={{ rows: 2, width: ['62%', '42%'] }} />
                            </div>
                        ) : (
                            <div>
                                <div className={styles.title}>
                                    {lecture.title}
                                </div>
                                <div className={styles.chapterAndDuration}>
                                    <span className={styles.chapter}>
                                        {`Chapter ${lecture.chapter.title}`}
                                    </span>
                                    <span className={styles.duration}>
                                        <span className={styles.icon}>
                                            <ClockCircleFilled />
                                        </span>
                                        <span className={styles.text}>{`${minutesToHour(lecture.duration)} read`}</span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </Col>
                    <Col span={6} className={styles.options}>
                        {lecture && !initLoading && (
                            <>
                                {true && (
                                    <span className={styles.resources}>
                                        <Tooltip placement="top" title="Resources" mouseEnterDelay={1}>
                                            <Button
                                                shape="circle"
                                                icon="dropbox"
                                                onClick={handleOpenResources}
                                            />
                                        </Tooltip>
                                    </span>
                                )}
                                <span className={styles.askQuestion}>
                                    <Tooltip placement="top" title="Ask a question" mouseEnterDelay={1}>
                                        <Button
                                            shape="circle"
                                            icon="inbox"
                                            onClick={handleAskQuestion}
                                        />
                                    </Tooltip>
                                </span>
                                <span className={styles.markComplete}>
                                    <Tooltip placement="top" title="Toggle complete status" mouseEnterDelay={1}>
                                        <Button
                                            shape="circle"
                                            type={lecture.isCompleted ? "primary" : "default"}
                                            icon="check"
                                            onClick={handleCompleteLecture}
                                        />
                                    </Tooltip>
                                </span>
                                <span className={styles.metadata}>
                                    <Popover
                                        trigger="click"
                                        popupClassName={styles.metadataPopover}
                                        placement="bottomRight"
                                        content={getMetadata(lecture)}
                                        arrowPointAtCenter
                                        popupAlign={{ offset: [21, 6] }}
                                    >
                                        <Tooltip placement="top" title="View article metadata" mouseEnterDelay={1}>
                                            <Button shape="circle" icon="info" />
                                        </Tooltip>
                                    </Popover>
                                </span>
                            </>
                        )}
                    </Col>
                </Row>
                <div className={styles.navigation}>
                    <div className={styles.prev}>
                        <span className={styles.icon}>
                            <LeftOutlined />
                        </span>
                        <span className={styles.text}>
                            Prev
                        </span>
                    </div>
                    <div className={styles.next}>
                        <span className={styles.text}>
                            Next
                        </span>
                        <span className={styles.icon}>
                            <RightOutlined />
                        </span>
                    </div>
                </div>
            </div>
            <div className={styles.clear} />
            <div className={styles.content}>
                <div className={styles.container}>
                    {!lecture || initLoading ? (
                        <div className={styles.loading}>
                            <Spin tip="Fetching..." />
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: lecture.content }}/>
                    )}
                </div>
            </div>
            {lecture && !initLoading && (
                <Modal
                    className={styles.newQuestionModal}
                    title={<div className={styles.modalTitle}>Ask a new question</div>}
                    width={600}
                    centered
                    okText="Submit"
                    visible={questionVisible}
                    onOk={handleSubmitQuestion}
                    onCancel={handleCancelAskQuestion}
                    bodyStyle={{ padding: '35px 10px' }}
                >
                    <Form>
                        <FormItem label="Title" help={questionTitle.help} validateStatus={questionTitle.validateStatus} required>
                            <Input 
                                type="text"
                                placeholder="Title"
                                value={questionTitle.value}
                                onChange={handleChangeQuestionTitle}
                                style={{ width: '100%' }}
                            />
                        </FormItem>
                        <div className={styles.questionLectureTitle}>
                            <span>Lecture:</span>
                        </div>
                        <div className={styles.questionLectureWrapper}>
                            {`${lecture.title} -- ${lecture.chapter.title}`}
                        </div>
                        <div className={styles.questionContentTitle}>
                            <span>Content:</span>
                        </div>
                        <div className={styles.questionContentWrapper}>
                            <Editor
                                editorState={questionContent}
                                onChange={editorState => setQuestionContent(editorState)}
                                placeholder="Enter question..."
                            />
                        </div>
                    </Form>
                </Modal>
            )}
            <Modal
                className={styles.askQuestionLoadingModal}
                width={180}
                visible={askQuestionLoading}
                footer={null}
                closable={false}
                maskClosable={false}
                title={null}
                centered
                bodyStyle={{ 
                    padding: '10px'
                }}
            >
                <div className={styles.icon}><Spin /></div>
                <div className={styles.text}>Submitting...</div>
            </Modal>
        </div>
    )
};

export default connect(
    ({ learning, loading }) => ({
        initLoading: !!loading.effects['learning/fetchLecture'],
        askQuestionLoading: !!loading.effects['learning/askQuestionDirectly'],
        lecture: learning.lecture
    })
)(ArticleLecture);