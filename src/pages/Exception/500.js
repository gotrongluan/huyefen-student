import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception500 = () => (
    <Exception
        type="500"
        desc="Sorry, the server reported an error."
        linkElement={Link}
        backText="Back to home"
    />
);

export default Exception500;
