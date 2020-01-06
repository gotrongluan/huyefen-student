import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Popover, Icon } from 'antd';
import styles from './index.less';

const Cart = () => {
    return (
        <Popover
            content={(
                <div className={styles.content}>
                    <p>{formatMessage({ id: 'header.cart.empty' })}</p>
                    <div><Link to="/">{formatMessage({ id: 'header.cart.keep' })}</Link></div>
                </div>
            )}
            popupClassName={styles.popover}
            placement="bottom"
            trigger="hover"
            popupAlign={{ offset: [3, -13] }}
            arrowPointAtCenter
        >
            <div className={styles.cartText}>
                <Icon type="shopping-cart" style={{ fontSize: 20 }} />
            </div>
        </Popover>
    )
}

export default Cart;