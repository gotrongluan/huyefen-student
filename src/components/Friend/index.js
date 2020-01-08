import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Card, Avatar } from 'antd';
import styles from './index.less';

const { Meta } = Card;

const Friend = ({ friend }) => {
    return (
        <Card
            className={styles.friend}
            hoverable
            style={{ width: '100%', borderRadius: '6px' }}
        >
            <Meta
                avatar={<Avatar src={friend.avatar} alt="avatar" size={48} />}
                title={<Link to="/teaching">{friend.name}</Link>}
                description={friend.numOfMutualFriends ? `${friend.numOfMutualFriends} ${formatMessage({ id: 'friend.mutualfriends' })}` : ``}
            />
        </Card>
    );
};

export default Friend;