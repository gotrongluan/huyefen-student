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
                {(lecture, loading) => (
                    <div className={styles.container}>
                        {!lecture || loading ? (
                            <div className={styles.loading}>
                                <Spin tip="Fetching..." />
                            </div>
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: lecture.content }}/>
                        )}
                    </div>
                )}
            </Lecture>
        </div>
    )
};

export default ArticleLecture;