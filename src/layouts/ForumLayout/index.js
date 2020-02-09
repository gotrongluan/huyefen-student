import React, { useEffect } from 'react';
import { message } from 'antd';

const ForumLayout = ({ children }) => {
    useEffect(() => {
        message.success('AAAA');
        return () => message.warning('Unmount forum layout');
        //clear select boxes values: filter, sort....
    }, []);
    return (
        <>
            {children}
        </>
    )
};

export default ForumLayout;