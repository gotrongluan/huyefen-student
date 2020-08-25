import React from 'react';
import { connect } from 'dva';
import styles from './Topics.less';

const SearchUsers = ({ dispatch, match }) => {
	return (
		<div className={styles.searchUsers}>
			Search courses
		</div>
	)
};

export default connect()(SearchUsers);