import React from 'react';
import { connect } from 'dva';
import styles from './Teachers.less';

const SearchTeachers = ({ dispatch, match }) => {
	return (
		<div className={styles.searchTeachers}>
			Search courses
		</div>
	)
};

export default connect()(SearchTeachers);