import React from 'react';
import { formatMessage, getLocale, setLocale } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Row, Col, Select } from 'antd';
import logo from '@/assets/images/logo_white.png';
import styles from './index.less';

const { Option } = Select;

const Footer = () => {
    const handleChangeLocale = locale => setLocale(locale);

    return (
        <div className={styles.footer}>
            <Row className={styles.content}>
                <Col span={12} className={styles.main}>
                    <div className={styles.logo}>
                        <img alt="logo" src={logo} />
                    </div>
                    <div className={styles.description}>
                        {formatMessage({ id: 'footer.content.description' })}
                    </div>
                    <div className={styles.copyright}>
                        © 2020 HuYeFen Inc. All rights reserved.
                    </div>
                    <div className={styles.locale}>
                        <Select value={getLocale()} onChange={handleChangeLocale} style={{ width: 170, maxWidth: '100%' }}>
                            <Option value="en-US">{formatMessage({ id: 'locale.english' })}</Option>
                            <Option value="vi-VN">{formatMessage({ id: 'locale.vietnamese' })}</Option>
                        </Select>
                    </div>
                </Col>
                <Col span={4} className={styles.link}>
                    <div className={styles.linkItem}><Link>{formatMessage({ id: 'footer.links.teaching' })}</Link></div>
                    <div className={styles.linkItem}><Link>{formatMessage({ id: 'footer.links.app' })}</Link></div>
                    <div className={styles.linkItem}><Link>{formatMessage({ id: 'footer.links.about' })}</Link></div>
                </Col>
                <Col span={4} className={styles.link}>
                    <div className={styles.linkItem}><Link>{formatMessage({ id: 'footer.links.careers' })}</Link></div>
                    <div className={styles.linkItem}><Link>{formatMessage({ id: 'footer.links.blog' })}</Link></div>
                    <div className={styles.linkItem}><Link>{formatMessage({ id: 'footer.links.help' })}</Link></div>
                </Col>
                <Col span={4} className={styles.link}>
                    <div className={styles.linkItem}><Link>{formatMessage({ id: 'footer.links.sitemap' })}</Link></div>
                    <div className={styles.linkItem}><Link>{formatMessage({ id: 'footer.links.business' })}</Link></div>
                </Col>
            </Row>
            <div className={styles.colorBar} />
        </div>
    )
};

export default Footer;