import React from 'react';
import styles from './index.less';

const ErrorLayout = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.inlineDiv}>
                <div className={styles.title}>
                    Oops!
                </div>
                <div className={styles.children}>{children}</div>
            </div>
        </div>
    )
};

export default ErrorLayout;