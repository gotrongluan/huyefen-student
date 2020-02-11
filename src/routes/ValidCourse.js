import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading';
import Redirect from 'umi/redirect';

const ValidCourse = ({ match, dispatch, children }) => {
    const { courseId } = match.params;
    const [valid, setValid] = useState('pending');
    useEffect(() => {
        setValid('pending');
        dispatch({
            type: 'learning/validCourse',
            payload: {
                courseId,
                onOk: () => setValid('valid'),
                onInvalidCourse: () => setValid('invalid-course'),
                onInvalidStudent: () => setValid('invalid-student')
            }
        });
    }, [courseId]);
    if (valid === 'pending') return <PageLoading />;
    if (valid === 'valid') return children;
    if (valid === 'invalid-course') return <Redirect to="/error/404" />;
    return <Redirect to="/error/403" />;
};

export default connect()(ValidCourse);