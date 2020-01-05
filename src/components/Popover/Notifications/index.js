import React, { useState } from 'react';
import _ from 'lodash';
import Link from 'umi/link';
import router from 'umi/router';
import { Popover, List, Badge, Avatar, Icon, Empty, Spin as Loading } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Spin from 'elements/spin/secondary';
import { fromNow, truncate } from 'utils/utils';
import NOTIFICATIONS from '@/assets/fakers/notifications';
import styles from './index.less';

const Notifications = () => {
    const [visible, setVisible] = useState(false);

    const getContent = () => {
        let notifications = NOTIFICATIONS;
        let loading = false;
        let oldLoading = false; 

        const content = (notifications === null || _.isEmpty(notifications)) ? (
            <div className={styles.empty}>
                <div className={styles.inlineDiv}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notification"/>
                </div>
            </div>
        ) : (
            <Scrollbars autoHeight autoHeightMax={474} onScroll={handleScroll}>
                <List
                    dataSource={notifications}
                    rowKey={item => item._id + _.uniqueId("notification_popover_")}
                    renderItem={item => (
                        <div className={styles.notiItem} onClick={() => handleViewNotify(item)}>
                            <List.Item style={{ background: (!item.unseen ? 'inherit' : 'rgba(250, 218, 94, 0.05)')}}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} size={36} />}
                                    title={<span>{truncate(item.content, 92)}</span>}
                                    description={<span style={{ fontSize: 13, color: 'gray'}}>{ fromNow(item.createdAt) }</span>}
                                />
                            </List.Item>
                        </div>
                    )}
                />
                {oldLoading && (
                    <div className={styles.oldLoading}>
                        <Loading indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />} />
                    </div>
                )}
            </Scrollbars>
        );
        return (
            <Spin
                spinning={loading || notifications === null}
                fontSize={8}
                isCenter
            >
                <div>{content}</div>
                <div className={styles.viewAll} onClick={handleViewAll}><Link to="/notifications">View all</Link></div>
            </Spin>
        );
    }

    const handleVisibleChange = visible => setVisible(visible);

    const handleScroll = e => {
        const element = e.srcElement;
        if (element.scrollTop === element.scrollHeight - 437) {
            
        }
    }

    const handleViewAll = () => setVisible(false);

    const handleViewNotify = item => {

    }

    let unread = 0;
    let count = 0;
    if (unread > 0)
        count = <Avatar style={{ background: 'red', fontSize: '11px' }} size={18}>{unread > 99 ? '99+' : unread}</Avatar>;
    const trigger = (
        <span className={styles.trigger}>
            <Badge
                count={count}
                style={{ boxShadow: 'none' }}
                className={styles.badge}
                overflowCount={9}
            >
                <Icon type="bell" style={{ fontSize: 16 }}/>
            </Badge>
        </span>
    );
    const content = getContent();
    if (!content)
        return trigger;
    return (
        <Popover
            placement="bottomRight"
            content={content}
            popupClassName={styles.popover}
            trigger="click"
            arrowPointAtCenter
            popupAlign={{ offset: [20, 10] }}
            onVisibleChange={handleVisibleChange}
            visible={visible}
        >
            {trigger}
        </Popover>
    );
};

export default Notifications;