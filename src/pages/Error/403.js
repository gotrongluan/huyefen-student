import React from 'react';
import router from 'umi/router';
import { Result, Button } from 'antd';

const Exception404 = () => {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" onClick={() => router.push('/')}>Back to home</Button>}
        />
    )
};

export default Exception404;