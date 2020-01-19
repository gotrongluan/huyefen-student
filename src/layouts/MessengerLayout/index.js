import React from 'react';
import { Layout } from 'antd';
import Header from '@/components/Header';
import ScrollLayout from '@/components/ScrollLayout';
import styles from './index.less';

const { Content } = Layout;

const MessengerLayout = ({ children }) => {
    return (
        <Layout className={styles.messengerLayout}>
            <Header className={styles.header} />
            <ScrollLayout>
                <Content>
                    {children}
                </Content>
            </ScrollLayout>
        </Layout>
    )
};

export default MessengerLayout;