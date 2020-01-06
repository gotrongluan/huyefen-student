import React, { useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import _ from 'lodash';
import { Menu } from 'antd';
import styles from './index.less';

const MenuItem = Menu.Item;

const CategoriesBar = ({ loading, categories }) => {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [overlayData, setOverlayData] = useState([]);
    if (!categories || _.isEmpty(categories) || loading) return null;
    const handleCloseOverlay = () => {
        setOverlayVisible(false);
    };
    const handleOpenOverlay = data => {
        setOverlayVisible(true);
        if (!data) setOverlayData([]);
        else setOverlayData(_.map(data, cate => _.pick(cate, ['label', 'name'])));
    };

    return (
        <div className={styles.container}>
            <div className={styles.cateBarContainer}> 
                <Menu
                    className={styles.cateBar}
                    mode="horizontal"
                >
                    {_.map(categories, cate => (
                        <MenuItem key={cate.label}>
                            <div
                                className={styles.cateItem}
                                onMouseEnter={() => handleOpenOverlay(cate.children)}
                                onMouseLeave={handleCloseOverlay}
                            >
                                {formatMessage({ id: cate.name })}
                            </div>
                        </MenuItem>
                    ))}
                </Menu>
            </div>
            
            <div className={styles.overlayBar} onMouseEnter={() => setOverlayVisible(true)} onMouseLeave={handleCloseOverlay} style={{ display: overlayVisible ? 'block' : 'none' }}>
                {overlayData && !_.isEmpty(overlayData) && (
                    <Menu
                        mode="horizontal"
                        className={styles.overlay}
                    >
                        {_.map(overlayData, cate => (
                            <MenuItem key={cate.label}>
                                <div className={styles.overlayItem}>{formatMessage({ id: cate.name })}</div>
                            </MenuItem>
                        ))}
                    </Menu>
                )}
            </div>
        </div>
    );
};

export default CategoriesBar;