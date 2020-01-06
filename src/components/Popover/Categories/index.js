import React from 'react';
import _ from 'lodash';
import { FormattedMessage as locale } from 'umi-plugin-react/locale';
import { Button, Popover, Dropdown, Menu, Empty } from 'antd';
import Spin from '@/elements/spin/secondary';
import CATEGORIES from '@/assets/fakers/categories';
import styles from './index.less';

const { SubMenu } = Menu;
const MenuItem = Menu.Item;

const Categories = () => {
    let loading = false;
    let categories = null;
    const trigger = (
        <Button type="primary" icon="down" size="default">{locale({ id: 'menu.cate.button' })}</Button>
    );

    if (!categories || _.isEmtpy(categories) || loading) {
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
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={locale({ id: 'header.cate.empty' })}/>
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
    return trigger;
}

export default Categories;