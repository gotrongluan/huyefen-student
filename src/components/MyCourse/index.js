import React from 'react';
import moment from 'moment';
import { Card, Modal, Button, Rate, Progress, Tooltip, Dropdown, Menu, Icon } from 'antd';
import { linearColorTheme } from '@/config/constants';
import { truncate, transAuthors } from '@/utils/utils';
import styles from './index.less';

const MyCourse = ({ course }) => {
    return (
        <React.Fragment>
            <Card
                className={styles.course}
                style={{ width: '100%' }}
                hoverable
                cover={
                    <div className={styles.cover}>
                        <Dropdown
                            className={styles.dropdown}
                            trigger={['click']}
                            placement="bottomRight"
                            overlayClassName={styles.overlay}
                            overlay={(
                                <Menu>
                                    <Menu.Item key="edit-rating">
                                        <span>
                                            <Icon type="edit" />
                                            <span>Edit rating</span>
                                        </span>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item key="recommend">
                                        <span>
                                            <Icon type="share-alt" />
                                            <span>Recommend to Friend</span>
                                        </span>
                                    </Menu.Item>
                                </Menu>
                            )}
                        >
                            <div className={styles.optionsBtn}><Icon type="more" /></div>
                        </Dropdown>
                        <img alt="avatar" src={course.avatar} />
                    </div>
                }
            >
                <div className={styles.info}>
                    <div className={styles.name}>{truncate(course.name, 35)}</div>
                    <div className={styles.authors}>{transAuthors(course.authors, 26)}</div>
                    <div className={styles.progress}>
                        <Tooltip title={`${course.progress}%`} placement="top">
                            <Progress strokeLinecap="square" strokeColor={linearColorTheme} showInfo={false} percent={course.progress} />
                        </Tooltip>
                    </div>
                    <div className={styles.registerTime}>
                        {`(Register on ${moment(course.registerTime).format('MM/YY')})`}
                    </div>
                </div>
            </Card>
            <Modal>

            </Modal>
        </React.Fragment> 
    )
};

export default MyCourse;
