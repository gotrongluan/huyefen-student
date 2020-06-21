import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import { Divider, Select, TreeSelect, Input, Row, Col, Form, Icon, Spin, Button, Skeleton, Modal, message } from 'antd';
import UserAvatar from '@/components/Avatar';
import { EditorState } from 'draft-js';
import Editor from '@/components/Editor/ImageEditor';
import TimeAgo from 'react-timeago';
import Loading from '@/elements/spin/secondary';
import styles from './index.less';
import { exportToHTML } from '@/utils/editor';
import { extractContent } from '@/utils/utils';

const { Option } = Select;
const { Search, TextArea } = Input;
const FormItem = Form.Item;

const Forum = ({ location, match, dispatch, ...props }) => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [questionTitle, setQuestionTitle] = useState({
        value: '',
        validateStatus: 'success',
        help: ''
    });
    const [questionContent, setQuestionContent] = useState(EditorState.createEmpty());
    const [newQuestionLecture, setNewQuestionLecture] = useState(undefined);
    const [newQuestionLectureIndex, setNewQuestionLectureIndex] = useState(undefined);
    const {
        forum,
        initLoading,
        loading,
        lectureOptionsLoading,
        sortLoading,
        filterByLectureLoading,
        filterByTypesLoading,
        askQuestionLoading
    } = props;
    const { courseId } = match.params;
    const handleSort = value => {
        dispatch({
            type: 'learning/sortQuestions',
            payload: {
                courseId,
                value
            }
        });
    };

    const handleQuestionTypes = values => {
        dispatch({
            type: 'learning/filterQuestionsByTypes',
            payload: {
                courseId,
                values
            }
        });
    };

    const handleLecture = value => {
        dispatch({
            type: 'learning/filterQuestionsByLecture',
            payload: {
                courseId,
                value
            }
        });
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

    const handleMoreThreads = () => {
        dispatch({
            type: 'learning/moreQuestions',
            payload: courseId
        });
    };

    const handleCancelAskQuestion = () => {
        setQuestionTitle({
            validateStatus: 'success',
            help: '',
            value: ''
        });
        setQuestionContent(EditorState.createEmpty());
        setNewQuestionLecture(undefined);
        setNewQuestionLectureIndex(undefined);
        setVisibleModal(false);
    };

    const handleSubmitQuestion = () => {
        if (questionTitle.value === '') return message.error('You must enter title!');
        else if (newQuestionLecture === undefined) return message.error('You must select lecture');
        else {
            const contentState = questionContent.getCurrentContent();
            if (!contentState.hasText()) return message.error('You must enter question!');
        };
        const html = exportToHTML(questionContent);
        dispatch({
            type: 'learning/askQuestion',
            payload: {
                courseId,
                title: questionTitle.value,
                lecture: newQuestionLecture,
                lectureIndex: newQuestionLectureIndex,
                content: html
            }
        });
        handleCancelAskQuestion();
    };

    const loadMore = (
        !initLoading && !loading && forum.list && forum.hasMore ? (
            <div className={styles.loadMore}>
                <Button size="small" onClick={handleMoreThreads}>More questions</Button>
            </div>
        ) : null
    );
    // message.info(!forum.total || initLoading);
    const threadsData = loading ? [...forum.list, {
        _id: _.uniqueId('thread_loading_'),
        loading: true
    }, {
        _id: _.uniqueId('thread_loading_'),
        loading: true
    }] : forum.list;
    let lectureIndexCount = 1;
    const lectureOptionsData = !forum.lectureOptions || lectureOptionsLoading ? [] : (_.map(forum.lectureOptions, chapter => ({
        key: chapter._id,
        title: chapter.title,
        value: chapter._id,
        selectable: false,
        children: _.map(chapter.lectures, lecture => ({
            key: lecture._id,
            value: lecture._id,
            title: lecture.title,
            index: lectureIndexCount++
        }))
    })));

    return (
        <div className={styles.forum}>
            <div className={styles.search}>
                <Search placeholder="Search question..." size="large" />
            </div>
            <div className={styles.filters}>
                <Form layout="vertical">
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem label="Lecture">
                                <TreeSelect
                                    disabled={!forum.lectureOptions || lectureOptionsLoading}
                                    style={{ width: '100%' }}
                                    onChange={handleLecture}
                                    value={forum.filters.lecture}
                                    dropdownClassName={styles.forumTreeSelect}
                                    dropdownStyle={{ maxHeight: 360, overflow: 'auto' }}
                                    size="large"
                                    suffixIcon={!forum.lectureOptions || lectureOptionsLoading ? (
                                        <Icon type="loading" spin style={{ fontSize: 16, color: '#fada5e' }}/>
                                    ) : undefined}
                                    treeData={[
                                        {
                                            title: 'All lectures',
                                            key: 'all',
                                            value: 'all'
                                        },
                                        ...lectureOptionsData
                                    ]}
                                />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Sort by">
                                <Select
                                    className={styles.sortBy}
                                    size="large"
                                    onChange={handleSort}
                                    value={forum.filters.sortBy}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="relevance">Sort by relevance</Option>
                                    <Option value="recent">Sort by most recent</Option>
                                    <Option value="upvoted">Sort by most upvoted</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="Question type">
                                <Select
                                    mode="multiple"
                                    placeholder="Question type"
                                    size="large"
                                    value={forum.filters.questionTypes}
                                    style={{ width: '100%' }}
                                    optionLabelProp="label"
                                    onChange={handleQuestionTypes}
                                >
                                    <Option value="following" label="Following">Questions I'm following</Option>
                                    <Option value="asked" label="Asked">Questions I asked</Option>
                                    <Option value="noResponse" label="No response">Questions without response</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Row className={styles.totalAndNew}>
                <Col span={12} className={styles.total}>{(!forum.total || initLoading) ? 'Loading...' : `${forum.total} ${forum.total < 2 ? 'question' : 'questions'}`}</Col>
                <Col span={12} className={styles.newQuestion}><span onClick={() => setVisibleModal(true)}>Ask a new question</span></Col>
            </Row>
            <Divider className={styles.divider} dashed/>
            <div className={styles.threads}>
                {initLoading || !forum.list ? (
                    <div className={styles.loading}>
                        <div className={styles.inlineDiv}>
                            <Spin indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />} />
                        </div>
                    </div>
                ) : (
                    <Loading spinning={sortLoading || filterByLectureLoading || filterByTypesLoading} fontSize={8} isCenter>
                        {_.map(threadsData, (thread, i) => (
                            <React.Fragment key={thread._id}>
                                {i > 0 && (<Divider className={styles.divider} dashed key={`divider_${thread._id}`} />)}
                                {thread.loading ? (
                                    <Skeleton active avatar={{ size: 40, shape: 'circle' }} title={false} key={`skeleton_${thread._id}`} paragraph={{ rows: 3, width: ['40%', '90%', '45%']}} />
                                ) : (
                                    <Row className={styles.thread} key={`row_${thread._id}`} onClick={() => router.push(`${location.pathname}/thread/${thread._id}`)}>
                                        <Col span={2} className={styles.avatarCont}>
                                            <UserAvatar
                                                alt="avat-user"
                                                src={thread.user.avatar}
                                                style={{ background: 'white', color: 'black' }}
                                                borderWidth={2}
                                                size={42}
                                                textSize={44}
                                                text={thread.user.name}
                                            />
                                        </Col>
                                        <Col span={18} className={styles.info}>
                                            <div className={styles.title}>{thread.title}</div>
                                            <div className={styles.content}>{extractContent(thread.content)}</div>
                                            <div className={styles.extra}>
                                                <span className={styles.name}>{thread.user.name}</span>
                                                <span className={styles.order}>{`Lecture ${thread.lectureIndex}`}</span>
                                                <span className={styles.time}>
                                                    <TimeAgo date={thread.createdAt}/>
                                                </span>
                                            </div>
                                        </Col>
                                        <Col span={4} className={styles.statistic}>
                                            <div className={styles.votings}>
                                                <span className={styles.value}>{thread.numOfVotes}</span>
                                                <Icon type="arrow-up" />
                                            </div>
                                            <div className={styles.answers}>
                                                <span className={styles.value}>{thread.numOfAnswers}</span>
                                                <Icon type="message" />
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </React.Fragment>
                        ))}
                    </Loading>
                )}
                {loadMore}
            </div>
            <Modal
                className={styles.newQuestionModal}
                title={<div className={styles.modalTitle}>Ask a new question</div>}
                width={600}
                centered
                okText="Submit"
                visible={visibleModal}
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
                    <FormItem label="Lecture" required>
                        <TreeSelect
                            style={{ width: '100%' }}
                            onSelect={(value, node) => {
                                setNewQuestionLecture(value);
                                setNewQuestionLectureIndex(node.props.index);
                            }}
                            placeholder="Lecture"
                            value={newQuestionLecture}
                            dropdownClassName={styles.newQuestionTreeSelect}
                            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                            suffixIcon={!forum.lectureOptions || lectureOptionsLoading ? (
                                <Icon type="loading" spin style={{ fontSize: 12, color: '#fada5e' }}/>
                            ) : undefined}
                            treeData={lectureOptionsData}
                        />
                    </FormItem>
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
        forum: learning.forum,
        initLoading: !!loading.effects['learning/fetchQuestions'] || !!loading.effects['learning/fetchQuestionsAgain'],
        loading: !!loading.effects['learning/moreQuestions'],
        lectureOptionsLoading: !!loading.effects['learning/fetchLectureOpts'],
        sortLoading: !!loading.effects['learning/sortQuestions'],
        filterByLectureLoading: !!loading.effects['learning/filterQuestionsByLecture'],
        filterByTypesLoading: !!loading.effects['learning/filterQuestionsByTypes'],
        askQuestionLoading: !!loading.effects['learning/askQuestion']
    })
)(Forum);