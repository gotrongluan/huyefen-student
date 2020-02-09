import React from 'react';
import router from 'umi/router';
import { Result, Button } from 'antd';

const Exception404 = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={() => router.push('/')}>Back to home</Button>}
        />
    )
};

export default Exception404;