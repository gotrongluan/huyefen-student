import React from 'react';
import { Spin } from 'antd';
import Lecture from './Lecture';
import styles from './ArticleLecture.less';

const ArticleLecture = () => {
    return (
        <div className={styles.article}>
            <Lecture
                type={1}
            >
                {(loading, content) => (
                    <div className={styles.container}>
                        {loading ? (
                            <div className={styles.loading}>
                                <Spin tip="Fetching..." />
                            </div>
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: content }}/>
                        )}
                    </div>
                )}
            </Lecture>
        </div>
    )
};

export default ArticleLecture;