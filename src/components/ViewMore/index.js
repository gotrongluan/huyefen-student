import React, { useState, useEffect, useRef } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

const ViewMore = ({ height, children }) => {
    const mainDiv = useRef(null);
    const [innerHeight, setInnerHeight] = useState(height);
    const [action, setAction] = useState(0);
    useEffect(() => {
        const divEl = mainDiv.current;
        if (divEl.scrollHeight > height) {
            setAction(1);
        }
        else {
            setAction(0);
            setInnerHeight('auto');
        }
    }, [height]);
    let actionCmp;
    if (action === 0) actionCmp = null;
    else if (action === 1) {
        actionCmp = (
            <div onClick={() => {
                setInnerHeight('auto');
                setAction(2);
            }}>
                <Icon type="plus" />
                <span className={styles.title}>See more</span>
            </div>
        );
    }
    else {
        actionCmp = (
            <div onClick={() => {
                setInnerHeight(height);
                setAction(1);
            }}>
                <Icon type="minus" />
                <span className={styles.title}>See less</span>
            </div>
        );
    }
    return (
        <React.Fragment>
            <div
                style={{
                    height: innerHeight,
                    overflowY: 'hidden'
                }}
                className={styles.main}
                ref={mainDiv}
            >
                {children}
            </div>
            <div className={styles.action}>
                {actionCmp}
            </div>
        </React.Fragment>
    );
};

export default ViewMore;