import React, { useEffect, useState } from 'react';
import withRouter from 'umi/withRouter';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import storage from '@/utils/storage';

const Authenticate = ({ dispatch, children, ...props }) => {
    const [status, setStatus] = useState('pending');
    const { user, location } = props;
    useEffect(() => {
        if (user)
            setStatus('authenticated');
        else {
            const token = storage.getToken();
            if (token)
                dispatch({
                    type: 'user/fetch',
                    payload: {
                        callback: () => setStatus('authenticated')
                    }
                });
            else setStatus('unauthorized');
        }
    }, []);
    if (status === 'pending') return <PageLoading />;
    if (status === 'authenticated') return <div>{children}</div>;
    return (
        <Redirect 
            to={{
                pathname: '/user/login',
                state: {
                    from: location.pathname
                }
            }}
        />
    )

};

export default withRouter(connect(
    ({ user }) => ({
        user: user
    })
)(Authenticate));