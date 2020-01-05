import React from 'react';
import Spin from '@/elements/spin/primary';
import logo from '@/assets/images/logo_trans.png';
import styles from './index.less';

export default () => {
    return (
        <div className={styles.pageLoading}>
            <div className={styles.spinContainer}>
                <div className={styles.brand}>
                    <img alt="Logo" src={logo} />
                </div>
                <Spin fontSize={20} margin={4} />
            </div>
        </div>
    )
};