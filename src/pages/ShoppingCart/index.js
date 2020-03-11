import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import Link from 'umi/link';
import Wrapper from '@/components/JumpotronWrapper';
import { Icon, Divider, Button, Row, Col, Input, Spin } from 'antd';
import { transAuthors } from '@/utils/utils';
import styles from './index.less';

const { Search } = Input;

const ShoppingCart = ({ dispatch, ...props }) => {
    const [coupon, setCoupon] = useState('');
    const {
        cart,
        loading
    } = props;
    const handleCheckout = () => {

    };
    const getBundleName = bundle => {
        return `Bundle: ${_.join(_.map(bundle.courses, course => course.name), ' + ')}`;
    };
    const totalPrice = _.isEmpty(cart) ? 0 : _.sum(_.map(cart, item => item.price));
    return (
        <Wrapper title="Shopping cart">
            <Row className={styles.shoppingCart} gutter={16}>
                <div className={styles.title}>
                    {`${_.size(cart)} ${_.size(cart) > 1 ? 'courses' : 'course'} in cart`}
                </div>
                <Col span={18} className={styles.main}>
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
                                            {item.type === 'course' ? (
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
                                            ) : (
                                                <Row className={styles.bundle}>
                                                    <Row className={styles.theBundle}>
                                                        <Col span={16} className={styles.name}>
                                                            {getBundleName(item)}
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
                                                    {_.map(item.courses, course => (
                                                        <Row className={styles.course} key={`course_${course._id}`}>
                                                            <Col span={2} />
                                                            <Col className={styles.avatar} span={3}>
                                                                <img alt="course-avatar" src={course.avatar} />
                                                            </Col>
                                                            <Col className={styles.nameAndAuthors} span={11}>
                                                                <div className={styles.name}>{course.name}</div>
                                                                <div className={styles.authors}>
                                                                    {`Created by ${transAuthors(course.authors, 1000)}`}
                                                                </div>
                                                            </Col>
                                                            <Col className={styles.price} span={4}>
                                                                {`$${_.round(course.price, 2)}`}
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </Row>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            )}
                        </div>
                    )}
                </Col>
                <Col span={6} className={styles.checkout}>
                    <div className={styles.totalTitle}>
                        Total
                    </div>
                    <div className={styles.total}>
                        {`$${totalPrice}`}
                    </div>
                    <div className={styles.btn}>
                        <Button type="primary" size="large" onClick={handleCheckout}>
                            Checkout
                        </Button>
                    </div>
                    <Divider className={styles.divider} />
                    <div className={styles.input}>
                        <Search
                            value={coupon}
                            onChange={e => setCoupon(e.target.value)}
                            enterButton="Apply"
                            placeholder="Enter coupon"
                        />
                    </div>
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