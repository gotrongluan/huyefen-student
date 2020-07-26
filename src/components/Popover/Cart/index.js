import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Popover, Icon, List, Row, Col, Badge, Avatar } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import { truncate, transAuthors, mapKeyToPrice } from '@/utils/utils';
import styles from './index.less';

const Cart = ({ cart }) => {
    const getBundleName = bundle => {
        return `Bundle: ${_.join(_.map(bundle.courses, course => course.title), ' + ')}`;
    };
    let count = 0;
    if (!_.isEmpty(cart) && _.size(cart) > 0) {
        count = <Avatar style={{ background: 'green', fontSize: '11px' }} size={16}>{_.size(cart) > 9 ? '9+' : _.size(cart)}</Avatar>;
    }
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
                                    renderItem={item => {
                                        const rawPrice = mapKeyToPrice(item.price);
                                        const rawRealPrice = mapKeyToPrice(item.realPrice);
                                        const priceText = `$${_.round(rawPrice, 2)}`;
                                        const realPriceText = `$${_.round(rawRealPrice, 2)}`;
                                        return item.type === 'course' ? (
                                            <Row className={styles.courseItem}>
                                                <Col span={6} className={styles.avatar}>
                                                    <img alt="course avatar" src={item.avatar} />
                                                </Col>
                                                <Col span={18} className={styles.info}>
                                                    <div className={styles.name}>{truncate(item.title, 38)}</div>
                                                    <div className={styles.authors}>{`By ${transAuthors(_.map(item.authors, 'name'), 26)}`}</div>
                                                    <div className={styles.price}>
                                                    <span className={styles.priceVal}>
                                                        {priceText}
                                                    </span>
                                                        {rawRealPrice > rawPrice && (
                                                            <span className={styles.realPriceVal}>
                                                            {realPriceText}
                                                        </span>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        ) : (
                                            <Row className={styles.courseItem}>
                                                <Col span={6} className={styles.avatar}>
                                                    <img alt="course avatar" src={item.courses[0].avatar} />
                                                </Col>
                                                <Col span={18} className={styles.info}>
                                                    <div className={styles.name}>{truncate(getBundleName(item), 76)}</div>
                                                    <div className={styles.price}>
                                                    <span className={styles.priceVal}>
                                                        {priceText}
                                                    </span>
                                                        {rawRealPrice > rawPrice && (
                                                            <span className={styles.realPriceVal}>
                                                            {realPriceText}
                                                        </span>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        );
                                    }}
                                />
                            </Scrollbars>
                            <div className={styles.total}>
                                <span className={styles.text}>Total: </span>
                                <span className={styles.price}>
                                    {(() => {
                                        const price = _.sum(_.map(cart, item => mapKeyToPrice(item.price)));
                                        const realPrice = _.sum(_.map(cart, item => mapKeyToPrice(item.realPrice)));
                                        return (
                                            <>
                                                <span className={styles.priceVal}>
                                                    {`$${_.round(price, 2)}`}
                                                </span>
                                                {realPrice > price && (
                                                    <span className={styles.realPriceVal}>
                                                        {`$${_.round(realPrice, 2)}`}
                                                    </span>
                                                )}
                                            </>
                                        )
                                    })()}
                                </span>
                                <span className={styles.goToCart}>
                                    <Link to="/shopping-cart">Go to cart</Link>
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
                <Badge
                    count={count}
                    style={{ boxShadow: 'none' }}
                >
                    <Icon type="shopping-cart" style={{ fontSize: 20 }} />
                </Badge>
            </div>
        </Popover>
    )
}

export default connect(
    ({ cart }) => ({ cart })
)(Cart);