import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Popover, Icon, List, Row, Col } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import { truncate, transAuthors } from '@/utils/utils';
import styles from './index.less';

const Cart = ({ cart }) => {
    const getBundleName = bundle => {
        return `Bundle: ${_.join(_.map(bundle.courses, course => course.name), ' + ')}`;
    };
    return (
        <Popover
            content={(
                <div className={styles.content}>
                    {_.isEmpty(cart) ? (
                        <div className={styles.empty}>
                            <p>{formatMessage({ id: 'header.cart.empty' })}</p>
                            <div><Link to="/">{formatMessage({ id: 'header.cart.keep' })}</Link></div>
                        </div>
                    ) : (
                        <div>
                            <Scrollbars autoHeight autoHeightMax={270} className={styles.scrollEle}>
                                <List
                                    dataSource={cart}
                                    rowKey={item => `${item.type}_${item._id}`}
                                    split={true}
                                    renderItem={item => item.type === 'course' ? (
                                        <Row className={styles.courseItem}>
                                            <Col span={6} className={styles.avatar}>
                                                <img alt="course avatar" src={item.avatar} />
                                            </Col>
                                            <Col span={18} className={styles.info}>
                                                <div className={styles.name}>{truncate(item.name, 38)}</div>
                                                <div className={styles.authors}>{`By ${transAuthors(item.authors, 26)}`}</div>
                                                <div className={styles.price}>
                                                    {`$${_.round(item.price, 2)}`}
                                                </div>
                                            </Col>
                                        </Row>
                                    ) : (
                                        <Row className={styles.courseItem}>
                                            <Col span={6} className={styles.avatar}>
                                                <img alt="course avatar" src={item.courses[0].avatar} />
                                            </Col>
                                            <Col span={18} className={styles.info}>
                                                <div className={styles.name}>{truncate(getBundleName(item), 86)}</div>
                                                <div className={styles.price}>
                                                    {`$${_.round(item.price, 2)}`}
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                />
                            </Scrollbars>
                            <div className={styles.total}>
                                <span className={styles.text}>Total: </span>
                                <span className={styles.price}>
                                    {`$${_.round(_.sum(_.map(cart, item => item.price)), 2)}`}
                                </span>
                                <span className={styles.goToCart}>
                                    <Link to="/">Go to cart</Link>
                                </span>
                            </div>
                        </div>
                    )}
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

export default connect(
    ({ cart }) => ({ cart })
)(Cart);