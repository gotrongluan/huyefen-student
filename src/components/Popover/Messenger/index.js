import React, { useState } from 'react';
import _ from 'lodash';
import Link from 'umi/link';
import { Popover, List, Badge, Avatar, Icon, Empty, Spin as Loading } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Spin from '@/elements/spin/secondary';
import { fromNow, truncate } from '@/utils/utils';
import MESSAGES from '@/assets/fakers/messages';
import styles from './index.less';

const Messenger = () => {
    const [visible, setVisible] = useState(false);

    const getContent = () => {
        // let {
        //     messengerPopover: messages,
        //     loading,
        //     //oldLoading
        // } = this.props;
        let messages = MESSAGES;
        let loading = false;
        let oldLoading = false;
        //sort messages
        messages = messages === null ? messages : _.orderBy(messages, ['updatedAt'], ['desc']);
        //messages = messages ? _.take(messages, 5) : null;
        const content = (messages === null || _.isEmpty(messages)) ? (
            <div className={styles.empty}>
                <div className={styles.inlineDiv}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No conversation"/>
                </div>
            </div>
        ) : (
            <Scrollbars autoHeight autoHeightMax={437} onScroll={handleScroll}>
                <List
                    className={styles.messagesList}
                    dataSource={messages}
                    rowKey={item => item._id + _.uniqueId("messenger_popover_")}
                    renderItem={item => (
                        <List.Item
                            className={styles.item}
                            style={{ background: (!item.unseen ? 'inherit' : 'rgba(250, 218, 94, 0.05)')}}
                            extra={<span style={{ fontSize: '0.9em', color: 'gray' }}>{ fromNow(item.updatedAt) }</span>}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} size={36} />}
                                title={<span>{truncate(item.name, 46)}</span>}
                                description={<span>{truncate(item.lastMessage, 46)}</span>}
                            />
                        </List.Item>
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
                spinning={loading || messages === null}
                fontSize={8}
                isCenter
            >
                <div>{content}</div>
                <div className={styles.viewAll} onClick={handleViewAll}><Link to="/messenger">View all</Link></div>
            </Spin>
        );
    };

    const handleVisibleChange = visible => setVisible(visible);

    const handleScroll = e => {
        const element = e.srcElement;
        if (element.scrollTop === element.scrollHeight - 437) {
            
        }
    }

    const handleViewAll = () => setVisible(false);

    const unread = 14;
    let count = 0;
    if (unread > 0)
        count = <Avatar style={{ background: 'red', fontSize: '11px' }} size={18}>{unread > 9 ? '9+' : unread}</Avatar>;
    const trigger = (
        <span className={styles.trigger}>
            <Badge
                count={count}
                style={{ boxShadow: 'none' }}
                className={styles.badge}
            >
                <Icon type="message" style={{ fontSize: 16 }}/>
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
            visible={visible}
            popupAlign={{ offset: [20, 10] }}
            onVisibleChange={handleVisibleChange}
        >
            {trigger}
        </Popover>
    );
}

export default Messenger;