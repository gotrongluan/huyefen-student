import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Popover, Icon, List, Progress, Spin as Loading, message, Row, Col, Tooltip } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import Spin from '@/elements/spin/secondary';
import { truncate, transAuthors } from '@/utils/utils';
import { linearColorTheme } from '@/config/constants';
import styles from './index.less';

const MyCourses = ({ dispatch, myCourses, loading }) => {
    const [visible, setVisible] = useState(false);

    const handleVisibleChange = visible => {
        setVisible(visible);
        if (visible) {
            dispatch({
                type: 'myCourses/fetch'
            });
        }
        else {
            dispatch({
                type: 'myCourses/clear'
            });
        }
    };

    const handleGotoCourse = courseId=> {
        router.push(`/course/${courseId}`);
        handleVisibleChange(false);
    };

    const handleViewAll = () => {
        handleVisibleChange(false);
    };

    const getContent = () => {
        return !myCourses || loading ? (
            <Spin
                spinning
                fontSize={8}
                isCenter
            >
                <div className={styles.loading}></div>
            </Spin>
        ) : _.isEmpty(myCourses) ? (
            <div className={styles.empty}>
                <p>{formatMessage({ id: 'header.mycourses.empty' })}</p>
                <div><Link to="/">{formatMessage({ id: 'header.mycourses.keep' })}</Link></div>
            </div>
        ) : (
            <div>
                <Scrollbars autoHeight autoHeightMax={270} className={styles.scrollEle}>
                    <List
                        dataSource={myCourses}
                        rowKey={item => item._id + _.uniqueId("mycourse_")}
                        renderItem={item => (
                            <Row className={styles.courseItem} onClick={() => handleGotoCourse(item._id)}>
                                <Col span={6} className={styles.avatar}>
                                    <img alt="course avatar" src={item.avatar} />
                                </Col>
                                <Col span={18} className={styles.info}>
                                    <div className={styles.name}>{truncate(item.title, 43)}</div>
                                    <div className={styles.authors}>{`By ${transAuthors(item.authors, 26)}`}</div>
                                    <div className={styles.progress}>
                                        <Tooltip placement="top" title={`${item.progress}%`}>
                                            <Progress percent={item.progress} size="small" showInfo={false} strokeColor={linearColorTheme} />
                                        </Tooltip>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    />
                </Scrollbars>
                <div className={styles.viewAll} onClick={handleViewAll}><Link to="/my-courses">{formatMessage({ id: 'header.mycourses.viewall' })}</Link></div>
            </div>
            
        )
    };

    const content = getContent();

    const trigger = (
        <div className={styles.trigger}>
            <span className={styles.text}>{formatMessage({ id: 'header.mycourses.trigger' })}</span>
            <Icon type={visible ? "up" : "down"} styles={{ fontSize: 18 }} />
        </div>
    );

    return (
        <Popover
            content={content}
            popupClassName={styles.popover}
            placement="bottom"
            trigger="click"
            visible={visible}
            popupAlign={{ offset: [3, -13] }}
            arrowPointAtCenter
            onVisibleChange={handleVisibleChange}
        >
            {trigger}
        </Popover>
    )
};

export default connect(
    ({ myCourses, loading }) => ({
        myCourses,
        loading: loading.effects['myCourses/fetch']
    })
)(MyCourses);