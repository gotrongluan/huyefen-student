import React, { useState } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { List, Row, Form, Select, Button, Col, message } from 'antd';
import Wrapper from '@/components/JumpotronWrapper';
import MyCourse from '@/components/MyCourse';
import MY_COURSES from '@/assets/fakers/mycourses';
import styles from './index.less';

const { Option } = Select;

const MyCourses = () => {
    const [sort, setSort] = useState('a-z');
    const [category, setCategory] = useState(undefined);
    const [progress, setProgress] = useState(undefined);
    const [instructor, setInstructor] = useState(undefined);
    const loading = false;
    const filterLoading = false;
    const handleSort = sort => {
        setSort(sort);
        message.success('Sort successfully!');
    };
    const handleChangeCategory = cate => {
        setCategory(cate);
    };
    const handleChangeProgress = progress => {
        setProgress(progress);
    };
    const handleChangeInstructor = instructor => {
        setInstructor(instructor);
    };
    return (
        <Wrapper title="My courses">
            <div className={styles.myCourses}>
                <Row className={styles.filter} gutter={24}>
                    <Col span={5} className={styles.sortCont}>
                        {loading ? (
                            <div></div>
                        ) : (
                            <Form layout="vertical" className={styles.sortForm}>
                                <div className={styles.label}>Sort by</div>
                                <Form.Item
                                    className={styles.formItem}
                                >
                                    <Select value={sort} onChange={handleSort} size="large" style={{ width: 150 }}
                                        dropdownStyle={{
                                            width: 'auto !important',
                                            minWidth: 150
                                        }}
                                        dropdownClassName={styles.dropdown}
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
                        )}
                        </Col>  
                    <Col span={19} className={styles.filterCont}>
                        {filterLoading ? (
                            <div></div>
                        ) : (
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
                                        
                                    >
                                        <Option value="1">Web Development</Option>
                                        <Option value="2">Business</Option>
                                        <Option value="3">Marketing</Option>
                                        <Option value="4">Design</Option>
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
                                    >
                                        <Option value="not-started">Not Started</Option>
                                        <Option value="incomplete">Incomplete</Option>
                                        <Option value="completed">Completed</Option>
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
                                        dropdownClassName={styles.dropdown}
                                    >
                                        <Option value="1">Luan Nguyen Trong</Option>
                                        <Option value="2">Tan Dinh Minh</Option>
                                        <Option value="3">Nghia Nguyen Trong</Option>
                                        <Option value="4">Manh Le Duc</Option>
                                        <Option value="5">Phuoc Nguyen Ho Minh</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item className={classnames(styles.formItem, styles.btn)}>
                                    <Button type="primary" >Filter</Button>
                                    <Button  className={styles.resetBtn}>Reset</Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Col>
                </Row>
            </div>
        </Wrapper>
    )
};

export default MyCourses;