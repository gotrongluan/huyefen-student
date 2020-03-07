import React from 'react';
import router from 'umi/router';
import { Tooltip } from 'antd';
import UserAvatar from '@/components/Avatar';
import { numberWithCommas } from '@/utils/utils';
import styles from './index.less';

const Instructor = ({ instructor }) => {
    return (
        <div className={styles.instructor} onClick={() => router.push(`/teacher/${instructor._id}`)}>
            <div className={styles.avatarCont}>
                <UserAvatar alt="ava" textSize={83} borderWidth={3} size={80} src={instructor.avatar} text={instructor.name} style={{ background: 'white', color: 'black', fontSize: '30px' }}/>
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