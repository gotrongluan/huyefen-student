import React from 'react';
import { Avatar } from 'antd';
import { capitalText } from '@/utils/utils';

const UserAvatar = ({
    src,
    borderWidth,
    size,
    textSize,
    text,
    style,
    extraStyle = {},
    ...props
}) => {
    return src ? (
        <Avatar
            src={src}
            size={size}
            style={{
                border: `${borderWidth}px solid white`,
                ...extraStyle
            }}
            {...props}
        />
    ) : (
        <Avatar
            size={textSize}
            style={{
                ...style,
                ...extraStyle
            }}
            {...props}
        >
            {capitalText(text)}
        </Avatar>
    )
};

export default UserAvatar;