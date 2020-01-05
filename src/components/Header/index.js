import React from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { Layout, Row, Col, Input, Popover, Divider, Avatar, message } from 'antd';
// import Categories from '@/components/Popover/Categories';
// import MyCourses from '@/components/Popover/MyCourses';
// import Cart from '@/components/Popover/Cart';
import Messenger from '@/components/Popover/Messenger';
import Notifications from '@/components/Popover/Notifications';
import logo from '@/assets/images/logo_trans.png';
import styles from './index.less';

const { Header: AntdHeader } = Layout;
const { Search } = Input;

const Header = () => {
    const handleLogout = () => {
        //
        message.success('Log out!');
        router.push('/login');
    };

    return (
        <AntdHeader className={styles.header}>
            <div className={styles.leftContent}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" />
                </div>
                <div className={styles.categories}>

                </div>
                <div className={styles.search}>
                    <Search placeholder="Search courses..." />
                </div>
            </div>
            <div className={styles.rightContent}>
                <div className={styles.account}>
                    <Popover
                        placement="bottomRight"
                        popupAlign={{ offset: [-8, -13] }}
                        popupClassName={styles.accountPopover}
                        content={(
                            <div>
                                <Row className={styles.info}>
                                    <Col span={4}>
                                        <Avatar style={{ backgroundColor: '#fada5e', color: 'white' }} size={39}>NH</Avatar>
                                    </Col>
                                    <Col span={20}>
                                        <div className={styles.name}><b>Ngoc Hanh V</b></div>
                                        <div className={styles.mail}>ngochanhvuong@gmail.com</div>
                                    </Col>
                                </Row>
                                <div className={styles.item}>
                                    <Link to="/profile">Profile</Link>
                                </div>
                                <div className={styles.item}>
                                    <Link to="/purchase-history">Purchase history</Link>
                                </div>
                                <div className={styles.item}>
                                    <Link to="/my-friends">My friends</Link>
                                </div>
                                <div className={styles.item}>
                                    <Link to="/my-teachers">My teachers</Link>
                                </div>
                                <div className={styles.divider}><Divider type="horizontal" className={styles.realDivider} /></div>
                                <div className={styles.item}>
                                    Help center
                                </div>
                                <div className={styles.item} onClick={handleLogout}>
                                    Log out
                                </div>
                            </div>
                        )}
                    >
                        <div className={styles.accountText}>
                            <Avatar style={{ backgroundColor: '#fada5e', color: 'white' }} size={32}>NH</Avatar>
                        </div>
                    </Popover>
                </div>
                <div className={styles.notifications}>
                    <Notifications />
                </div>
                <div className={styles.messenger}>
                    <Messenger />
                </div>
                <div className={styles.cart}>
                    
                </div>
                <div className={styles.teaching}>
                    <Popover
                        content={(
                            <div className={styles.content}>
                                <p>Turn what you know into an opportunity and reach millions around the world.</p>
                                <div><Link to="/teaching">Learn more</Link></div>
                            </div>
                        )}
                        popupClassName={styles.teachingPopover}
                        placement="bottomRight"
                        popupAlign={{ offset: [-5, -13] }}
                    >
                        <div className={styles.teachingText} onClick={() => router.push('/teaching')}>
                            Teach on Hanjh
                        </div>
                    </Popover>
                </div>
            </div>
        </AntdHeader>
    )
}

export default Header;