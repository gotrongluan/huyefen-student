import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import storage from '@/utils/storage';

const Authorized = ({ dispatch, children, ...props }) => {
    const [status, setStatus] = useState('pending');
    const { user } = props;
    useEffect(() => {
        if (user)
            setStatus('authorized');
        else {
            const token = storage.getToken();
            if (token)
                dispatch({
                    type: 'user/fetch',
                    payload: {
                        callback: () => setStatus('authorzied')
                    }
                });
            else setStatus('authorzied');
        }
    }, []);
    if (status === 'pending') return <PageLoading />;
    return (<div>{children}</div>);
};

export default connect(
    ({ user }) => ({
        user: user
    })
)(Authorized);