import React, { useEffect } from 'react';
import { connect } from 'dva';
import { message } from 'antd';

const ForumLayout = ({ match, children, dispatch }) => {
    const { courseId } = match.params;
    useEffect(() => {
        dispatch({
            type: 'learning/fetchQuestions',
            payload: courseId
        });
        dispatch({
            type: 'learning/fetchLectureOpts',
            payload: courseId
        });
        return () => dispatch({
            type: 'learning/resetForum'
        });
    }, []);
    return children;
};

export default connect()(ForumLayout);