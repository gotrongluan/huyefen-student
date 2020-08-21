import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import classNames from 'classnames';
import { Rate, Input, Row, Col, Divider, Skeleton, Button, Spin, Icon, Tooltip } from 'antd';
import UserAvatar from '@/components/Avatar';
import { numberWithCommas, roundStarRating } from '@/utils/utils';
import styles from './InstructorReview.less';

const { TextArea } = Input;

const InstructorReview = ({ dispatch, match, ...props }) => {
    const { courseId } = match.params;
    const {
        instructors,
        loading
    } = props;
    const [data, setData] = useState({});
    useEffect(() => {
        dispatch({
            type: 'learning/fetchInstructorReviews',
            payload: courseId
        });
        return () => dispatch({ type: 'learning/resetInstructorReviews' });
    }, [courseId]);
    useEffect(() => {
        if (instructors && _.isEmpty(data)) {
            let renderData = {};
            _.forEach(instructors, instructor => {
                renderData = {
                    ...renderData,
                    [instructor._id]: {
                        ...instructor,
                        fakeStarRating: instructor.starRating,
                        fakeRatingContent: instructor.ratingContent,
                        status: 0,
                        loading: false
                    }
                }
            });
            setData({...renderData});
        }
    }, [instructors]);
    const handleEdit = instructorId => setData({
        ...data,
        [instructorId]: {
            ...data[instructorId],
            status: 1
        }
    });
    const handleRating = (instructorId, value) => setData({
        ...data,
        [instructorId]: {
            ...data[instructorId],
            fakeStarRating: value
        }
    });
    const handleChangeContent = (instructorId, value) => setData({
        ...data,
        [instructorId]: {
            ...data[instructorId],
            fakeRatingContent: value
        }
    });
    const handleCancelEdit = (instructorId, index) => setData({
        ...data,
        [instructorId]: {
            ...data[instructorId],
            status: 0,
            fakeRatingContent: data[instructorId].ratingContent,
            fakeStarRating: data[instructorId].starRating
        }
    });
    const handleSaveEdit = instructorId => {
        setData({
            ...data,
            [instructorId]: {
                ...data[instructorId],
                loading: true
            }
        });
        dispatch({
            type: 'learning/reviewInstructor',
            payload: {
                courseId,
                instructorId,
                starRating: data[instructorId].fakeStarRating,
                ratingContent: data[instructorId].fakeRatingContent,
                callback: () => setData(data => ({
                    ...data,
                    [instructorId]: {
                        ...data[instructorId],
                        loading: false,
                        status: 0,
                        starRating: data[instructorId].fakeStarRating,
                        ratingContent: data[instructorId].fakeRatingContent
                    }
                }))
            }
        });
    }
    return (
        <div className={styles.instructors}>
            {!instructors || loading || _.isEmpty(data) ? (
                <div className={styles.loading}>
                    <div className={styles.user}>
                        <Skeleton active avatar={{ shape: 'circle', size: 96 }} title={{ width: '35%' }} paragraph={{ rows: 2, width: ['30%', '17%']}}/>
                    </div>
                    <div className={styles.spin}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: '64px', color: '#fada5e' }} />} />
                        <div className={styles.text}>Fetching...</div>
                    </div>
                </div>
            ) : (
                <React.Fragment>
                    {_.map(data, (instructor, index) => (
                        <React.Fragment key={instructor._id}>
                            {index > 0 && (<Divider dashed className={styles.divider} />)}
                            <Row className={styles.instructor}>
                                <Col span={4} className={styles.summary}>
                                    <div className={styles.avatarCont}>
                                        <UserAvatar
                                            src={instructor.avatar}
                                            size={93}
                                            textSize={96}
                                            alt="ins-ava"
                                            text={instructor.name}
                                            borderWidth={3}
                                            style={{ background: '#fada5e', color: 'white', fontSize: '44px' }}
                                        />
                                    </div>
                                    <div className={classNames(styles.stat, styles.students)}>
                                        <Icon type="user" />
                                        <span className={styles.value}>{`${numberWithCommas(instructor.numOfStudents)} students`}</span>
                                    </div>
                                    <div className={classNames(styles.stat, styles.courses)}>
                                        <Icon type="read" />
                                        <span className={styles.value}>{`${numberWithCommas(instructor.numOfCourses)} courses`}</span>
                                    </div>
                                </Col>
                                <Col span={20} className={styles.detail}>
                                    <div className={styles.name}>{instructor.name}</div>
                                    <Spin spinning={instructor.loading}>
                                        <div className={styles.starRating}>
                                            {instructor.status === 0 ? (
                                                <React.Fragment>
                                                    <Rate
                                                        tooltips={['terrible', 'bad', 'normal', 'good', 'wonderful']}
                                                        value={(instructor.starRating && roundStarRating(instructor.starRating)) || 0}
                                                        disabled
                                                        allowHalf
                                                        className={styles.stars}
                                                    />
                                                    <span className={styles.ratingVal}>{instructor.starRating}</span>
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <Rate
                                                        tooltips={['terrible', 'bad', 'normal', 'good', 'wonderful']}
                                                        allowHalf
                                                        className={styles.stars}
                                                        value={(instructor.fakeStarRating && roundStarRating(instructor.fakeStarRating)) || 0}
                                                        onChange={val => handleRating(instructor._id, val)}
                                                    />
                                                    <span className={styles.ratingVal}>{instructor.fakeStarRating}</span>
                                                </React.Fragment>
                                            )}
                                        </div>
                                        <div className={styles.content}>
                                            {instructor.status === 0 ? (
                                                <TextArea
                                                    placeholder="Rating comment"
                                                    rows={6}
                                                    value={instructor.ratingContent || ''}
                                                    className={styles.disabled}
                                                />
                                            ) : (
                                                <TextArea
                                                    placeholder="Rating comment"
                                                    rows={6}
                                                    value={instructor.fakeRatingContent || ''}
                                                    onChange={e => handleChangeContent(instructor._id, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </Spin>
                                    {instructor.status === 1 && (
                                        <div className={styles.btns}>
                                            <Button className={styles.cancel} disabled={instructor.loading} onClick={() => handleCancelEdit(instructor._id, index)}>
                                                Cancel
                                            </Button>
                                            <Button className={styles.save} loading={instructor.loading} type="primary" onClick={() => handleSaveEdit(instructor._id)}>
                                                Save
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                                {instructor.status === 0 && (
                                    <div className={styles.action}>
                                        <Tooltip title="Edit review" placement="bottom">
                                            <Icon type="edit" theme="filled" className={styles.btn} onClick={() => handleEdit(instructor._id)}/>
                                        </Tooltip>
                                    </div>
                                )}
                            </Row>
                        </React.Fragment>
                    ))}
                </React.Fragment>
            )}
        </div>
    )
};

export default connect(
    ({ learning, loading }) => ({
        instructors: learning.instructorReviews,
        loading: !!loading.effects['learning/fetchInstructors'],
        // submitLoading: !!loading.effects['learning/rateInstructor']
    })
)(InstructorReview);