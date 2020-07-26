import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Card, Progress, Tooltip, Dropdown, Menu, Icon } from 'antd';
import { linearColorTheme } from '@/config/constants';
import { truncate, transAuthors } from '@/utils/utils';
import styles from './index.less';

const MyCourse = ({ course, handleRecommend }) => {
    return (
        <React.Fragment>
            <Card
                className={styles.course}
                style={{ width: '100%' }}
                hoverable
                cover={
                    <div className={styles.cover}>
                        <img alt="avatar" src={course.avatar} onClick={() => router.push(`/course/${course._id}`)}/>
                    </div>
                }
            >
                <div className={styles.info} onClick={() => router.push(`/course/${course._id}`)}>
                    <div className={styles.name}>{truncate(course.title, 44)}</div>
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
                <Dropdown
                    className={styles.dropdown}
                    trigger={['click']}
                    placement="topLeft"
                    overlayClassName={styles.overlay}
                    overlay={(
                        <Menu>
                            <Menu.Item key="edit-rating" onClick={() => router.push(`/learning/${course._id}/review`)}>
                                <span>
                                    <Icon type="edit" />
                                    <span>Edit rating</span>
                                </span>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="recommend" onClick={() => handleRecommend(course._id)}>
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
            </Card>
        </React.Fragment> 
    )
};

export default MyCourse;
