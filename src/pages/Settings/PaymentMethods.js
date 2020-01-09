import React, { useState } from 'react';
import _ from 'lodash';
import { Form, Input, Button, Checkbox, Divider, Icon, Row, Col, DatePicker, Country, Select } from 'antd';
import cardLogo from '@/assets/images/mastercard.jpg';
import styles from './PaymentMethods.less';

const { Option } = Select;
const { MonthPicker } = DatePicker;

const PaymentMethods = ({ form }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [validate, setValidate] = useState({
        validateStatus: 'success',
        help: ''
    });
    const { getFieldDecorator } = form;
    const status = false;
    const lastNumbers = 2112;
    const isChecked = true;
    const expDate = '08/21';

    const handleSubmitCredit = e => {
        e.preventDefault();
    };

    const handleEnterCardNumber = e => {
        const val = e.target.value;
        if (val.length === 0) {
            setValidate({
                validateStatus: 'error',
                help: 'Please enter card number!'
            });
            setCardNumber('');
            return;
        }
        const parts = _.split(val, ' ');
        const n = parts.length;
        for (let i = 0; i < n - 1; ++i)
            if (!parts[i] || parts[i].length !== 4 || isNaN(parts[i]))
                return;
        if (!parts[n - 1] || parts[n - 1].length > 4 || isNaN(parts[n - 1])) return;
        if (val.length >= 20) return;
        setValidate({
            validateStatus: 'success',
            help: ''
        });
        const joinVal = _.join(parts, ' ');
        if (joinVal.length === 4 || joinVal.length === 9 || joinVal.length === 14)
            setCardNumber(joinVal + ' ');
        else setCardNumber(joinVal);
    };

    return (
        <div className={styles.payments}>
            <div className={styles.credit}>
                <div className={styles.title}>Credit/Debit Card</div>
                <div className={styles.main}>
                    {status ? (
                        <Row className={styles.card}>
                            <Col className={styles.left} span={20}>
                                <img alt="card-logo" src={cardLogo} />
                                <span className={styles.number}>{`**** **** **** ${lastNumbers}`}</span>
                                <Divider type="vetical" className={styles.vdivider} />
                                <span className={styles.expDate}>{expDate}</span>
                            </Col>
                            <Col className={styles.right} span={4}>
                                <Button type="primary">Delete</Button>
                            </Col>
                        </Row>
                    ) : (
                        <Form
                            className={styles.creditForm}
                            onSubmit={handleSubmitCredit}
                            layout="vertical"
                        >
                            <Row className={styles.row}>
                                <Form.Item
                                    className={styles.formItem}
                                    label="Card Number"
                                    validateStatus={validate.validateStatus}
                                    help={validate.help}
                                >
                                    <Input size="large" value={cardNumber} placeholder="**** **** **** ****" style={{ width: '100%' }} onChange={handleEnterCardNumber} suffix={<Icon type="lock" />}/>
                                </Form.Item>
                            </Row>
                            <Row className={styles.row} gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Country" className={styles.formItem}>
                                        {getFieldDecorator('country', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please select your country!'
                                                }
                                            ],
                                            initialValue: 'vietnam'
                                        })(
                                            <Select
                                                showSearch
                                                placeholder="Country"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                                                }
                                                size="large"
                                                style={{ width: '100%' }}
                                            >
                                                <Option value="vietnam">Viet Nam</Option>
                                                <Option value="usa">America</Option>
                                                <Option value="japan">Japan</Option>
                                                <Option value="russia">Russia</Option>
                                                <Option value="yemen">Yemen</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Exprired Date" className={styles.formItem}>
                                        {getFieldDecorator('expiredDate', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please choose expired date!'
                                                }
                                            ]
                                        })(
                                            <MonthPicker size="large" format="MM/YY" placeholder="MM/YY" style={{ width: '100%' }} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="CVC" className={styles.formItem}>
                                        {getFieldDecorator('cvc', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please enter CVC number!'
                                                },
                                                {
                                                    pattern: /^\d\d\d$/,
                                                    message: 'Invalid CVC!'
                                                }
                                            ]
                                        })(
                                            <Input size="large" placeholder="CVC" style={{ width: '100%' }} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className={styles.row}>
                                <Form.Item label="Name on Card" className={styles.formItem}>
                                    {getFieldDecorator('cardName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please enter name on card!'
                                            }
                                        ]
                                    })(<Input size="large" placeholder="Name" style={{ width: '100%' }} />)}
                                </Form.Item>
                            </Row>
                            <Row className={styles.row}>
                                <div style={{ marginBottom: 20 }}><Icon type="lock" theme="filled" /><span style={{ marginLeft: 7 }}>Your information is private & secure</span></div>
                                <Form.Item>
                                    <Button type="primary" size="large" >Submit</Button>
                                </Form.Item>
                            </Row>
                        </Form>
                    )}
                </div>
            </div>
            <Divider className={styles.divider} dashed />
            <div className={styles.wallet}>
                <div className={styles.title}>Payment Wallet</div>
                <div className={styles.main}>

                </div>
            </div>
        </div>
    )
};

export default Form.create()(PaymentMethods);