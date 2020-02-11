import React from 'react';
import withRouter from 'umi/withRouter';
import Redirect from 'umi/redirect';
import { connect } from 'dva';

const Authenticate = ({ children, ...props }) => {
    const { user, location } = props;
    return user ? (
        <div>{children}</div>
    ) : (
        <Redirect 
            to={{
                pathname: '/user/login',
                state: {
                    from: location.pathname
                }
            }}
        />
    );
};

export default withRouter(connect(
    ({ user }) => ({
        user: user
    })
)(Authenticate));