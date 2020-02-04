import React from 'react';
import router from 'umi/router';
import { Avatar, Tooltip } from 'antd';
import { numberWithCommas } from '@/utils/utils';
import styles from './index.less';

const Instructor = ({ instructor }) => {
    return (
        <div className={styles.instructor} onClick={() => router.push(`/teacher/${instructor._id}`)}>
            <div className={styles.avatarCont}>
                <Avatar alt="ava" className={styles.avatar} size={80} shape='circle' src={instructor.avatar} />
            </div>
            <div className={styles.name}>
                <Tooltip placement="bottom" title={instructor.name}>
                    {instructor.name}
                </Tooltip>
            </div>
            <div className={styles.job}>
                <Tooltip placement="bottom" title={instructor.job}>
                    {instructor.job}
                </Tooltip>
            </div>
            <div className={styles.numOfStudents}>
                <span className={styles.value}>{`${numberWithCommas(instructor.numOfStudents)}`}</span>
                <span>{instructor.numOfStudents > 1 ? ' students' : ' student'}</span>
            </div>
            <div className={styles.numOfCourses}>
                <span className={styles.value}>{`${numberWithCommas(instructor.numOfCourses)}`}</span>
                <span>{instructor.numOfCourses > 1 ? ' courses' : ' course'}</span>
            </div>
        </div>
    )
};

export default Instructor;