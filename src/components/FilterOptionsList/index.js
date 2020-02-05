import React, { useState } from 'react';
import _ from 'lodash';
import { Icon } from 'antd';
import styles from './index.less';

const FilterOptionsList = ({ rowKey, dataSource, renderItem, initialCount, stepCount }) => {
    const [currentCount, setCurrentCount] = useState(_.min([initialCount, dataSource.length]));
    return (
        <div className={styles.container}>
            <div className={styles.data}>
                {_.map(_.slice(dataSource, 0, currentCount), data => <React.Fragment key={rowKey(data)}>{renderItem(data)}</React.Fragment>)}
            </div>
            {dataSource.length > currentCount && (
                <div className={styles.seeMore} onClick={() => setCurrentCount(_.min([dataSource.length, currentCount + stepCount]))}>
                    <Icon type="plus" />
                    <span className={styles.text}>See more</span>
                </div>
            )}
        </div>
    )
};

export default FilterOptionsList;