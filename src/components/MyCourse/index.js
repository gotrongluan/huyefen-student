import React, { useState } from 'react';
import moment from 'moment';
import { Card, Modal, Button, Rate, Progress, Tooltip, Dropdown, Menu, Icon, Avatar, Table } from 'antd';
import { linearColorTheme } from '@/config/constants';
import { truncate, transAuthors } from '@/utils/utils';
import FRIENDS from '@/assets/fakers/topFriends';
import styles from './index.less';

const MyCourse = ({ course }) => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [selectedFriendIds, setSelectedFriendIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const friends = FRIENDS;
    const friendsLoading = false;
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '425px'
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            render: avatar => <Avatar alt="avatar" shape="circle" size={36} src={avatar} />,
            fixed: 'right',
            width: '90px'
        }
    ];
    const handleCancelRecommend = () => {
        setCurrentPage(1);
        setVisibleModal(false);
        setSelectedFriendIds([]);
    };
    const handleRecommend = () => {
        console.log(selectedFriendIds);
        handleCancelRecommend();
    };
    const handleSelectFriends = friendIds => {
        setSelectedFriendIds(friendIds);
    };
    const handleChangeFriendsPage = page => {
        setCurrentPage(page);
        //fetch data;
    };
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
                                    <Menu.Item key="recommend" onClick={() => setVisibleModal(true)}>
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
            <Modal
                className={styles.recommendFriendModal}
                title={<div className={styles.title}>Recommend to friends</div>}
                width={600}
                centered
                okText="Recommend"
                cancelText="Cancel"
                visible={visibleModal}
                onOk={handleRecommend}
                onCancel={handleCancelRecommend}
                bodyStyle={{
                    padding: '10px'
                }}
            >
                <div className={styles.friends}>
                    <Table
                        className={styles.table}
                        columns={columns}
                        dataSource={friends}
                        loading={friendsLoading}
                        rowKey={friend => friend._id}
                        showHeader={false}
                        scroll={{ x: 581 }}
                        rowSelection={{
                            columnWidth: '60px',
                            fixed: 'left',
                            onChange: handleSelectFriends,
                            selectedRowKeys: selectedFriendIds
                        }}
                        pagination={(friends && friends.length > 5) ? {
                            total: 40,
                            pageSize: 5,
                            current: currentPage,
                            simple: true,
                            small: true,
                            onChange: handleChangeFriendsPage
                        } : false}
                    />
                </div>
            </Modal>
        </React.Fragment> 
    )
};

export default MyCourse;
