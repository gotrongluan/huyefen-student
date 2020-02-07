import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { connect } from 'dva';
import { List, Row, Form, Select, Button, Col, message, Icon } from 'antd';
import Spin from '@/elements/spin/secondary';
import Wrapper from '@/components/JumpotronWrapper';
import MyCourse from '@/components/MyCourse';
import MY_COURSES from '@/assets/fakers/mycourses';
import styles from './index.less';

const { Option } = Select;

const MyCourses = ({ dispatch, ...props }) => {
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
        loading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'courses/fetch'
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
    const loadMore = (
        !initLoading && !loading && myCourses && moreable ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreCourses}>More courses</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }} onClick={handleAllCourses}>All courses</Button>
            </div>
        ) : null
    );
    if (loading && myCourses) myCourses = _.concat(myCourses, [
        { key: _.uniqueId('my_course_loading_'), loading: true },
        { key: _.uniqueId('my_course_loading_'), loading: true },
        { key: _.uniqueId('my_course_loading_'), loading: true },
        { key: _.uniqueId('my_course_loading_'), loading: true }
    ]);
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
                                    <Option value="recent-access">Recently Accessed</Option>
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
                            rowKey={course => (course._id || course.key) + _.uniqueId('my_course_')}
                            renderItem={course => (
                                <List.Item>
                                    {!course.loading ? (<MyCourse course={course} />) : (
                                        <div className={styles.courseSkeleton}>
                                            <div className={classnames(styles.avatar, styles.skeletonBox)} />
                                            <div className={styles.info}>
                                                <div className={classnames(styles.name, styles.skeletonBox)} />
                                                <div className={classnames(styles.authors, styles.skeletonBox)} />
                                                <div className={classnames(styles.price, styles.skeletonBox)} />
                                            </div>
                                        </div> 
                                    )}
                                </List.Item>
                            )}
                        />
                    </Spin>
                </Row>
            </div>
        </Wrapper>
    )
};

export default connect(
    ({ courses, loading }) => ({
        myCourses: courses.list,
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
        instructorsLoading: !!loading.effects['courses/fetchInstructors']
    })
)(MyCourses);