import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Form, Input, Button, message, Spin, Icon } from 'antd';
import styles from './ChangePassword.less';

const { Password } = Input;

const ChangePassword = ({ form, dispatch, loading }) => {

    const { getFieldDecorator } = form;

    const handleSubmitPassword = e => {
        e.preventDefault();
        const errors = form.getFieldsError();
        if (_.some(errors, err => err)) return message.error('Invalid input, please try again!');
        const { oldPassword, newPassword } = form.getFieldsValue();
        if (!oldPassword || oldPassword.trim() === '') return message.error('Old password must not be empty!');
        if (!newPassword || newPassword.trim() === '') return message.error('New password must not be empty!');
        
        dispatch({
            type: 'user/changePassword',
            payload: {
                oldPassword,
                newPassword,
                onOk: () => {
                    form.resetFields();
                    message.success('Change password successfully!');
                },
                onIncorrect: () => message.error('Your old password is incorrect!')
            }
        });
    };

    return (
        <div className={styles.changePassword}>
            <Form
                layout="vertical"
                className={styles.form}
                onSubmit={handleSubmitPassword}
            >
                <Form.Item label="Old password" className={styles.formItem}>
                    {getFieldDecorator('oldPassword', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter old password!'
                            },
                        ],
                        initialValue: ''
                    })(
                        <Password placeholder="Old password" style={{ width: '100%' }} size="large" disabled={loading} />
                    )}
                </Form.Item>
                <Form.Item label="New password" className={styles.formItem}>
                    {getFieldDecorator('newPassword', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter new password!'
                            },
                            {
                                min: 6,
                                message: 'Your password must has more than 5 character!'
                            }
                        ],
                        initialValue: ''
                    })(
                        <Password placeholder="New password" style={{ width: '100%' }} size="large" disabled={loading} />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" icon={loading ? "loading" : null}>Change</Button> 
                </Form.Item>
            </Form>
        </div>
    )
};

export default Form.create()(connect(({ loading }) => ({ loading: !!loading.effects['user/changePassword'] }))(ChangePassword));