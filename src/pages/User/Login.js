import React from 'react';
import _ from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import { Row, Form, Input, Button, Checkbox, Icon, message } from 'antd';
import Spin from '@/elements/spin/secondary';
//import * as GlobalActions from '_redux/actions/global';
import styles from './Login.less';

const Login = (props) => {
    const handleSubmit = e => {
        e.preventDefault();
        const { form } = props;
        const errors = form.getFieldsError();

        if (_.some(errors, err => err)) return message.error(formatMessage({ id: 'login.invalidinput' }));
        const { phone, password } = form.getFieldsValue();
        if (!phone || phone.trim().length === 0) return message.error(formatMessage({ id: 'login.emptyphone' }));
        if (!password || password.trim().length === 0) return message.error(formatMessage({ id: 'login.emptypassword' }));
        return message.success(formatMessage({ id: 'login.success' }));
        // const { from } = location.state || { from: { pathname: '/home' } };
        //login(phone, password, from);
    }

    const { getFieldDecorator } = props.form;
    const { loading } = props;
    return (
        <Row className={styles.login}>
            <div className={styles.title}>{formatMessage({ id: 'login.title' })}</div>
            <div className={styles.loginForm}>
                <Form onSubmit={handleSubmit} className={styles.form}>
                    <Form.Item>
                        {getFieldDecorator('phone', {
                            rules: [
                                { required: true, message: formatMessage({ id: 'login.phone.rules.required' }) },
                                { len: 10, message: formatMessage({ id: 'login.phone.rules.len' }) },
                                { pattern: /^\d+$/, message: formatMessage({ id: 'login.phone.rules.pattern' }) }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder={formatMessage({ id: 'login.phone.placeholder' })}
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: formatMessage({ id: 'login.password.rules.required' }) }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder={formatMessage({ id: 'login.password.placeholder' })}
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>{formatMessage({ id: 'login.rememberme' })}</Checkbox>)}
                    <Link className={styles.forgot} to="/">
                        {formatMessage({ id: 'login.forgotpass' })}
                    </Link>
                    <Button type="primary" htmlType="submit" className={styles.btn} size="large">
                        {loading ? (<Spin fontSize={4} isCenter={false} color="white"/>) : formatMessage({ id: 'login.btn' })}
                    </Button>
                    {formatMessage({ id: 'login.or' })} <Link to="/user/register">{formatMessage({ id: 'login.registernow' })}</Link>
                    </Form.Item>
                </Form>
            </div>
        </Row>
    )
}

// const mapStateToProps = ({ loading }) => ({
//     loading: loading['login'] || false
// });

// const mapDispatchToProps = dispatch => ({
//     login: (phone, password, from) => dispatch(GlobalActions.login(phone, password, from)),
// });

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login)));
export default withRouter(Form.create()(Login));