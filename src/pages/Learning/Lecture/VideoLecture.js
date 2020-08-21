import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import VideoPlayer from '@/components/Video/Default';
import Lecture from './Lecture';
import styles from './VideoLecture.less';

const VideoLecture = ({ dispatch }) => {
    const handleSelectResolution = resolution => {
        dispatch({
            type: 'learning/saveResolution',
            payload: resolution
        });
    };
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
                            />
                        )}
                    </div>
                )}
            </Lecture>
        </div>
    )
};

export default connect()(VideoLecture);