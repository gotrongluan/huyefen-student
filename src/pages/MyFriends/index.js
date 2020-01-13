import React, { useState } from 'react';
import _ from 'lodash';
import router from 'umi/router';
import { List, Avatar, Skeleton, Button } from 'antd';
import Spin from '@/elements/spin/secondary';
import Wrapper from '@/components/JumpotronWrapper';
import FRIENDS from '@/assets/fakers/friends';
import styles from './index.less';

const MyFriends = () => {
    const [loading, setLoading] = useState(false);                  ///temp
    let [friends, setFriends] = useState(FRIENDS);
    const initLoading = false;
    const handleMoreFriends = () => {
        setLoading(true);
        setTimeout(() => {
            setFriends([...friends, ...FRIENDS]);
            setLoading(false);
        }, 1500);
    };
    const loadMore = (
        !loading && !initLoading && friends ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreFriends}>More friends</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }}>All friends</Button>
            </div>
        ) : null
    );
    if (loading) friends = friends ? _.concat(friends, [{
        key: _.uniqueId('friend_loading_'),
        loading: true
    }, {
        key: _.uniqueId('friend_loading_'),
        loading: true
    }, {
        key: _.uniqueId('friend_loading_'),
        loading: true
    }]) : undefined;
    return (
        <Wrapper title="My friends">
            <div className={styles.myFriends}>
                <Spin spinning={initLoading} fontSize={8} isCenter>
                    <List
                        dataSource={friends}
                        rowKey={item => (item._id || item.key) + _.uniqueId('friend_')}
                        loadMore={loadMore}
                        grid={{
                            column: 3,
                            gutter: 8
                        }}
                        split
                        renderItem={item => (
                            <div className={!item.loading ? styles.friendItem : styles.loadingItem} onClick={!item.loading ? () => router.push(`/friend/${item._id}` ) : () => {}}>
                                <List.Item style={{ paddingLeft: 12, paddingRight: 12 }}>
                                    <Skeleton active title={false} avatar loading={item.loading}
                                        paragraph={{
                                            rows: 2,
                                            width: ['60%', '40%']
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar} size={42} />}
                                            title={<span>{item.name}</span>}
                                            description={<span style={{ fontSize: 13, color: 'gray'}}>
                                                {item.numOfMutualFriends > 0 ? `${item.numOfMutualFriends} mutual friends` : `${item.numOfFriends} friends`}
                                            </span>}
                                        />
                                    </Skeleton>
                                </List.Item>
                                
                            </div>
                        )}
                    />
                </Spin>
            </div>
        </Wrapper>
    )
};

export default MyFriends;