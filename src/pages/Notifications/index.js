import React, { useState } from 'react';
import _ from 'lodash';
import { List, Button, Avatar, Skeleton } from 'antd';
import Wrapper from '@/components/JumpotronWrapper';
import Spin from '@/elements/spin/secondary';
import { fromNow } from '@/utils/utils';
import NOTIFICATIONS from '@/assets/fakers/notifications';
import styles from './index.less';

const Notifications = () => {
    const [loading, setLoading] = useState(false);
    let [notifications, setNotifications] = useState(NOTIFICATIONS);
    const initLoading = false;
    const handleViewNotify = item => {};
    const handleLoadmore = () => {
        //fetch api;
        setLoading(true);    //fetch api
        setTimeout(() => {
            setNotifications([...notifications, ...NOTIFICATIONS]);
            setLoading(false);
        }, 1400);
    };
    const loadMore = (
        !initLoading && !loading ? (
            <div className={styles.loadMore}>
                <Button type="default" size="small" onClick={handleLoadmore}>More notifications</Button>
            </div>
        ) : null
    );
    if (loading) {
        const skeletonData = [
            {
                key: _.uniqueId('noti_loading_'),
                seen: false,
                loading: true
            },
            {
                key: _.uniqueId('noti_loading_'),
                seen: false,
                loading: true
            }
        ]
        notifications = notifications ? _.concat(notifications, skeletonData) : null;
    }
    
    return (
        <Wrapper title="Notifications">
            <div className={styles.notifications}>
                <div className={styles.markAllAsRead}>
                    <Button type="primary">Mark all as read</Button>
                </div>
                <div className={styles.listCont}>
                    <List
                        loading={initLoading}
                        dataSource={notifications}
                        itemLayout="horizontal"
                        loadMore={loadMore}
                        rowKey={item => (item._id || item.key) + _.uniqueId('noti_')}
                        renderItem={item => (
                            <div className={!item.loading ? styles.notiItem : styles.loadingItem} onClick={!item.loading ? () => handleViewNotify(item) : () => {}}>
                                    <List.Item style={{ background: (item.seen ? 'inherit' : 'rgba(250, 218, 94, 0.05)'), paddingLeft: 20, paddingRight: 20 }}>
                                        <Skeleton active title={false} avatar loading={item.loading}
                                            paragraph={{
                                                rows: 2,
                                                width: ['60%', '40%']
                                            }}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.avatar} size={36} />}
                                                title={<span>{item.content}</span>}
                                                description={<span style={{ fontSize: 13, color: 'gray'}}>{ fromNow(item.createdAt) }</span>}
                                            />
                                        </Skeleton>
                                    </List.Item>
                                
                            </div>
                        )}
                    />
                </div>
            </div>
        </Wrapper>
    )
};

export default Notifications;