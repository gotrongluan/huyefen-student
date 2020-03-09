import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import classNames from 'classnames';
import { Rate, Input, Row, Col, Divider, Skeleton, Button, Spin, Icon } from 'antd';
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
    const [status, setStatus] = useState({});
    useEffect(() => {
        dispatch({
            type: 'learning/fetchInstructorReviews',
            payload: courseId
        });
        return () => dispatch({ type: 'learning/resetInstructorReviews' });
    }, [courseId]);
    useEffect(() => {
        if (instructors) {
            let statusData = {};
            _.forEach(instructors, instructor => {
                statusData = {
                    ...statusData,
                    [instructor._id]: 0
                }
            });
            setStatus({...statusData});
        }
    }, [instructors]);
    return (
        <div className={styles.instructors}>
            {!instructors || loading ? (
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
                    {_.map(instructors, (instructor, i) => (
                        <React.Fragment key={instructor._id}>
                            {i > 0 && (<Divider dashed className={styles.divider} />)}
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
                                            style={{ background: '#fada5e', color: 'white', fontSize: '52px' }}
                                        />
                                    </div>
                                    <div className={classNames(styles.stat, styles.numReviews)}>
                                        <Icon type="block" />
                                        <span className={styles.value}>{`${numberWithCommas(instructor.numOfReviews)} reviews`}</span>
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
                                    <div className={styles.starRating}>
                                        {status[instructor._id] === 0 ? (
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
                                            <Rate

                                            />
                                        )}
                                    </div>
                                    <div className={styles.content}>
                                        {status[instructor._id] === 0 ? (
                                            <TextArea
                                                placeholder="Rating comment"
                                                rows={6}
                                                value={instructor.ratingContent || ''}
                                            />
                                        ) : (
                                            <TextArea
                                                placeholder="Rating comment"
                                                rows={6}
                                                value={instructor.ratingContent || ''}
                                            />
                                        )}
                                    </div>
                                </Col>
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