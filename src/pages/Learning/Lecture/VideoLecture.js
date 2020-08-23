import React from 'react';
import { connect } from 'dva';
import { Spin, Modal } from 'antd';
import VideoPlayer from '@/components/Video/Default';
import Lecture from './Lecture';
import styles from './VideoLecture.less';
import router from 'umi/router';

const VideoLecture = ({ match, nextLecture, isCompleted, dispatch }) => {
    const { courseId, chapterId, lectureId } = match.params;
    const handleSelectResolution = resolution => {
        dispatch({
            type: 'learning/saveResolution',
            payload: resolution
        });
    };

    const handleGoToNextLecture = (nextLecture) => {
        console.log(nextLecture);
        if (!nextLecture) {
            return;
        }

        const { _id, type } = nextLecture;
        router.push(`/learning/${courseId}/${chapterId}/lecture/${type === 'Article' ? 'article' : 'video'}/${_id}`);
    }

    const handleComplete = () => {
        if (!isCompleted) {
            dispatch({
                type: 'learning/setComplete',
                payload: {
                    courseId,
                    chapterId,
                    lectureId
                }
            });
        }
    }

    return (
        <div className={styles.video}>
            <Lecture
                type={'Video'}
            >
                {(lecture, loading) => (
                    <div className={styles.container}>
                        {!lecture || loading ? (
                            <div className={styles.loading}>
                                <Spin tip="Fetching..." />
                            </div>
                        ) : (
                            <VideoPlayer
                                videoRes={lecture.videoRes}
                                resolutions={lecture.resolutions}
                                baseWidth={"100%"}
                                baseHeight={550}
                                captions={lecture.captions || []}
                                onSelectResolution={handleSelectResolution}
                                downloadable={lecture.isDownloaded}
                                onFinish={handleComplete}
                                nextLecture={nextLecture}
                                onGoToNextLecture={handleGoToNextLecture}
                            />
                        )}
                    </div>
                )}
            </Lecture>
        </div>
    )
};

export default connect(
    ({ learning }) => ({
        isCompleted: learning.lecture && learning.lecture.isCompleted,
        nextLecture: learning.lecture && learning.lecture.nextLecture
    })
)(VideoLecture);