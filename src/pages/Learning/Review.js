import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Rate, Button, Spin, Icon, message, Input, List, Modal } from 'antd';
import TimeAgo from 'react-timeago';
import styles from './Review.less';
import { roundStarRating } from '@/utils/utils';
import moment from 'moment';

const { TextArea } = Input;

const Review = ({ match, dispatch, ...props }) => {
    const [starVal, setStarVal] = useState(0);
    const [comment, setComment] = useState('');
    const {
        reviews,
        loading,
        addReviewLoading
    } = props;
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchReviews',
            payload: courseId
        });
        return () => {
            dispatch({ type: 'learning/resetReviews'});
        };
    }, [courseId]);
    const handleVoting = () => {
        if (starVal === 0) return message.error('You must rate before submitting!');
        dispatch({
            type: 'learning/addReview',
            payload: {
                courseId,
                starVal,
                comment
            }
        });
        setStarVal(0);
        setComment('');
    };
    return (
        <div className={styles.reviews}>
            {!reviews || loading ? (
                <div className={styles.loading}>
                    <div className={styles.inlineDiv}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: 64, color: '#FADA5E' }} spin/>} />
                    </div>
                </div>
            ) : (
                <div className={styles.reviewsData}>
                    <div className={styles.oldList}>
                        {!_.isEmpty(reviews) ? (
                          <React.Fragment>
                              <div className={styles.title}>
                                  Your reviews
                              </div>
                              <div className={styles.data}>
                                  <List
                                    itemLayout="horizontal"
                                    dataSource={reviews}
                                    renderItem={review => (
                                      <List.Item
                                        key={review._id}
                                        actions={[
                                            <span className={styles.extra}>
                                                <Icon type="like" theme="filled"/>
                                                <span style={{ paddingLeft: '8px' }}>{review.likes}</span>
                                            </span>,
                                            <span className={styles.extra}>
                                                <Icon type="dislike" theme="filled"/>
                                                <span style={{ paddingLeft: '8px' }}>{review.dislikes}</span>
                                            </span>
                                        ]}
                                      >
                                          <List.Item.Meta
                                            title={(
                                              <div className={styles.rating}>
                                                  <Rate className={styles.stars} disabled value={roundStarRating(review.starRating)} allowHalf style={{ fontSize: '14px' }}/>
                                                  <span className={styles.date}>
                                                      {moment(review.createdAt).format('MMM D, YYYY')}
                                                  </span>
                                              </div>
                                            )}
                                            description={review.comment ? <div className={styles.desc}>{review.comment}</div> : 'No comment.'}
                                          />
                                      </List.Item>
                                    )}
                                  />
                              </div>
                          </React.Fragment>
                        ) : (
                          <div className={styles.empty}>
                              You don't have any review yet.
                          </div>
                        )}
                    </div>
                    <div className={styles.newReview}>
                        <div className={styles.starRating}>
                            <Rate className={styles.star} allowHalf tooltips={['Terible', 'Bad', 'OK', 'Good', 'Great!']} value={starVal} onChange={value => setStarVal(value)} />
                        </div>
                        <div className={styles.comment}>
                            <TextArea
                                placeholder="Add review..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                autoSize={{
                                    minRows: 6,
                                    maxRows: 6
                                }}
                            />
                        </div>
                        <div className={styles.btn}>
                            <Button type="primary" onClick={handleVoting} icon="check">Submit</Button>
                        </div>
                    </div>
                    <Modal
                        className={styles.addReviewLoadingModal}
                        width={180}
                        visible={addReviewLoading}
                        footer={null}
                        closable={false}
                        maskClosable={false}
                        title={null}
                        centered
                        bodyStyle={{
                            padding: '10px'
                        }}
                    >
                        <div className={styles.icon}><Spin /></div>
                        <div className={styles.text}>Processing...</div>
                    </Modal>
                </div>
            )}
        </div>
    )
};

export default connect(
    ({ learning, loading }) => ({
        reviews: learning.reviews,
        loading: !!loading.effects['learning/fetchReview'],
        addReviewLoading: !!loading.effects['learning/addReview']
    })
)(Review);