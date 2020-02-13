import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Input, DatePicker, Button, Avatar, Upload, Row, Col, Select, Divider, Icon, Transfer, message } from 'antd';
import Spin from '@/elements/spin/secondary';
import { capitalText } from '@/utils/utils';
import CATES_OF_CONCERN from '@/assets/fakers/catesOfConcern';
import styles from './Profile.less';

const FormItem = Form.Item;
const { Option } = Select;

const Profile = ({ form, dispatch, ...props }) => {
    const {
        user,
        initLoading,
        categories,
        jobs,
        profileLoading,
        catesOfConcernLoading
    } = props;
    const { getFieldDecorator } = form;
    const data = CATES_OF_CONCERN;
    const [avatar, setAvatar] = useState(null);
    const [mockData, setMockData] = useState([...data['mockData']])
    const [targetKeys, setTargetKeys] = useState([...data['targetKeys']]);
    const loading = false;
    const handleChangeInfo = () => {};
    
    const handleChangeConcern = targetKeys => setTargetKeys(targetKeys);
    
    const handleBeforeUpload = file => {
        setAvatar(file);
        return false;
    };

    const handleRemoveAvatar = () => setAvatar(null);

    const avatarProps = {
        name: 'avatarfile',
        beforeUpload: handleBeforeUpload,
        onRemove: handleRemoveAvatar,
        openFileDialogOnClick: !avatar,
        showUploadList: {
            showRemoveIcon: true
        }
    };

    return (
        <div className={styles.profile}>
            <div className={styles.avatar}>
                {loading ? (
                    <div className={styles.loading}>
                        <Spin spinning fontSize={8} isCenter />
                    </div>
                ) : (
                    <>
                        <div className={styles.main}>
                            {user.avatar ? (
                                <Avatar
                                    size={150}
                                    src={user.avatar}
                                    alt="avatar"
                                />
                            ) : (
                                <Avatar style={{ backgroundColor: '#fada5e', color: 'white', fontSize: '50px' }} size={150}>{capitalText(user.name)}</Avatar>
                            )}
                        </div>
                        <div className={styles.uploader}>
                            <Form layout="vertical" onSubmit={(e) => {
                                message.success('Change avatar!');
                                e.preventDefault();
                            }}>
                                <Form.Item>
                                    <Upload {...avatarProps} accept="image/*">
                                        {!avatar ? (
                                            <Button className={styles.upBtn}>
                                                <Icon type="upload" /> New avatar
                                            </Button>
                                        ) : (
                                            <Button type="primary" htmlType="submit">
                                                <Icon type="check" /> Let's change                    
                                            </Button>
                                        )}
                                    </Upload>
                                </Form.Item>
                            </Form>
                        </div>
                    </>
                )}
                
            </div>
            <Divider dashed className={styles.divider} />
            <div className={styles.account}>
                <div className={styles.title}>
                    {formatMessage({ id: 'settings.profile.account.title' })}
                </div>
                {loading ? (
                    <div className={styles.loading}>
                        <Spin spinning fontSize={8} isCenter />
                    </div>
                ) : (
                    <>
                        <div className={styles.main}>
                            <Form
                                className={styles.form}
                                handleSubmit={handleChangeInfo}
                                layout="vertical"
                            >
                                <Row className={styles.row} gutter={16}>
                                    <Col span={12}>
                                        <FormItem label="Name">
                                            {
                                                getFieldDecorator('name', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: 'Please enter your name!',
                                                        },
                                                        {
                                                            pattern: /^[a-zA-Z ]+$/,
                                                            message: 'Your name is invalid!'
                                                        }
                                                    ],
                                                    initialValue: user.name,
                                                })(
                                                    <Input placeholder="Name" size="large" style={{ width: '100%' }}/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="Phone">
                                            {getFieldDecorator('phone', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: 'Please enter your phone!',
                                                    },
                                                    {
                                                        pattern: /^\d+$/,
                                                        message: 'Your phone is invalid!'
                                                    },
                                                    {
                                                        len: 10,
                                                        message: 'Phone number must has length 10!'
                                                    },
                                                ],
                                                initialValue: user.phone
                                            })(<Input 
                                                addonBefore={
                                                    <Select defaultValue={84}>
                                                        <Option value={84} style={{ paddingRight: 5 }}>+84</Option>
                                                    </Select>
                                                }
                                                placeholder="Phone"
                                                size="large"
                                                style={{ width: '100%' }}
                                            />)}
                                        </FormItem>
                                    </Col> 
                                </Row>
                                <Row className={styles.row} gutter={16}>
                                    <Col span={6}>
                                        <FormItem label="Gender">
                                            {getFieldDecorator('gender', {
                                                initialValue: user.gender,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: 'Please enter your gender!',
                                                    }
                                                ]
                                            })(
                                                <Select size="large" style={{ width: '100%' }}>
                                                    <Option value="male" >Male</Option>
                                                    <Option value="female">Female</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Birtday">
                                            {getFieldDecorator('birthday', {
                                                initialValue: moment(user.birthday),
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: 'Please enter your birthday!',
                                                    }
                                                ]
                                            })(<DatePicker placeholder="Birthday" size="large" style={{ width: '100%' }} />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="Job">
                                            {getFieldDecorator('job', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: 'Please enter your job!',
                                                    }
                                                ],
                                                initialValue: user.job
                                            })(
                                                <Select
                                                    showSearch
                                                    placeholder="Job"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                                                    }
                                                    size="large"
                                                    style={{ width: '100%' }}
                                                    dropdownClassName={styles.dropdown}
                                                    disabled={initLoading}
                                                    loading={initLoading}
                                                >
                                                    {_.map(jobs, job => (
                                                        <Option key={job.key}>{job.title}</Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row className={styles.row} gutter={16}>
                                    <Col span={12}>
                                        <FormItem label="Facebook">
                                            {
                                                getFieldDecorator('facebook', {
                                                    initialValue: user.facebook || '',
                                                })(
                                                    <Input addonAfter={<Icon type="facebook" />} addonBefore={"https://"} placeholder="Facebook link" size="large" style={{ width: '100%' }}/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="Linkedin">
                                            {getFieldDecorator('linkedin', {
                                                initialValue: user.linkedin || ''
                                            })(<Input 
                                                addonBefore={"https://"}
                                                addonAfter={
                                                    <Icon type="linkedin" />
                                                }
                                                placeholder="Linkedin link"
                                                size="large"
                                                style={{ width: '100%' }}
                                            />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className={styles.btn}>
                            <Button type="primary" size="large">Update account information</Button>
                        </div>
                    </>
                )}
                
            </div>
            <Divider dashed className={styles.divider} />
            <div className={styles.catesOfConcern}>
                <div className={styles.title}>
                    Categories of Concern
                </div>
                {loading ? (
                    <div className={styles.loading}>
                        <Spin spinning fontSize={8} isCenter />
                    </div>
                ) : (
                    <>
                        <div className={styles.main}>
                            <Transfer
                                className={styles.concernTransfer}
                                operations={['concern', 'remove']}
                                titles={['Remain', 'Concerned']}
                                targetKeys={targetKeys}
                                listStyle={{
                                    width: '40%',
                                    height: 340
                                }}
                                showSelectAll={false}
                                dataSource={mockData}
                                showSearch
                                render={item => `${item.title}`}
                                rowKey={item => item._id}
                                onChange={handleChangeConcern}
                                filterOption={(input, option) => option.title.toLowerCase().indexOf(input.toLowerCase()) > -1 || (option.description && option.description.toLowerCase().indexOf(input.toLowerCase()) > -1)}
                            />
                        </div>
                        <div className={styles.btn}>
                            <Button type="primary" size="large">Update concerned categories</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
};

export default Form.create()(connect(
    ({ user, settings, loading }) => ({
        profileLoading: !!loading.effects['account/updateProfile'],
        catesOfConcernLoading: !!loading.effects['account/updateCatesOfConcern'],
        user: user,
        categories: settings.categories,
        jobs: settings.jobs,
        initLoading: !!loading.effects['settings/fetch']
    })
)(Profile));