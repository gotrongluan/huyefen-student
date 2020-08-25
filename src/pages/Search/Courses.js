import React, { useEffect, useRef } from 'react';
import { connect } from 'dva';
import styles from './Courses.less';
import { Icon, List } from 'antd';
import _ from 'lodash';
import CourseInList from '@/components/CourseInList';
import Loading from '@/elements/spin/secondary';

const SearchCourses = ({ dispatch, location, ...props }) => {
	const listDivRef = useRef(null);
	const {
		isLoading,
		keyword,
		totalElements,
		courses,
		currentPage,
		pageSize,
		setQueryKeyword,
		setNewPage,
		searchCourses
	} = props;
	useEffect(() => {
		if (location.query.q !== undefined) {
			setQueryKeyword(location.query.q);
			setNewPage(1);
			searchCourses();
		}
	}, [location.query.q]);
	const handleChangePage = (newPage) => {
		setNewPage(newPage);
		searchCourses();
	};
	return (
		<div className={styles.searchCourses}>
			<div className={styles.searchText}>
				{`Search courses for keyword: ${keyword}`}
			</div>
			<div className={styles.total}>
				{`Total: ${totalElements} ${totalElements > 1 ? 'results' : 'result'}`}
			</div>
			<div className={styles.list}>
				<List
					loading={isLoading}
					itemLayout="horizontal"
					dataSource={courses}
					rowKey={course => course._id}
					pagination={totalElements > pageSize ? {
						total: totalElements,
						pageSize,
						current: currentPage,
						onChange: handleChangePage
					} : false}
					renderItem={course => (
						<div className={styles.courseInList}>
							<CourseInList course={course} />
						</div>
					)}
				/>
			</div>
		</div>
	)
};

export default connect(
	({ loading, searchCourses }) => ({
		isLoading: !!loading.effects['searchCourses/search'],
		totalElements: searchCourses.total,
		courses: searchCourses.list,
		currentPage: searchCourses.page,
		pageSize: searchCourses.pageSize,
		keyword: searchCourses.q
	}),
	(dispatch) => ({
		setQueryKeyword: keyword => dispatch({
			type: 'searchCourses/setQueryKeyword',
			payload: keyword
		}),
		setNewPage: newPage => dispatch({
			type: 'searchCourses/setNewPage',
			payload: newPage
		}),
		searchCourses: () => dispatch({
			type: 'searchCourses/search'
		})
	})
)(SearchCourses);