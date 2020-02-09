import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import Header from '@/components/Header';
import ScrollLayout from '@/components/ScrollLayout';
import styles from './index.less';

const { Content } = Layout;

const MessengerLayout = ({ children, settings, dispatch }) => {
    useEffect(() => {
        if (!settings.areasMenu) {
            dispatch({
                type: 'settings/fetch'
            });
        }
    }, []);
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

export default connect(({ settings }) => ({ settings }))(MessengerLayout);