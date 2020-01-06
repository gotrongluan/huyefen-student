import React from 'react';
import _ from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Popover, Dropdown, Menu, Empty } from 'antd';
import Spin from '@/elements/spin/secondary';
import CATEGORIES from '@/assets/fakers/categories';
import styles from './index.less';

const { SubMenu } = Menu;
const MenuItem = Menu.Item;

const Categories = () => {

    let categories = CATEGORIES;
    let loading = false;

    const trigger = (
        <Button type="primary" icon="down" size="default">{formatMessage({ id: 'header.cate.trigger' })}</Button>
    );

    if (!categories || _.isEmpty(categories) || loading) {
        let content;
        if (loading)
            content = (
                <Spin
                    spinning
                    fontSize={8}
                    isCenter
                >
                    <div className={styles.loading}></div>
                </Spin>
            );
        else 
            content = (
                <div className={styles.empty}>
                    <div className={styles.inlineDiv}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={formatMessage({ id: 'header.cate.empty' })}/>
                    </div>
                </div>
            );
        return (
            <Popover
                placement="bottomRight"
                content={content}
                popupClassName={styles.popover}
                trigger="click"    
            >
                {trigger}
            </Popover>
        )
    }

    const parseCategories = categories => {
        if (!categories) return null;
        return categories.map(cate => cate.children ? (
            <SubMenu key={cate.label} title={formatMessage({ id: cate.name })} className={styles.cateItem}>
                {parseCategories(cate.children)}
            </SubMenu>
        ) : (
            <MenuItem key={cate.label} className={styles.cateItem}>{formatMessage({ id: cate.name })}</MenuItem>
        ));
    };

    return (
        <Dropdown
            trigger={['click']}
            overlayClassName={styles.overlay}
            overlay={(
                <Menu>
                    {parseCategories(categories)}
                </Menu>
            )}
        >
            {trigger}
        </Dropdown>
    );
}

export default Categories;