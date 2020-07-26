import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { connect } from 'dva';
import { List, Row, Form, Select, Button, Col, Modal, Table, message, Icon, Spin as Loading } from 'antd';
import UserAvatar from '@/components/Avatar';
import Spin from '@/elements/spin/secondary';
import Wrapper from '@/components/JumpotronWrapper';
import MyCourse from '@/components/MyCourse';
import LoadMore from '@/components/LoadMoreButton';
import CourseSkeleton from '@/components/Skeleton/Course';
import { loadingData } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: '425px'
    },
    {
        title: 'Avatar',
        dataIndex: 'avatar',
        render: (avatar, friend) => <UserAvatar alt="avatar" textSize={36} size={36} src={avatar} text={friend.name} borderWidth={0} style={{ background: '#fada5e', color: 'white' }}/>,
        width: '90px'
    }
];

const MyCourses = ({ dispatch, ...props }) => {
    const [friendVisible, setFriendVisible] = useState(false);
    const [selectedFriendIds, setSelectedFriendIds] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [currentTraceCount, setCurrentTraceCount] = useState(0);
    const [trace, setTrace] = useState({
        category: 0,
        progress: 0,
        instructor: 0
    });
    const [sortBy, setSortBy] = useState('a-z');
    const [category, setCategory] = useState(undefined);
    const [progress, setProgress] = useState(undefined);
    const [instructor, setInstructor] = useState(undefined);
    let {
        myCourses,
        friends,
        moreable,
        categories,
        progresses,
        instructors,
        filterLoading,
        initLoading,
        sortLoading,
        resetLoading,
        optionsLoading,
        categoriesLoading,
        progressesLoading,
        instructorsLoading,
        friendsLoading,
        addFriendsLoading,
        recommendLoading,
        loading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'courses/fetch'
        });
        dispatch({
            type: 'courses/fetchFriends'
        });
        dispatch({
            type: 'courses/fetchOptions'
        });
        return () => dispatch({
            type: 'courses/clear'
        });
    }, []);
    const handleSort = sortBy => {
        setSortBy(sortBy);
        dispatch({
            type: 'courses/sort',
            payload: sortBy
        });
    };
    const handleChangeCategory = (category, count = 0, type, value) => {
        if (!category) {
            if (trace.category > count || trace.category === 0) {
                setCategory(undefined);
                if (count === 1)
                    dispatch({
                        type: 'courses/fetchCategories',
                        payload: {
                            [type]: value
                        }
                    });
                else {
                    let obj = {
                        [type]: value
                    };
                    if (type === 'progress') {
                        obj = {
                            ...obj,
                            instructor
                        };
                    }
                    else {
                        obj = { ...obj, progress };
                    }
                    dispatch({
                        type: 'courses/fetchCategories',
                        payload: { ...obj }
                    });
                }
            }
        }
        else {
            setCategory(category);
            if (trace.category === 0) {
                setTrace({
                    ...trace,
                    category: currentTraceCount + 1
                });
                handleChangeInstructor(null, currentTraceCount + 1, 'category', category);
                handleChangeProgress(null, currentTraceCount + 1, 'category', category);
                setCurrentTraceCount(currentTraceCount + 1);
            }
            else { 
                handleChangeInstructor(null, trace.category, 'category', category);
                handleChangeProgress(null, trace.category, 'category', category);
            }
        }
    };
    const handleChangeProgress = (progress, count = 0, type, value) => { 
        if (!progress) {
            if (trace.progress > count || trace.progress === 0) {
                setProgress(undefined);
                if (count === 1)
                    dispatch({
                        type: 'courses/fetchProgresses',
                        payload: {
                            [type]: value
                        }
                    });
                else {
                    let obj = {
                        [type]: value
                    };
                    if (type === 'category') {
                        obj = {
                            ...obj,
                            instructor
                        };
                    }
                    else {
                        obj = { ...obj, category };
                    }
                    dispatch({
                        type: 'courses/fetchProgresses',
                        payload: { ...obj }
                    });
                }
            }
        }
        else {
            setProgress(progress);
            if (trace.progress === 0) {
                setTrace({
                    ...trace,
                    progress: currentTraceCount + 1
                });
                handleChangeInstructor(null, currentTraceCount + 1, 'progress', progress);
                handleChangeCategory(null, currentTraceCount + 1, 'progress', progress);
                setCurrentTraceCount(currentTraceCount + 1);
            }
            else { 
                handleChangeCategory(null, trace.progress, 'progress', progress);
                handleChangeInstructor(null, trace.progress, 'progress', progress);
            }
        }
    };
    const handleChangeInstructor = (instructor, count = 0, type, value) => {
        if (!instructor) {
            if (trace.instructor > count || trace.instructor === 0) {
                setInstructor(undefined);
                if (count === 1)
                    dispatch({
                        type: 'courses/fetchInstructors',
                        payload: {
                            [type]: value
                        }
                    });
                else {
                    let obj = {
                        [type]: value
                    };
                    if (type === 'progress') {
                        obj = {
                            ...obj,
                            category
                        };
                    }
                    else {
                        obj = { ...obj, progress };
                    }
                    dispatch({
                        type: 'courses/fetchInstructors',
                        payload: { ...obj }
                    });
                }
            }
        }
        else {
            setInstructor(instructor);
            if (trace.instructor === 0) {
                setTrace({
                    ...trace,
                    instructor: currentTraceCount + 1
                });
                handleChangeProgress(null, currentTraceCount + 1, 'instructor', instructor);
                handleChangeCategory(null, currentTraceCount + 1, 'instructor', instructor);
                setCurrentTraceCount(currentTraceCount + 1);
            }
            else { 
                handleChangeCategory(null, trace.instructor, 'instructor', instructor);
                handleChangeProgress(null, trace.instructor, 'instructor', instructor);
            }
        }
    };
    const handleFilter = () => {
        dispatch({
            type: 'courses/filter',
            payload: {
                category,
                progress,
                instructor
            }
        })
    };
    const handleReset = () => {
        setCategory(undefined);
        setProgress(undefined);
        setInstructor(undefined);
        setCurrentTraceCount(0);
        setTrace({
            category: 0,
            progress: 0,
            instructor: 0
        });
        dispatch({
            type: 'courses/reset'
        });
    };
    const handleMoreCourses = () => {
        dispatch({
            type: 'courses/moreCourses',
        });
    };
    const handleAllCourses = () => {
        dispatch({
            type: 'courses/allCourses'
        });
    };
    const handleRecommend = courseId => {
        setCurrentCourse(courseId);
        setFriendVisible(true);
    };
    const handleCancelRecommend = () => {
        setCurrentPage(1);
        setFriendVisible(false);
        setSelectedFriendIds([]);
        setCurrentCourse(null);
    };
    const handleOkRecommend = () => {
        if (_.isEmpty(selectedFriendIds)) return message.error('Please select friends!');
        if (currentCourse) {
            dispatch({
                type: 'courses/recommend',
                payload: {
                    selectedFriendIds,
                    courseId: currentCourse,
                    callback: handleCancelRecommend
                }
            });
        }
    };
    const handleSelectFriends = friendIds => {

        setSelectedFriendIds(friendIds);
    }
    const handleChangeFriendsPage = page => {
        if (page <= maxPage) setCurrentPage(page);
        else {
            setMaxPage(page);
            dispatch({
                type: 'courses/addFriends',
                payload: {
                    start: maxPage,
                    end: page,
                    callback: () => setCurrentPage(page)
                }
            });
        }
    }
    const loadMore = (
        <LoadMore
            when={!initLoading && !loading && myCourses && moreable}
            className={styles.loadMore}
            onAll={handleAllCourses}
            onMore={handleMoreCourses}
            itemName="course"
        />
    )
    if (loading && myCourses) myCourses = loadingData(myCourses, 'my_course_loading', 4);
    return (
        <Wrapper title="My courses">
            <div className={styles.myCourses}>
                <Row className={styles.filter} gutter={24}>
                    <Col span={5} className={styles.sortCont}>
                        <Form layout="vertical" className={styles.sortForm}>
                            <div className={styles.label}>Sort by</div>
                            <Form.Item
                                className={styles.formItem}
                            >
                                <Select
                                    value={sortBy}
                                    onChange={handleSort}
                                    size="large"
                                    style={{ width: 150 }}
                                    dropdownStyle={{
                                        width: 'auto !important',
                                        minWidth: 150
                                    }}
                                    dropdownClassName={styles.dropdown}
                                    disabled={!myCourses || initLoading || sortLoading}
                                    loading={!myCourses || initLoading || sortLoading}
                                >
                                    <Option value="recent-enroll">Recently Enrolled</Option>
                                    <Option value="a-z">Title: A to Z</Option>
                                    <Option value="z-a">Title: Z to A</Option>
                                    <Option value="non-complete">Completion: 0% to 100%</Option>
                                    <Option value="complete-non">Completion: 100% to 0%</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Col>  
                    <Col span={19} className={styles.filterCont}>
                        <Form layout="inline" className={styles.filterForm}>
                            <div className={styles.label}>Filter by</div>
                            <Form.Item className={styles.formItem}>
                                <Select
                                    value={category}
                                    placeholder="Category"
                                    size="large"
                                    onChange={handleChangeCategory}
                                    style={{ width: 180 }}
                                    dropdownStyle={{
                                        width: 'auto !important',
                                        minWidth: 180
                                    }}
                                    dropdownClassName={styles.cateDropdown}
                                    disabled={!categories || optionsLoading || categoriesLoading}
                                    loading={!categories || optionsLoading || categoriesLoading}
                                >
                                    {_.map(categories, category => (
                                        <Option key={category._id} value={category._id}>{category.title}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item className={styles.formItem}>
                                <Select
                                    value={progress}
                                    placeholder="Progress"
                                    size="large"
                                    onChange={handleChangeProgress}
                                    style={{ width: 130 }}
                                    dropdownStyle={{
                                        width: 'auto !important',
                                        minWidth: 130
                                    }}
                                    dropdownClassName={styles.dropdown}
                                    disabled={!progresses || optionsLoading || progressesLoading}
                                    loading={!progresses || optionsLoading || progressesLoading}
                                >
                                    {_.map(progresses, progress => (
                                        <Option key={progress.key} value={progress.key}>{progress.title}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item className={styles.formItem}>
                                <Select
                                    value={instructor}
                                    placeholder="Instructor"
                                    size="large"
                                    onChange={handleChangeInstructor}
                                    style={{ width: 200 }}
                                    dropdownStyle={{
                                        width: 'auto !important',
                                        minWidth: 200
                                    }}
                                    dropdownClassName={classnames(styles.dropdown, styles.insDropdown)}
                                    disabled={!instructors || optionsLoading || instructorsLoading}
                                    loading={!instructors || optionsLoading || instructorsLoading}
                                >
                                    {_.map(instructors, instructor => (
                                        <Option key={instructor._id} value={instructor._id}>{instructor.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item className={classnames(styles.formItem, styles.btn)}>
                                <Button type="primary" disabled={!myCourses || initLoading || filterLoading} onClick={handleFilter}>
                                    {filterLoading && (
                                        <Icon type="loading" />
                                    )}
                                    <span className={styles.text}>Filter</span>
                                </Button>
                                <Button className={styles.resetBtn} disabled={!myCourses || initLoading || resetLoading} onClick={handleReset}>
                                    {resetLoading && (
                                        <Icon type="loading" />
                                    )}
                                    <span className={styles.text}>Reset</span>
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <Row className={styles.content}>
                    <Spin spinning={!myCourses || initLoading || filterLoading || resetLoading || sortLoading} fontSize={8} isCenter>
                        <List
                            grid={{
                                gutter: 16,
                                column: 4
                            }}
                            loadMore={loadMore}
                            dataSource={!myCourses ? [] : myCourses}
                            rowKey={course => course._id}
                            renderItem={course => (
                                <List.Item>
                                    {!course.loading ? (<MyCourse course={course} handleRecommend={handleRecommend}/>) : (
                                        <CourseSkeleton />
                                    )}
                                </List.Item>
                            )}
                        />
                    </Spin>
                </Row>
                <Modal
                    className={styles.recommendFriendModal}
                    title={<div className={styles.title}>Recommend to friends</div>}
                    width={605}
                    centered
                    okText="Recommend"
                    cancelText="Cancel"
                    visible={friendVisible}
                    onOk={handleOkRecommend}
                    onCancel={handleCancelRecommend}
                    bodyStyle={{
                        padding: '10px'
                    }}
                >
                    <div className={styles.friends}>
                        <Table
                            className={styles.table}
                            columns={columns}
                            dataSource={!friends.list ? [] : friends.list}
                            loading={friendsLoading || addFriendsLoading}
                            rowKey={friend => friend._id}       //please remove _.uniqueId
                            showHeader={false}
                            scroll={{ x: 581 }}
                            rowSelection={{
                                columnWidth: '60px',
                                // fixed: true,
                                onChange: handleSelectFriends,
                                selectedRowKeys: selectedFriendIds
                            }}
                            pagination={friends.total && friends.total > 5 ? {
                                total: friends.total,
                                pageSize: 5,
                                current: currentPage,
                                simple: true,
                                small: true,
                                onChange: handleChangeFriendsPage
                            } : false}
                        />
                    </div>
                </Modal>
                <Modal
                    className={styles.recommendLoadingModal}
                    width={180}
                    visible={recommendLoading}
                    footer={null}
                    closable={false}
                    maskClosable={false}
                    title={null}
                    centered
                    bodyStyle={{ 
                        padding: '10px'
                    }}
                >
                    <div className={styles.icon}><Loading /></div>
                    <div className={styles.text}>Recommeding...</div>
                </Modal>
            </div>
        </Wrapper>
    )
};

export default connect(
    ({ courses, loading }) => ({
        myCourses: courses.list,
        friends: courses.friends,
        moreable: courses.loadMore,
        categories: courses.filters.categories,
        progresses: courses.filters.progresses,
        instructors: courses.filters.instructors,
        loading: !!loading.effects['courses/moreCourses'] || !!loading.effects['courses/allCourses'],
        initLoading: !!loading.effects['courses/fetch'],
        filterLoading: !!loading.effects['courses/filter'],
        resetLoading: !!loading.effects['courses/reset'],
        sortLoading: !!loading.effects['courses/sort'],
        optionsLoading: !!loading.effects['courses/fetchOptions'],
        categoriesLoading: !!loading.effects['courses/fetchCategories'],
        progressesLoading: !!loading.effects['courses/fetchProgresses'],
        instructorsLoading: !!loading.effects['courses/fetchInstructors'],
        friendsLoading: !!loading.effects['courses/fetchFriends'],
        addFriendsLoading: !!loading.effects['courses/addFriends'],
        recommendLoading: !!loading.effects['courses/recommend']
    })
)(MyCourses);