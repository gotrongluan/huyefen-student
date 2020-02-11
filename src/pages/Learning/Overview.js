import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Descriptions, Divider, Avatar, Skeleton, Spin, Icon, List, Row } from 'antd';
import ViewMore from '@/components/ViewMore';
import { numberWithCommas, minutesToHour } from '@/utils/utils';
import styles from './Overview.less';

const InstructorMeta = ({ avatar, name, job }) => {
    return (
        <div className={styles.meta}>
            <div className={styles.avatarCont}>
                <Avatar alt="ins-ava" size={60} className={styles.avatar} shape="circle" src={avatar} />
            </div>
            <div className={styles.txt}>
                <div className={styles.name}>{name}</div>
                <div className={styles.job}>{job}</div>
            </div>
        </div>
    )
} 
const Overview = ({ match, dispatch, ...props }) => {
    const { courseId } = match.params;
    const {
        overview,
        instructors,
        overviewLoading,
        instructorsLoading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchOverview',
            payload: courseId
        });
        return () => dispatch({ type: 'learning/resetOverview'});
    }, [courseId]);
    useEffect(() => {
        dispatch({
            type: 'learning/fetchInstructors',
            payload: courseId
        });
        return () => dispatch({ type: 'learning/resetInstructors' });
    }, [courseId]);
    return (
        <div className={styles.overview}>
            <div className={styles.about}>
                <div className={styles.title}>About this course</div>
                <div className={styles.main}>
                    {!overview || overviewLoading ? (
                        <div className={styles.loading}>
                            <div className={styles.inlineDiv}>
                                <Spin indicator={<Icon type="loading-3-quarters" style={{ fontSize: 36 }} spin/>} />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.summary}>
                                {overview.summary}
                            </div>
                            <Descriptions
                                bordered
                                column={3}
                                size="middle"
                                title={null}
                                className={styles.table}
                            >
                                <Descriptions.Item label="Level">
                                    {overview.level}
                                </Descriptions.Item>
                                <Descriptions.Item label="Lectures">{overview.numOfLectures}</Descriptions.Item>
                                <Descriptions.Item label="Estimate time">{minutesToHour(overview.totalTime)}</Descriptions.Item>
                                <Descriptions.Item label="Languages">{overview.language}</Descriptions.Item>
                                <Descriptions.Item label="Students">{numberWithCommas(overview.numOfEnrolled)}</Descriptions.Item>
                                <Descriptions.Item label="Ratings">
                                    <span className={styles.value}>{overview.starRating}</span>
                                    <Icon type="star" theme="filled" style={{ color: '#fada5e', marginLeft: 7 }} />
                                </Descriptions.Item>
                                <Descriptions.Item span={3} label="Description">
                                    <ViewMore height={400}>
                                        <div className={styles.description} dangerouslySetInnerHTML={{ __html: overview.description }} />
                                    </ViewMore>
                                </Descriptions.Item>
                                <Descriptions.Item span={3} label="What you'll learn">
                                    <ViewMore height={300}>
                                        <List
                                            className={styles.whatLearn}
                                            dataSource={overview.whatLearn}
                                            itemLayout="horizontal"
                                            split={false}
                                            renderItem={item => (
                                                <List.Item key={_.uniqueId('what_learn_')} className={styles.listItem}>
                                                    <List.Item.Meta
                                                        avatar={<Avatar size={11} icon="check" style={{ background: '#fada5e', color: 'black' }}/>}
                                                        title={<span className={styles.item} dangerouslySetInnerHTML={{ __html: item }}/>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </ViewMore>
                                    
                                </Descriptions.Item>
                                <Descriptions.Item span={3} label="Requirements">
                                    <ViewMore height={300}>
                                        <List
                                            className={styles.requirements}
                                            dataSource={overview.requirements}
                                            itemLayout="horizontal"
                                            split={false}
                                            renderItem={item => (
                                                <List.Item key={_.uniqueId('requirement_')} className={styles.listItem}>
                                                    <List.Item.Meta
                                                        avatar={<Avatar size={11} icon="link" style={{ background: '#fada5e', color: 'black' }}/>}
                                                        title={<span className={styles.item} dangerouslySetInnerHTML={{ __html: item }}/>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </ViewMore>
                                </Descriptions.Item>
                            </Descriptions>
                        </>
                    )}
                </div>
            </div>
            
            <div className={styles.instructors}>
                <div className={styles.title}>Instructors</div>
                <div className={styles.main}>
                    {!instructors || instructorsLoading ? (
                        <div className={styles.loading}>
                            <Skeleton active avatar={{ size: 60, shape: 'circle' }} title={false} paragraph={{ rows: 2, width: ['40%', '82%']}} />
                            <br />
                            <Skeleton active title={false} paragraph={{ rows: 4, width: ['90%', '68%', '77%', '34%']}}/>
                        </div>
                    ) : (
                        <div className={styles.content}>
                            {_.map(instructors, (instructor, i) => (
                                <React.Fragment key={instructor._id}>
                                    {i > 0 && (<Divider dashed className={styles.divider} />)}
                                    <Row className={styles.instructor}>
                                        <Row className={styles.info}>
                                            <InstructorMeta
                                                avatar={instructor.avatar}
                                                name={instructor.name}
                                                job={instructor.job}
                                            />
                                        </Row>
                                        <Row className={styles.biography}>
                                            <ViewMore height={360}>
                                                <div dangerouslySetInnerHTML={{ __html: instructor.biography }} />
                                            </ViewMore>
                                        </Row>
                                    </Row>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) 
};

export default connect(
    ({ learning, loading }) => ({
        overview: learning.overview,
        instructors: learning.instructors,
        overviewLoading: !!loading.effects['learning/fetchOverview'],
        instructorsLoading: !!loading.effects['learning/fetchInstructors']
    })
)(Overview);