import React from 'react';
import { Card, Modal, Button, Rate, Progress, Tooltip, Dropdown, Menu, Icon } from 'antd';
import { linearColorTheme } from '@/config/constants';
import { truncate, transAuthors, fromNow } from '@/utils/utils';
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
                            trigger={['click']}
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
                            <div><Icon type="more" /></div>
                        </Dropdown>
                        <img alt="avatar" src={course.avatar} />
                    </div>
                }
            >
                <div className={styles.courseInfo}>
                    <div className={styles.name}>{truncate(course.name, 60)}</div>
                    <div className={styles.authors}>{transAuthors(course.authors)}</div>
                    <div className={styles.registerTime}>
                        {`Register ${fromNow(course.registerTime)}`}
                    </div>
                    <div className={styles.progress}>
                        <Tooltip title={`${course.progress}%`} placement="top">
                            <Progress strokeLinecap="square" strokeColor={linearColorTheme} showInfo={false} percent={course.progress} />
                        </Tooltip>
                    </div>
                </div>
            </Card>
            <Modal>

            </Modal>
        </React.Fragment> 
    )
};

export default MyCourse;
