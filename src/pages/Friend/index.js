import React from 'react';
import { Row, Avatar, Skeleton, Button, Icon } from 'antd';
import styles from './index.less';

const Friend= ({ title, children }) => {
    const friend = {
        name: 'Ngọc Hạnh Vương',
        avatar: 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/51059227_2091470127614437_5419405170205261824_o.jpg?_nc_cat=106&_nc_ohc=LnSzD5KUUN4AX8EolVa&_nc_ht=scontent.fdad1-1.fna&oh=95b1eba87a97f6266a625c07caf68566&oe=5EAE6D56',
        status: 3
    };
    let icon;
    let relText;
    switch (friend.status) {
        case 1:             //no friend
            icon = "user-add";
            relText = "Add friend";
            break;
        case 2:
            icon = "clock-circle";
            relText = "Sented invitation"
            break;
        case 3:
            icon = "user-delete";
            relText = "Cancel friend";
            break;
        default:
            icon = "user";
    };

    return (
        <Row className={styles.friend}>
            <Row className={styles.jumpotron}>
                <div className={styles.info}>
                    <div className={styles.avatarCont}><Avatar size={120} shape="circle" className={styles.avatar} src={friend.avatar} /></div>
                    <div className={styles.name}>
                        {friend.name}
                    </div>
                    <div className={styles.actions}>
                        <Button.Group>
                            <Button type="primary" icon={icon} shape="round">
                                {relText}
                            </Button>
                            <Button type="primary" icon="message" shape="round">
                                Chat
                            </Button>
                        </Button.Group>
                    </div>
                </div>
            </Row>
            <Row className={styles.content}>
                
            </Row>
        </Row>
    )
};

export default Friend;