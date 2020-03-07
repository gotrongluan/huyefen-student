import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Card } from 'antd';
import UserAvatar from '@/components/Avatar';
import UserCheck from '@/elements/icon/userCheck';
import UserSent from '@/elements/icon/userSent';
import styles from './index.less';

const { Meta } = Card;

const Friend = ({ friend, isExtra }) => {
    let extra;
    if (isExtra) {
        if (friend.status === 2) 
            extra = <UserSent />;
        else if (friend.status === 3)
            extra = <UserCheck />
    }
    return (
        <Card
            className={styles.friend}
            hoverable
            style={{ width: '100%', borderRadius: '6px' }}
        >
            <Meta
                avatar={<UserAvatar src={friend.avatar} alt="avatar" size={48} text={friend.name} textSize={48} borderWidth={0} style={{ background: 'white', color: 'black' }} />}
                title={<Link to="/teaching">{friend.name}</Link>}
                description={friend.numOfMutualFriends ? `${friend.numOfMutualFriends} ${formatMessage({ id: 'friend.mutualfriends' })}` : friend.numOfFriends ? `${friend.numOfFriends} friends` : ``}
            />
            {isExtra && (
                <span className={styles.extra}>{extra}</span>
            )}
        </Card>
    );
};

export default Friend;