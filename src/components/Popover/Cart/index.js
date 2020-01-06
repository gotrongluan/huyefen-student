import React from 'react';
import Link from 'umi/link';
import { Popover, Icon } from 'antd';
import styles from './index.less';

const Cart = () => {
    return (
        <Popover
            content={(
                <div className={styles.content}>
                    <p>Your cart is empty.</p>
                    <div><Link to="/">Keep shopping.</Link></div>
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