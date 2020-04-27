import React from 'react';
import { Button } from 'antd';

export default (props) => {
    const {
        when,
        itemName,
        onMore,
        onAll,
        className,
        ...extraProps
    } = props;
    return when ? (
        <div className={className} {...extraProps}>
            <Button size="small" type="default" onClick={onMore}>{`More ${itemName}s`}</Button>
            <Button size="small" type="primary" style={{ marginLeft: 10 }} onClick={onAll}>{`All ${itemName}s`}</Button>
        </div>
    ) : null
};