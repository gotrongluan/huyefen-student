import React from 'react';
import { Row } from 'antd';
import styles from './index.less';

const JumpotronWrapper = ({ title, children }) => {
    return (
        <Row className={styles.jumpotronWrapper}>
            <Row className={styles.jumpotron}>
                <div className={styles.title}>
                    {title}
                </div>
            </Row>
            <Row className={styles.content}>
                <div>{children}</div>
            </Row>
        </Row>
    )
};

export default JumpotronWrapper;