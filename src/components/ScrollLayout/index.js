import React from 'react';
import { Layout } from 'antd';
import Scrollbars from 'react-custom-scrollbars';

const ScrollLayout = ({ children }) => {
    return (
        <Scrollbars autoHeight autoHeightMax={window.innerHeight - 64} style={{ marginTop: 64 }}>
            <Layout>
                {children}
            </Layout>
        </Scrollbars>
    )
};

export default ScrollLayout;