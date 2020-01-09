import React, { useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import { Row, Col, Icon } from 'antd';
import Wrapper from '@/components/JumpotronWrapper';
import styles from './index.less';

const menuData = [
    {
        url: '/settings/profile',
        name: formatMessage({ id: 'settings.menu.profile' }),
        icon: 'user'
    },
    {
        url: '/settings/payment-methods',
        name: formatMessage({ id: 'settings.menu.paymentmethods' }),
        icon: 'credit-card'
    },
    {
        url: '/settings/email',
        name: formatMessage({ id: 'settings.menu.email' }),
        icon: 'mail'
    },
    {
        url: '/settings/note-highlight',
        name: formatMessage({ id: 'settings.menu.notehighlight' }),
        icon: 'pushpin'
    }
];

const Settings = ({ location, children }) => {
    const pathname = location.pathname;
    return (
        <Wrapper title={formatMessage({ id: 'settings.title' })}>
            <Row className={styles.settings}>
                <Col span={6} className={styles.menu}>
                    {_.map(menuData, item => {
                        let className;
                        if (item.url === pathname) className = classNames(styles.active, styles.menuItem);
                        else className = styles.menuItem;
                        return(
                            <div className={className} key={item.url} onClick={() => router.push(item.url)}>
                                <Icon type={item.icon} />
                                <span className={styles.name}>{item.name}</span>
                            </div>
                        );
                    })}
                </Col>
                <Col span={18} className={styles.content}>
                    {children}
                </Col>
            </Row>
        </Wrapper>
    )
};

export default Settings;