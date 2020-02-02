import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Link from 'umi/Link';
import { Skeleton, Icon, Modal, Spin } from 'antd';
import styles from './Lecture.less';

const Lecture = () => {
    const [lecture, setLecture] = useState(null);
    const [initLoading, setInitLoading] = useState(false);
    return (
        <div className={styles.lecture}>
            {!lecture || initLoading ? (
                <div className={styles.loading}>
                    <Skeleton className={styles.titleSkeleton} active title={null} paragraph={{ rows: 1, width: '96%' }} />
                    <Skeleton active title={null} paragraph={{ rows: 1, width: '42%' }} />
                    <div className={styles.spin}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: 64 }} spin />} />
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
};

export default Lecture;