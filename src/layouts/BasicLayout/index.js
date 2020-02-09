import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollLayout from '@/components/ScrollLayout';
import styles from './index.less';

const { Content } = Layout;

const BasicLayout = ({ children, dispatch, settings }) => {
    useEffect(() => {
        if (!settings.areasMenu) {
            dispatch({
                type: 'settings/fetch'
            });
        }
    }, []);
    return (
        <Layout className={styles.basicLayout}>
            <Header className={styles.header} />
            <ScrollLayout>
                <Content>
                    {children}
                </Content>
                <Footer />
            </ScrollLayout>
        </Layout>
    )
};

export default connect(({ settings }) => ({ settings }))(BasicLayout);