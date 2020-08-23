import React, { useState } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { AutoComplete, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './SearchEngine.less';
import { Link } from 'umi';
import router from 'umi/router';

const { OptGroup, Option } = AutoComplete;
const { Search } = Input;

const SearchEngine = ({ dispatch, curSearchText, suggestData, isLoading }) => {
	const debouncedSearchData = _.debounce((searchText) => {
		dispatch({
			type: 'search/suggest',
			payload: searchText
		});
	}, 300);
	const handleChangeSearchText = (searchText) => {
		console.log('dfdfd');
		debouncedSearchData(searchText);
	};
	const handleGotoItem = url => {
		router.push(url);
	}
	const getSuggestOptionsFromRawData = (suggestData) => {
		const keys = _.keys(suggestData);
		return _.map(keys, key => {
			const childrenData = getSuggestChildrenData(key, suggestData[key]);
			return (
				<OptGroup key={key} label={renderTitle(key)}>
					{_.map(childrenData, childData => (
						<Option key={childData.key} value={childData.url} label={childData.title}>
							{childData.title}
						</Option>
					))}
				</OptGroup>
			)
		});
	};
	const renderTitle = (key) => {
		let title;
		let routeTo;
		if (key === 'courses') {
			title = 'COURSES';
			routeTo = `/search/courses?q=${curSearchText}`;
		}
		else if (key === 'authors') {
			title = 'TEACHERS';
			routeTo = `/search/teachers?q=${curSearchText}`;
		}
		else if (key === 'users') {
			title = 'USERS';
			routeTo = `/search/users?q=${curSearchText}`;
		}
		return (
			<span>
				{title}
				<Link
					style={{ float: 'right', fontWeight: 'bold', color: '#FADA5E' }}
					to={routeTo}
				>
					More
				</Link>
			</span>
		);
	}
	const getSuggestChildrenData = (key, arrData) => {
		if (key === 'courses') {
			return _.map(arrData, item => ({
				key: item._id,
				title: item.title,
				url: `/course/${item._id}`
			}));
		}
		else if (key === 'authors') {
			return _.map(arrData, item => ({
				key: item._id,
				title: item.name,
				url: `/teacher/${item._id}`
			}));
		}
		else if (key === 'users') {
			return _.map(arrData, item => ({
				key: item._id,
				title: item.name,
				url: `/friend/${item._id}`
			}));
		}
		return [];
	};
	const suggestOptions = getSuggestOptionsFromRawData(suggestData);
	return (
		<AutoComplete
			className={styles.searchEngine}
			placeholder={formatMessage({ id: 'header.search.placeholder' })}
			optionLabelProp="label"
			size="large"
			dataSource={suggestOptions}
			onSearch={handleChangeSearchText}
			onSelect={handleGotoItem}
			value=""
		>
			<Search loading={isLoading} />
		</AutoComplete>
	);
};

export default connect(
	({ loading, search }) => ({
		suggestData: search.data,
		curSearchText: search.searchText,
		isLoading: !!loading.effects['search/suggest']
	})
)(SearchEngine);