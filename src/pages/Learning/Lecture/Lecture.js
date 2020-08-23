import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { EditorState } from 'draft-js';
import Editor from '@/components/editor/ImageEditor';
import { Row, Col, Skeleton, Modal, Spin,  Button, Form, Input, message, Descriptions, Popover, Tooltip, Collapse } from 'antd';
import { VideoCameraFilled, FileTextFilled, ClockCircleFilled, RightOutlined, LeftOutlined, LinkOutlined, SelectOutlined, DownloadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import UserAvatar from '@/components/Avatar';
import TimeAgo from 'react-timeago';
import { saveAs } from 'file-saver';
import { exportToHTML } from '@/utils/editor';
import { minutesToHour, secondToDuration } from '@/utils/utils';
import styles from './Lecture.less';

const FormItem = Form.Item;
const { Panel } = Collapse;

const Lecture = ({ match, dispatch, ...props }) => {
    const [resourcesVisible, setResourcesVisible] = useState(false);
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
        askQuestionLoading,
        children,
        type
    } = props;
    const { lectureId, courseId, chapterId } = match.params;
    useEffect(() => {
        if (type === 'Article') {
            dispatch({
                type: 'learning/fetchArticleLecture',
                payload: {
                    courseId,
                    chapterId,
                    lectureId
                }
            });
        }
        else {
            dispatch({
                type: 'learning/fetchVideoLecture',
                payload: {
                    courseId,
                    lectureId,
                    chapterId
                }
            });
        }
        return () => dispatch({ 
            type: 'learning/resetLecture'
        });
    }, [courseId, lectureId]);
    const handleCompleteLecture = (value) => {
        dispatch({
            type: 'learning/toggleComplete',
            payload: {
                courseId,
                chapterId,
                lectureId,
                value
            }
        });
    };
    const handleAskQuestion = () => setQuestionVisible(true);
    const goToLecture = (lecture) => {
        if (!lecture) {
            return;
        }
        const { _id, type } = lecture;
        const { courseId, chapterId } = match.params;
        router.push(`/learning/${courseId}/${chapterId}/lecture/${type === 'Article' ? 'article' : 'video'}/${_id}`);
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
                lectureIndex: lecture.lectureIndex,
                callback: () => message.success('Your question submitted successfully!')
            }
        });
        handleCancelAskQuestion();
    };
    const checkEmptyResources = resources => {
        return !resources || (_.isEmpty(resources.downloadable) && _.isEmpty(resources.external));
    };
    const handleDownloadResource = (resourceURL, resourceName) => {
        fetch(resourceURL)
            .then(res => res.blob())
            .then(resource => {
                saveAs(resource, resourceName);
            })
            .catch(err => {
                message.error(`Cannot download this file. Error: ${err.message}`);
                saveAs(resourceURL, resourceName);
            });
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
                    {type === 'Article' ? 'Article' : 'Video'}
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
        <div className={styles.lecture}>
            <div className={styles.header}>
                <Row className={styles.infor}>
                    <Col span={1} className={styles.iconCol}>
                        {type === 'Article' ? (
                            <FileTextFilled className={styles.icon} />
                        ) : (
                            <VideoCameraFilled className={styles.icon} />
                        )}
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
                                    {type === 'Article' && (
                                        <span className={styles.duration}>
                                            <span className={styles.icon}>
                                                <ClockCircleFilled />
                                            </span>
                                            <span className={styles.text}>{`${minutesToHour(lecture.duration)} read`}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </Col>
                    <Col span={6} className={styles.options}>
                        {lecture && !initLoading && (
                            <>
                                {!checkEmptyResources(lecture.resources) && (
                                    <span className={styles.resources}>
                                        <Tooltip placement="top" title="Resources" mouseEnterDelay={1}>
                                            <Button
                                                shape="circle"
                                                icon="dropbox"
                                                onClick={() => setResourcesVisible(true)}
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
                                {type === 'Article' ? (
                                    <span className={styles.markComplete}>
                                        <Tooltip placement="top" title="Toggle complete status" mouseEnterDelay={1}>
                                            {lecture.isCompleted ? (
                                                <Button
                                                    shape="circle"
                                                    type={"primary"}
                                                    icon="check"
                                                    onClick={() => handleCompleteLecture(false)}
                                                    style={{
                                                        backgroundColor: '#fada5e'
                                                    }}
                                                />
                                            ) : (
                                                <Button
                                                    shape="circle"
                                                    type={"default"}
                                                    icon="check"
                                                    onClick={() => handleCompleteLecture(true)}
                                                    style={{
                                                        backgroundColor: 'white'
                                                    }}
                                                />
                                            )}

                                        </Tooltip>
                                    </span>
                                ) : null}
                                <span className={styles.metadata}>
                                    <Popover
                                        trigger="click"
                                        popupClassName={styles.metadataPopover}
                                        placement="bottomRight"
                                        content={getMetadata(lecture)}
                                        arrowPointAtCenter
                                        popupAlign={{ offset: [21, 6] }}
                                    >
                                        <Tooltip placement="top" title={`View ${type === 'Article' ? 'article' : 'video'} metadata`} mouseEnterDelay={1}>
                                            <Button shape="circle" icon="info" />
                                        </Tooltip>
                                    </Popover>
                                </span>
                            </>
                        )}
                    </Col>
                </Row>
                <div className={styles.navigation}>
                    {lecture && lecture.prevLecture !== null && (
                        <div className={styles.prev} onClick={() => goToLecture(lecture.prevLecture)}>
                            <span className={styles.icon}>
                                <LeftOutlined />
                            </span>
                            <span className={styles.text}>
                                Prev
                            </span>
                        </div>
                    )}
                    {lecture && lecture.nextLecture !== null && (
                        <div className={styles.next} onClick={() => goToLecture(lecture.nextLecture)}>
                            <span className={styles.text}>
                                Next
                            </span>
                            <span className={styles.icon}>
                                <RightOutlined />
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.clear} />
            <div className={styles.content}>
                {children(lecture, initLoading)}
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
            {lecture && !initLoading && !checkEmptyResources(lecture.resources) && (
                <Modal
                    className={styles.resourcesModal}
                    title={<div className={styles.modalTitle}>Resources</div>}
                    width={720}
                    centered
                    footer={null}
                    visible={resourcesVisible}
                    onCancel={() => setResourcesVisible(false)}
                    maskClosable={false}
                    bodyStyle={{ padding: '35px 10px' }}
                >
                    <Collapse defaultActiveKey={['downloadable', 'external']} expandIconPosition="right">
                        {!_.isEmpty(lecture.resources.downloadable) && (
                            <Panel key="downloadable" header="Downloadable materials">
                                {_.map(lecture.resources.downloadable, resource => (
                                    <Row gutter={16} key={resource._id} className={styles.resource}>
                                        <Col className={styles.icon} span={1}>
                                            <CloudDownloadOutlined />
                                        </Col>
                                        <Col className={styles.name} span={12}>
                                            {resource.name}
                                        </Col>
                                        <Col className={styles.extra} span={10}>
                                            {resource.extra}
                                        </Col>
                                        <Col className={styles.action} span={1}>
                                            <Tooltip placement="top" title="Download">
                                                <span className={styles.btn} onClick={() => handleDownloadResource(resource.url, resource.name)}>
                                                    <DownloadOutlined />
                                                </span>
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                ))}
                            </Panel>
                        )}
                        {!_.isEmpty(lecture.resources.external) && (
                            <Panel key="external" header="External resources">
                                {_.map(lecture.resources.external, resource => (
                                    <Row gutter={16} key={resource._id} className={styles.resource}>
                                        <Col className={styles.icon} span={1}>
                                            <LinkOutlined />
                                        </Col>
                                        <Col className={styles.name} span={12}>
                                            {resource.name}
                                        </Col>
                                        <Col className={styles.extra} span={10}>
                                            {resource.url}
                                        </Col>
                                        <Col className={styles.action} span={1}>
                                            <Tooltip placement="top" title={`Go to ${resource.url}`}>
                                                <span className={styles.btn} onClick={() => window.location.href = resource.url}>
                                                    <SelectOutlined />
                                                </span>
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                ))}
                            </Panel>
                        )}
                    </Collapse>
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

export default withRouter(connect(
    ({ learning, loading }) => ({
        initLoading: !!loading.effects['learning/fetchLecture'],
        askQuestionLoading: !!loading.effects['learning/askQuestionDirectly'],
        lecture: learning.lecture
    })
)(Lecture));