import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import Link from 'umi/link';
import { Table, Row, Col } from 'antd';
import Wrapper from '@/components/JumpotronWrapper';
import darkLogo from '@/assets/images/dark_logo.jpg';
import funcPurchase from '@/assets/fakers/purchaseHistory';
import styles from './index.less';

const CoursePurchaseItem = ({ avatar, name }) => {
    return (
        <Row className={styles.item}>
            <Col span={8} className={styles.avatar}>
                <img alt="avatar" src={avatar} />
            </Col>
            <Col span={16} className={styles.name}>
                {name}
            </Col>
        </Row>
    )
};

const BundlePurchaseItem = ({ courses }) => {
    return (
        <div className={styles.bundle}>
            {`Bundle: ${_.join(courses, ', ')}`}
        </div>
    );
};

const PurchaseHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(funcPurchase(1)); 
    const handleChangeCurrentPage = page => {
        if (page <= maxPage) {
            setCurrentPage(page);
        }
        else {
            setMaxPage(page);
            //call api
            setLoading(true);
            setTimeout(() => {
                const skip = page - maxPage;
                let newData = [];
                for (let i = 1; i <= skip; ++i) {
                    newData = _.concat(newData, funcPurchase(maxPage + i));
                }
                setData([...data, ...newData]);
                setLoading(false);
                setCurrentPage(page);
            }, 1600);
        }
    };
    const total = 44;
    //const data = PURCHASE_HISTORY;
    const renderItems = items => {
        if (!items || _.isEmpty(items) === 0) return null;
        if (items.length === 1) {
            return items[0].type === 1 ? (
                <CoursePurchaseItem avatar={items[0].avatar} name={items[0].name} />
            ): (
                <BundlePurchaseItem courses={items[0].courses} />
            );
        }
        return (
            <div className={styles.items}>
                <CoursePurchaseItem avatar={darkLogo} name={`${items.length} ${items.length > 1 ? 'Courses' : 'Course'} purchased`} />
                <div className={styles.subItems}>
                    {_.map(items, item => (
                        item.type === 1 ? (
                            <CoursePurchaseItem key={item._id} name={item.name} avatar={item.avatar} />
                        ) : (
                            <BundlePurchaseItem courses={item.courses} key={_.uniqueId('bundle_')}/>
                        )
                    ))}
                </div>
            </div>
        )
    };
    const renderPrices = prices => {
        return (
            <div className={styles.prices}>
                <div className={styles.total}>{`$${prices[0]}`}</div>
                <div className={styles.subPrices}>
                    {_.map(_.slice(prices, 1), price => (
                        <div className={styles.price} key={_.uniqueId('price_')}>{`$${price}`}</div>
                    ))}
                </div>
            </div>
        )
    };
    const columns = [
        {
            title: 'Items',
            key: 'items',
            dataIndex: 'items',
            width: '50%',
            render: items => renderItems(items)
        },
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            width: '12%',
            render: date => moment(date).format('D MMM, YYYY')
        },
        {
            title: 'Total Price',
            key: 'prices',
            dataIndex: 'prices',
            width: '12%',
            render: prices => renderPrices(prices)
        },
        {
            title: 'Payment Type',
            key: 'paymentType',
            width: '14%',
            dataIndex: 'paymentType'
        },
        {
            title: '',
            key: 'receipt',
            width: '11%',
            dataIndex: '',
            render: (txt, order) => <Link to={`/receipt/${order._id}`}>Receipt</Link>
        }
    ];
    return (
        <Wrapper title="Purchase history">
            <div className={styles.purchaseHistory}>
                <Table
                    className={styles.table}
                    pagination={total && (total > 8) ? {
                        total,
                        pageSize: 4,
                        current: currentPage,
                        onChange: handleChangeCurrentPage
                    } : false}
                    rowKey={order => order._id + _.uniqueId('order_')}
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                />
            </div>
        </Wrapper>
    )
};

export default PurchaseHistory;