import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Divider, List, Select, TreeSelect, Input, Row, Col, Form, Icon, Spin, Button, Skeleton } from 'antd';
import TimeAgo from 'react-timeago';
import LECTURE_OPTIONS from '@/assets/fakers/syllabus';
import QUESTIONS from '@/assets/fakers/questions';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const FormItem = Form.Item;

const Forum = () => {
    const [forum, setForum] = useState({
        total: null,
        list: null,
        lectureOptions: null,
        loadMore: null,
        filters: {
            lectures: 'all',
            sortBy: "recommend",
            questionTypes: []
        }
    });
    const [initLoading, setInitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lectureOptionsLoading, setLectureOptionsLoading] = useState(false);
    useEffect(() => {
        setInitLoading(true);
        setTimeout(() => {
            setForum({
                ...forum,
                // list: QUESTIONS,
                total: 2149,
                lectureOptions: LECTURE_OPTIONS,
                list: QUESTIONS,
                loadMore: true
            });
            setInitLoading(false);
        }, 1500);
    }, []);
    useEffect(() => {
        if (!forum.lectureOptions) {
            setLectureOptionsLoading(true);
            setTimeout(() => {
                setForum({
                    ...forum,
                    lectureOptions: LECTURE_OPTIONS
                });
                setLectureOptionsLoading(false);
            }, 1200);
        }
    }, []);
    const handleSort = value => {
        setForum({
            ...forum,
            filters: {
                ...forum.filters,
                sortBy: value
            }
        });
    };

    const handleQuestionTypes = values => {
        setForum({
            ...forum,
            filters: {
                ...forum.filters,
                questionTypes: [...values]
            }
        });
    };

    const handleLecture = value => {
        setForum({
            ...forum,
            filters: {
                ...forum.filters,
                lectures: value
            }
        });
    };

    const handleMoreThreads = () => {
        setLoading(true);
        setTimeout(() => {
            setForum({
                ...forum,
                list: [...forum.list, ...QUESTIONS]
            });
            setLoading(false);
        }, 1000);
    };

    const loadMore = (
        !initLoading && !loading && forum.loadMore ? (
            <div className={styles.loadMore}>
                <Button size="small" onClick={handleMoreThreads}>More threads</Button>
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
                                    className={styles.lectures}
                                    disabled={!forum.lectureOptions || lectureOptionsLoading}
                                    style={{ width: '100%' }}
                                    onChange={handleLecture}
                                    value={forum.filters.lectures}
                                    dropdownClassName={styles.treeSelect}
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
                                        ...(!forum.lectureOptions || lectureOptionsLoading ? [] : (_.map(forum.lectureOptions, chapter => ({
                                            key: chapter._id,
                                            title: chapter.title,
                                            value: chapter._id,
                                            selectable: false,
                                            children: _.map(chapter.lectures, lecture => ({
                                                key: lecture._id,
                                                value: lecture._id,
                                                title: lecture.title  
                                            }))
                                        }))))
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
                                    <Option value="recommend">Sort by recommend</Option>
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
                <Col span={12} className={styles.total}>{(!forum.total || initLoading) ? '...' : `${forum.total} ${forum.total < 2 ? 'question' : 'questions'}`}</Col>
                <Col span={12} className={styles.newQuestion}><span>Ask a new question</span></Col>
            </Row>
            <Divider className={styles.divider} dashed/>
            <div className={styles.threads}>
                {initLoading || !forum.list ? (
                    <div className={styles.loading}>
                        <div className={styles.inlineDiv}>
                            <Spin indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />} />
                        </div>
                    </div>
                ) : (_.map(threadsData, (thread, i) => (
                    <React.Fragment key={thread._id + _.uniqueId('thread_')}>
                        {i > 0 && (<Divider className={styles.divider} dashed key={_.uniqueId('thread_divider_')} />)}
                        {thread.loading ? (
                            <Skeleton active avatar={{ size: 40, shape: 'circle' }} title={false} key={thread._id + _.uniqueId('thread_')} paragraph={{ rows: 3, width: ['40%', '90%', '45%']}} />
                        ) : (
                            <Row className={styles.thread} key={thread._id + _.uniqueId('thread_')}>
                                <Col span={2} className={styles.avatarCont}>
                                    <img alt="ava-user" src={thread.user.avatar} className={styles.avatar} />
                                </Col>
                                <Col span={18} className={styles.info}>
                                    <div className={styles.title}>{thread.title}</div>
                                    <div className={styles.content}>{thread.content}</div>
                                    <div className={styles.extra}>
                                        <span className={styles.name}>{thread.user.name}</span>
                                        <span className={styles.order}>{`Lecture ${thread.lecture.order}`}</span>
                                        <span className={styles.time}>
                                            <TimeAgo date={thread.createdAt}/>
                                        </span>
                                    </div>
                                </Col>
                                <Col span={4} className={styles.statistic}>
                                    <div className={styles.votings}>
                                        <span className={styles.value}>{thread.numOfVotings}</span>
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
                )))}
                {loadMore}
            </div>
        </div>
    )
    
};

export default Forum;