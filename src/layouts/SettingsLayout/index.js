import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Wrapper from '@/components/JumpotronWrapper';
import styles from './index.less';

const Settings = () => {
    return (
        <Wrapper title={formatMessage({ id: 'settings.title' })}>
            <div>
                This is Settings page
            </div>
        </Wrapper>
    )
};

export default Settings;