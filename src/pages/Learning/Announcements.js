import React, { useState, useEffect } from 'react';
import { Skeleton, Avatar, Row, Col, Input, List, Button } from 'antd';
import ANNOUNCEMENTS from '@/assets/fakers/announcements';
import styles from './Announcements.less';

const LoadingAnnouncement = () => {
    return (
        <div className={styles.loadingAnnouncement}>
            <Skeleton active title={null} paragraph={{ rows: 2, width: ['98%', '62%'] }} avatar={{ size: 60, shape: 'circle' }} />
        </div>
    )
};

const Announcements = () => {
    const [announcements, setAnnouncements] = useState(null);
    const [initLoading, setInitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     setInitLoading(true);
    //     setTimeout(() => {
    //         setAnnouncements(ANNOUNCEMENTS);
    //         setInitLoading(false);
    //     }, 1200);
    // }, []);
    const handleMoreAnnouncements = () => {

    };

    const loadMore = (
        (!initLoading && !loading && announcements && announcements.loadMore) ? (
            <div className={styles.loadMore}>
                <Button size="small" onClick={handleMoreAnnouncements}>More announcements</Button>
            </div>
        ) : null
    );
    return (
        <div className={styles.announcements}>
            {!announcements || initLoading ? (
                <>
                    <LoadingAnnouncement />
                    <div style={{ height: 40 }}/>
                    <LoadingAnnouncement />
                </>
            ) : (
                <div></div>
            )}
        </div>
    )
};

export default Announcements;