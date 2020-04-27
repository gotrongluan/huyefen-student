import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import router from 'umi/router';
import { List, Avatar, Skeleton, Button, Card } from 'antd';
import Friend from '@/components/Friend';
import Spin from '@/elements/spin/secondary';
import Wrapper from '@/components/JumpotronWrapper';
import LoadMore from '@/components/LoadMoreButton';
import { loadingData } from '@/utils/utils';
import styles from './index.less';

const MyFriends = ({ dispatch, ...props }) => {
    let {
        friends,
        loading,
        initLoading,
        hasMore
    } = props;
    useEffect(() => {
        dispatch({
            type: 'friends/fetch'
        });
        return () => dispatch({
            type: 'friends/reset'
        });
    }, []);
    const handleMoreFriends = () => {
        dispatch({
            type: 'friends/more'
        });
    };
    const handleAllFriends = () => {
        dispatch({
            type: 'friends/all'
        });
    };
    const loadMore = (
        <LoadMore
            when={!loading && !initLoading && friends && hasMore}
            onMore={handleMoreFriends}
            onAll={handleAllFriends}
            className={styles.loadMore}
            itemName="friend"
        />
    );
    if (loading) friends = loadingData(friends, 'friend_loading_', 3);
    return (
        <Wrapper title="My friends">
            <div className={styles.myFriends}>
                <Spin spinning={initLoading} fontSize={8} isCenter>
                    <List
                        dataSource={!friends ? [] : friends}
                        rowKey={item => (item._id || item.key) + _.uniqueId('friend_')}
                        loadMore={loadMore}
                        grid={{
                            column: 3,
                            gutter: 16
                        }}
                        
                        renderItem={item => (
                            <div className={!item.loading ? styles.friendItem : styles.loadingItem} onClick={!item.loading ? () => router.push(`/friend/${item._id}` ) : () => {}}>
                                <List.Item style={{ paddingLeft: 12, paddingRight: 12 }}>
                                    {item.loading ? (
                                        <Card
                                            style={{ width: '100%', borderRadius: '6px' }}
                                        >
                                            <Skeleton active title={false} avatar loading={item.loading} className={styles.skeletonCard}
                                                paragraph={{
                                                    rows: 2,
                                                    width: ['60%', '80%']
                                                }}
                                            />
                                        </Card>
                                    ) : (
                                        <Friend friend={item} />
                                    )}     
                                </List.Item>
                                
                            </div>
                        )}
                    />
                </Spin>
            </div>
        </Wrapper>
    )
};

export default connect(
    ({ friends, loading }) => ({
        friends: friends.list,
        hasMore: friends.hasMore,
        loading: !!loading.effects['friends/more'] || !!loading.effects['friends/all'],
        initLoading: !!loading.effects['friends/fetch']
    })
)(MyFriends);