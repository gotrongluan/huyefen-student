import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import storage from '@/utils/storage';

const Authorized = ({ dispatch, children, ...props }) => {
    const [status, setStatus] = useState('pending');
    const { user, location } = props;
    useEffect(() => {
        const token = storage.getToken();
        if (user) {
            if (user.token === token) {
                if (status === 'pending') {
                    setStatus('authorized');
                }
                return;
            }
            else if (!token) {
                dispatch({ type: 'user/reset' });
            }
        }
        if (token)
        dispatch({
            type: 'user/fetch',
            payload: {
                callback: () => {
                    if (status === 'pending')
                        setStatus('authorized');
                }
            }
        });
        else if (status === 'pending') setStatus('authorized');
    }, [location.pathname]);
    if (status === 'pending') return <PageLoading />;
    return (<div>{children}</div>);
};

export default connect(
    ({ user }) => ({
        user: user
    })
)(Authorized);