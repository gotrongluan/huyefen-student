import React from 'react';
import _ from 'lodash';
import { Form, Input, Button, message } from 'antd';
import styles from './ChangePassword.less';

const { Password } = Input;

const ChangePassword = ({ form }) => {

    const { getFieldDecorator } = form;

    const handleSubmitPassword = e => {
        e.preventDefault();
        const errors = form.getFieldsError();
        if (_.some(errors, err => err)) return message.error('Invalid input, please try again!');
        const { oldPassword, newPassword } = form.getFieldsValue();
        if (!oldPassword || oldPassword.trim() === '') return message.error('Old password must not be empty!');
        if (!newPassword || newPassword.trim() === '') return message.error('New password must not be empty!');
        
        //submit();
        message.success('Change!');
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
                            }
                        ]
                    })(
                        <Password placeholder="Old password" style={{ width: '100%' }} size="large" />
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
                        ]
                    })(
                        <Password placeholder="New password" style={{ width: '100%' }} size="large" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" >Change</Button> 
                </Form.Item>
            </Form>
        </div>
    )
};

export default Form.create()(ChangePassword);