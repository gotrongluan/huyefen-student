import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import classNames from 'classnames';
import styles from './index.less';

export default ({ type, style }) => {
    let featuredClass;
    switch (type) {
        case 'course.bestseller':
            featuredClass = styles.bestseller;
            break;
        case 'course.highrated':
            featuredClass = styles.highrated;
            break;
        case 'course.hotandnew':
            featuredClass = styles.hotandnew;
            break;
        default:
            featuredClass = styles.bestsellerandhighrated;
    }

    return (
        <span className={classNames(styles.featuredBadge, featuredClass)} style={style}>
            {formatMessage({ id: type })}
        </span>
    )
};