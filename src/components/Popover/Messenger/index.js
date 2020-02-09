import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import { Popover, List, Badge, Avatar, Icon, Empty, Spin as Loading } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Spin from '@/elements/spin/secondary';
import { fromNow, truncate } from '@/utils/utils';
import styles from './index.less';

const Messenger = ({ dispatch, ...props }) => {
    const scrollEleRef = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        return () => dispatch({
            type: 'messages/reset'
        });
    }, []);
    const getContent = () => {
        let {
            conversations,
            loading,
            initLoading
        } = props;
        //sort conversations
        conversations = conversations === null ? conversations : _.orderBy(conversations, ['updatedAt'], ['desc']);
        //conversations = conversations ? _.take(conversations, 5) : null;
        const content = (conversations === null || _.isEmpty(conversations)) ? (
            <div className={styles.empty}>
                <div className={styles.inlineDiv}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={formatMessage({ id: 'header.messenger.empty' })}/>
                </div>
            </div>
        ) : (
            <Scrollbars ref={scrollEleRef} autoHeight autoHeightMax={437} onScroll={handleScroll} className={styles.scrollEle}>
                <List
                    className={styles.conversationsList}
                    dataSource={conversations}
                    rowKey={item => item._id + _.uniqueId("messenger_")}
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
                {loading && (
                    <div className={styles.oldLoading}>
                        <Loading indicator={<Icon type="loading" style={{ fontSize: 18 }} spin />} />
                    </div>
                )}
            </Scrollbars>
        );
        return (
            <Spin
                spinning={initLoading || conversations === null}
                fontSize={8}
                isCenter
            >
                <div>{content}</div>
                <div className={styles.viewAll} onClick={handleViewAll}>{formatMessage({ id: 'header.messenger.viewall' })}</div>
            </Spin>
        );
    };

    const handleVisibleChange = visible => {
        const { conversations } = props;
        setVisible(visible);
        if (visible && !conversations) {
            dispatch({
                type: 'messages/fetch'
            });
        }
        else if (!visible) {
            if (scrollEleRef.current) scrollEleRef.current.scrollToTop();
        }
    };

    const handleScroll = e => {
        const { initLoading, hasMore, loading } = props;
        const element = e.srcElement;
        if (element.scrollTop === element.scrollHeight - 437) {
            if (!initLoading && !loading && hasMore) {
                dispatch({
                    type: 'messages/more'
                });
            }
        }
    };

    const handleViewAll = () => {
        router.push('/messenger');
        handleVisibleChange(false);
    };

    const unread = 14;
    let count = 0;
    if (unread > 0)
        count = <Avatar style={{ background: '#FE7F9C', fontSize: '11px' }} size={16}>{unread > 9 ? '9+' : unread}</Avatar>;
    const trigger = (
        <span className={styles.trigger}>
            <Badge
                count={count}
                style={{ boxShadow: 'none' }}
                className={styles.badge}
            >
                <Icon type="message" style={{ fontSize: 18 }}/>
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

export default connect(
    ({ loading, messages }) => ({
        initLoading: !!loading.effects['messages/fetch'],
        loading: !!loading.effects['messages/more'],
        conversations: messages.list,
        hasMore: messages.hasMore
    })
)(Messenger);