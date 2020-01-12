import React, { useState } from 'react';
import _ from 'lodash';
import router from 'umi/router';
import { List, Avatar, Skeleton, Button } from 'antd';
import Spin from '@/elements/spin/secondary';
import Wrapper from '@/components/JumpotronWrapper';
import TEACHERS from '@/assets/fakers/teachers';
import styles from './index.less';

const MyTeachers = () => {
    const [loading, setLoading] = useState(false);                  ///temp
    let [teachers, setTeachers] = useState(TEACHERS);
    const initLoading = false;
    const handleMoreTeachers = () => {
        setLoading(true);
        setTimeout(() => {
            setTeachers([...teachers, ...TEACHERS]);
            setLoading(false);
        }, 1500);
    };
    const loadMore = (
        !loading && !initLoading ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreTeachers}>More teachers</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }}>All teachers</Button>
            </div>
        ) : null
    );
    if (loading) teachers = teachers ? _.concat(teachers, [{
        key: _.uniqueId('teacher_loading_'),
        loading: true
    }, {
        key: _.uniqueId('teacher_loading_'),
        loading: true
    },{
        key: _.uniqueId('teacher_loading_'),
        loading: true
    }]) : undefined;
    return (
        <Wrapper title="My teachers">
            <div className={styles.myTeachers}>
                <Spin spinning={initLoading} fontSize={8} isCenter>
                    <List
                        dataSource={teachers}
                        rowKey={item => (item._id || item.key) + _.uniqueId('teacher_')}
                        loadMore={loadMore}
                        grid={{
                            column: 3,
                            gutter: 8
                        }}
                        renderItem={item => (
                            <div className={!item.loading ? styles.teacherItem : styles.loadingItem} onClick={!item.loading ? () => router.push(`/teacher/${item._id}` ) : () => {}}>
                                <List.Item style={{ paddingLeft: 12, paddingRight: 12 }}>
                                    <Skeleton active title={false} avatar loading={item.loading}
                                        paragraph={{
                                            rows: 2,
                                            width: ['60%', '40%']
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar} size={42} />}
                                            title={<span>{item.name}</span>}
                                            description={
                                                <span style={{ fontSize: 13, color: 'gray'}}>
                                                    {`${item.numOfCourses} courses, ${item.numOfStudents} students`}
                                                </span>
                                            }
                                        />
                                    </Skeleton>
                                </List.Item>
                                
                            </div>
                        )}
                    />
                </Spin>
            </div>
        </Wrapper>
    )
};

export default MyTeachers;