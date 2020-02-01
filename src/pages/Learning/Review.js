import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Rate, Input, Button, Spin, Icon, message } from 'antd';
import { Editor, EditorState } from 'draft-js';
import { exportToHTML } from '@/utils/editor';
import TimeAgo from 'react-timeago';
import styles from './Review.less';

const Review = ({ match }) => {
    const [review, setReview] = useState(null);
    const [initLoading, setInitLoading] = useState(false);
    const [starVal, setStarVal] = useState(0);
    const [comment, setComment] = useState(EditorState.createEmpty());
    useEffect(() => {
        setInitLoading(true);
        setTimeout(() => {
            setReview({
                _id: 1,
                starRating: 3.5,
                comment: '<p>Hi Nick, This is a really good beginner\'s Django 2.2 course. I have bought your advanced one as I want to know about CRUD functions in Django and forms. Your explanations are clear and precise. I like your sense of humour in the course. If you can please produce courses on more frameworks of python like flask and using different databases for example MongoDB. Well Done Nick on creating this course.</p><div>This is a very good course. I think if I want to fuck my love, I will learn this course. Thao is my ex-girl friend. I put my pennis into her and she feel very very Oh oh.</div><div>I will be here today. See you again!!</div>',
                createdAt: 1578813445900
            });
            setInitLoading(false);
        }, 1200);
    }, []);
    const handleVoting = () => {
        const courseId = match.params.courseId;
        if (starVal === 0) return message.error('You must rate before submitting!');
        setStarVal(0);
        setComment(EditorState.createEmpty());
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

export default Review;