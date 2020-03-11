import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import Link from 'umi/link';
import Wrapper from '@/components/JumpotronWrapper';
import { Icon, Divider, Button, Row, Col, Input, Spin } from 'antd';
import { transAuthors } from '@/utils/utils';
import styles from './index.less';

const ShoppingCart = ({ dispatch, ...props }) => {
    const {
        cart,
        loading
    } = props;

    return (
        <Wrapper title="Shopping cart">
            <Row className={styles.shoppingCart}>
                <Col span={18} className={styles.main}>
                    <div className={styles.title}>
                        {`${_.size(cart)} ${_.size(cart) > 1 ? 'courses' : 'course'} in cart`}
                    </div>
                    {loading ? (
                        <div className={styles.loading}>
                            <Spin indicator={<Icon type="loading" spin style={{ fontSize: '44px' }} />} />
                        </div>
                    ) : (
                        <div className={styles.list}>
                            {_.isEmpty(cart) ? (
                                <div className={styles.empty}>
                                    <Icon type="shopping-cart" className={styles.shoppingIcon} />
                                    <div className={styles.text}>Your cart is empty.</div>
                                    <div className={styles.btn}>
                                        <Link to="/">
                                            <Button type="primary">
                                                Keep shopping
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <React.Fragment>
                                    {_.map(cart, (item, index) => (
                                        <React.Fragment key={`${item.type}_${item._id}`}>
                                            {index > 0 && (<Divider className={styles.divider} />)}
                                            <Row className={styles.item}>
                                                <Col className={styles.avatar} span={4}>
                                                    <img alt="course-avatar" src={item.avatar} />
                                                </Col>
                                                <Col className={styles.nameAndAuthors} span={12}>
                                                    <div className={styles.name}>{item.name}</div>
                                                    <div className={styles.authors}>
                                                        {`Created by ${transAuthors(item.authors, 1000)}`}
                                                    </div>
                                                </Col>
                                                <Col className={styles.price} span={4}>
                                                    {`$${_.round(item.price, 2)}`}
                                                </Col>
                                                <Col className={styles.actions} span={4}>
                                                    <div className={styles.delete}>Delete</div>
                                                    <div className={styles.saveForLater}>Save for later</div>
                                                    <div className={styles.move}>Move to Wishlist</div>
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            )}
                        </div>
                    )}
                </Col>
                <Col span={6} className={styles.checkout}>

                </Col>
            </Row>
        </Wrapper>
    )
};

export default connect(
    ({ cart, loading }) => ({
        cart: cart,
        loading: !!loading.effects['cart/fetch']
    })
)(ShoppingCart);