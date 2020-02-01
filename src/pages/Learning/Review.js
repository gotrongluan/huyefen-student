import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Rate, Input, Button, Spin, Icon, message } from 'antd';
import TimeAgo from 'react-timeago';
import styles from './Review.less';

const Review = ({ match }) => {
    const [review, setReview] = useState(null);
    const [initLoading, setInitLoading] = useState(false);
    const [starVal, setStarVal] = useState(0);
    const [comment, setComment] = useState('');
    useEffect(() => {
        setInitLoading(true);
        setTimeout(() => {
            setReview({});
            setInitLoading(false);
        }, 1200);
    }, []);
    const handleVoting = () => {
        const courseId = match.params.courseId;
        if (starVal === 0) return message.error('You must rate before submitting!');
        //submit(courseId, starVal, comment);
    };
    return (
        <div className={styles.review}>
            {!review || initLoading ? (
                <div className={styles.loading}>
                    <div className={styles.inlineDiv}>
                        <Spin indicator={<Icon type="loading" style={{ fontSize: 64, color: '#FADA5E' }} spin/>} />
                    </div>
                </div>
            ) : (
                <React.Fragment>
                    {!_.isEmpty(review) && (<div>This is</div>)}
                    <div className={styles.vote}>
                        <div className={styles.title}>
                            {_.isEmpty(review) ? 'How do you think about this course?' : 'Make rating again'}
                        </div>
                        <div className={styles.starRating}>
                            <Rate className={styles.star} allowHalf tooltips={['Terible', 'Bad', 'OK', 'Good', 'Great!']} value={starVal} onChange={value => setStarVal(value)} />
                        </div>
                        <div className={styles.comment}>
                            <Input.TextArea
                                autoSize={{
                                    minRows: 8,
                                    maxRows: 10
                                }}
                                placeholder="Enter your comment..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
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

export default Review;