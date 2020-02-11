import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Rate, Button, Spin, Icon, message } from 'antd';
import { Editor, EditorState } from 'draft-js';
import { exportToHTML } from '@/utils/editor';
import TimeAgo from 'react-timeago';
import styles from './Review.less';

const Review = ({ match, dispatch, ...props }) => {
    const [starVal, setStarVal] = useState(0);
    const [comment, setComment] = useState(EditorState.createEmpty());
    const {
        review,
        loading
    } = props;
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchReview',
            payload: courseId
        });
        return () => {
            dispatch({ type: 'learning/resetReview '});
            setStarVal(0);
            setComment(EditorState.createEmpty());
        };
    }, [courseId]);
    const handleVoting = () => {
        if (starVal === 0) return message.error('You must rate before submitting!');
        setStarVal(0);
        setComment(EditorState.createEmpty());
        //submit(courseId, starVal, comment);
    };
    return (
        <div className={styles.review}>
            {!review || loading ? (
                <div className={styles.loading}>
                    <div className={styles.inlineDiv}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: 64, color: '#FADA5E' }} spin/>} />
                    </div>
                </div>
            ) : (
                <React.Fragment>
                    {!_.isEmpty(review) && (
                        <div className={styles.lastVote}>
                            <div className={styles.title}>Last review</div>
                            <div className={styles.starRating}>
                                <Rate className={styles.star} allowHalf tooltips={['Terible', 'Bad', 'OK', 'Good', 'Great!']} value={review.starRating} disabled/>
                            </div>
                            <div className={styles.time}>
                                <TimeAgo date={review.createdAt} />
                            </div>
                            <div className={styles.comment} dangerouslySetInnerHTML={{ __html: review.comment }} />
                        </div>
                    )}
                    <div className={styles.vote}>
                        <div className={styles.title}>
                            {_.isEmpty(review) ? 'How do you think about this course?' : 'Make rating again'}
                        </div>
                        <div className={styles.starRating}>
                            <Rate className={styles.star} allowHalf tooltips={['Terible', 'Bad', 'OK', 'Good', 'Great!']} value={starVal} onChange={value => setStarVal(value)} />
                        </div>
                        <div className={styles.comment}>
                            <Editor
                                placeholder="Enter comment..."
                                editorState={comment}
                                onChange={editorState => setComment(editorState)}
                            />
                        </div>
                        <div className={styles.btn}>
                            <Button type="primary" onClick={handleVoting}><Icon type="check" />{_.isEmpty(review) ? ' Submit rating' : ' Update rating'}</Button>
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    )
};

export default connect(
    ({ learning, loading }) => ({
        review: learning.review,
        loading: !!loading.effects['learning/fetchReview']
    })
)(Review);