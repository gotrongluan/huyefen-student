import React from 'react';
import { Layout } from 'antd';
import Scrollbars from 'react-custom-scrollbars';

const ScrollLayout = ({ children }) => {
    return (
        <Scrollbars
            autoHeight
            autoHeightMax={window.outerHeight - 64}
            style={{ marginTop: 64 }}
            renderView={props => <div {...props} id="mainScrollbar"/>}
        >
            <Layout>
                {children}
            </Layout>
        </Scrollbars>
    )
};

export default ScrollLayout;