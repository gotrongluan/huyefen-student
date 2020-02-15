import React, { useEffect, useRef } from 'react';
import withRouter from 'umi/withRouter';
import { Layout } from 'antd';
import Scrollbars from 'react-custom-scrollbars';

const ScrollLayout = ({ children, location }) => {
    const scrollElRef = useRef(null);
    const { pathname } = location;
    useEffect(() => {
        const element = scrollElRef.current;
        if (element) element.scrollToTop();
    }, [pathname]);
    return (
        <Scrollbars
            ref={scrollElRef}
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

export default withRouter(ScrollLayout);