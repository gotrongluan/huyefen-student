import React, { useState } from 'react';
import _ from 'lodash';
import router from 'umi/router';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Popover, Empty, Cascader, message } from 'antd';
import Spin from '@/elements/spin/secondary';
import styles from './index.less';


const Categories = ({ dispatch, ...props}) => {
    const [popupVisible, setPopupVisible] = useState(false);
    const { areas, loading } = props;
    const getCascaderOptions = (areas) => {
        return _.map(areas, area => {
            return {
                label: area.title,
                value: `area/${area._id}`,
                children: _.map(area.categories, category => ({
                    label: category.title,
                    value: `category/${area._id}/${category._id}`
                }))
            }
        });
    };

    const trigger = (
        <Button type="primary" icon="down" size="default">{formatMessage({ id: 'header.cate.trigger' })}</Button>
    );

    if (!areas || _.isEmpty(areas) || loading) {
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
                placement="bottomLeft"
                content={content}
                popupClassName={styles.popover}
                trigger="click"
                visible={popupVisible}
                onVisibleChange={setPopupVisible}  
            >
                {trigger}
            </Popover>
        )
    }
    return (
        <Cascader
            options={getCascaderOptions(areas)}
            expandTrigger='hover'
            onChange={value => router.push(`/courses/${value[value.length - 1]}`)}
            popupClassName={styles.cascader}
            changeOnSelect
            popupVisible={popupVisible}
            onPopupVisibleChange={setPopupVisible}
        >
            {trigger}
        </Cascader>
    )
}

export default connect(
    ({ settings, loading }) => ({
        areas: settings.areasMenu,
        loading: loading.effects['settings/fetch']
    })
)(Categories);