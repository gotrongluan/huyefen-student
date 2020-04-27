import React from 'react';
import { Skeleton } from 'antd';
import classNames from 'classnames';
import styles from './Course.less';

export default () => {
    return (
        <div className={styles.courseSkeleton}>
            <div className={classNames(styles.avatar, styles.skeletonBox)} />
            <div className={styles.info}>
                <div className={classNames(styles.name, styles.skeletonBox)} />
                <div className={classNames(styles.authors, styles.skeletonBox)} />
                <div className={classNames(styles.price, styles.skeletonBox)} />
            </div>
        </div> 
    );
}