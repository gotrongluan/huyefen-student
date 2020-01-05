import React from 'react';
import { colorTheme } from '@/config/constants';
import BeatLoader from 'react-spinners/BeatLoader';
import { Spin } from 'antd';

export default ({ children, fontSize, margin = 2, ...restProps}) => {
    const icon = <BeatLoader loading={true} size={`${fontSize}px`} color={colorTheme} margin={margin}/>
    return (
        <Spin indicator={icon} {...restProps}>
            {children}
        </Spin>
    );
};