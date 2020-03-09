import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Rate, Input, Row, Divider, Skeleton, Button, Spin, Icon } from 'antd';
import UserAvatar from '@/components/Avatar';
import styles from './InstructorReview.less';

const InstructorReview = ({ dispatch, match, ...props }) => {
    const { courseId } = match.params;
    const {
        instructors,
        loading
    } = props;
    return (
        <div className={styles.instructors}>
            {!instructors || loading ? (
                <div className={styles.loading}>
                    <div className={styles.user}>
                        <Skeleton active avatar={{ shape: 'circle', size: 80 }} title={{ width: '25%' }} paragraph={{ rows: 1, width: ['20%']}}/>
                    </div>
                    <div className={styles.spin}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: '44px', color: '#fada5e' }} />} tip="Fetching..." />
                    </div>
                </div>
            ) : (
                <div />
            )}
        </div>
    )
};

export default connect(
    ({ learning, loading }) => ({
        instructors: learning.instructors,
        loading: !!loading.effects['learning/fetchInstructors'],
        // submitLoading: !!loading.effects['learning/rateInstructor']
    })
)(InstructorReview);