import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import { Row } from 'antd';
import background from '@/assets/images/background-login.svg';
import styles from './index.less';

const UserLayout = ({ children }) => {
    return (
        <Row className={styles.userLayout} style={{ background: `url(${background})` }}>
            <Row className={styles.inlineDiv}>
                <div className={styles.title}>
                    <div className={styles.huyefen} onClick={() => router.push('/')}>HuYeFen</div>
                    <div className={styles.slogan}>
                        {formatMessage({ id: 'userLayout.slogan1' })}
                    </div>
                    <div className={styles.slogan}>
                        {formatMessage({ id: 'userLayout.slogan2' })}
                    </div>
                </div>
                <div className={styles.child}>
                    {children}
                </div>
            </Row>
        </Row>
    )
};

export default UserLayout;