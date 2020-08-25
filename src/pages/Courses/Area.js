import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Tabs, List, Carousel, Spin, Icon, Select, Checkbox, Button, Tooltip, Collapse, Badge, Rate, Row, Col, message } from 'antd';
import CourseInList from '@/components/CourseInList';
import Loading from '@/elements/spin/secondary';
import ArrowCarousel from '@/components/ArrowCarousel';
import CourseInCarousel from '@/components/CourseCarouselItem';
import Instructor from '@/components/Instructor';
import FilterOptionsList from '@/components/FilterOptionsList';
import { range } from '@/utils/utils';
import styles from './Area.less';
import router from 'umi/router';

const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const Area = ({ match, dispatch, ...props }) => { 
    const [filterOpen, setFilterOpen] = useState(false);
    const { areaId } = match.params;
    const {
        infoLoading,
        recommendLoading,
        topicsLoading,
        instructorsLoading,
        coursesLoading,
        filterLoading,
        sortByLoading,
        changePageLoading,
        areaInfo,
        recommend,
        topics,
        instructors,
        courses
    } = props;
    useEffect(() => {
        dispatch({
            type: 'area/fetchInfo',
            payload: areaId
        });
        return () => dispatch({
            type: 'area/resetInfo'
        });
    }, [areaId]);
    useEffect(() => {
        dispatch({
            type: 'area/fetchRecommendCourses',
            payload: areaId
        });
        return () => dispatch({
            type: 'area/resetRecommend'
        });
    }, [areaId]);
    useEffect(() => {
        dispatch({
            type: 'area/fetchTopTopics',
            payload: areaId
        });
        return () => dispatch({
            type: 'area/resetTopics'
        });
    }, [areaId]);
    useEffect(() => {
        dispatch({
            type: 'area/fetchTopInstructors',
            payload: areaId
        });
        return () => dispatch({
            type: 'area/resetInstructors'
        });
    }, [areaId]);
    useEffect(() => {
        dispatch({
            type: 'area/fetchCourses',
            payload: areaId
        });
        return () => dispatch({
            type: 'area/resetCourses'
        });
    }, [areaId]);

    const handleSortBy = sortBy => {
        dispatch({
            type: 'area/sortCourses',
            payload: sortBy
        });
    };

    const handleClear = () => {
        dispatch({
            type: 'area/clear'
        });
    };

    const handleFilter = (type, option, e) => {
        const checked = e.target.checked;
        dispatch({
            type: 'area/filter',
            payload: {
                type, option, checked
            }
        });
    };

    const handleChangePage = page => {
        dispatch({
            type: 'area/changePage',
            payload: page
        });
    };

    const coursesCarousel = (courses) => {
        return (
            <ArrowCarousel
                pageSize={5}
                speed={500}
                buttonSize={34}
                dataSource={courses}
                renderItem={course => (
                    <div className={styles.courseItem} key={course._id + _.uniqueId('course_')}>
                        <CourseInCarousel course={course} />
                    </div>
                )}
                renderEmptyItem={() => <div className={styles.courseItem} />}
            />
        )
    };
    const courseSkeletonsCarousel = () => {
        return (
            <Carousel
                arrow={false}
                dots={false}
                slidesToShow={5}
            >
                {_.map(range(5), n => (
                    <div className={styles.courseItem} key={n + _.uniqueId('course_skeleton_')}>
                        <div className={styles.courseSkeleton}>
                            <div className={classNames(styles.avatar, styles.skeletonBox)} />
                            <div className={styles.info}>
                                <div className={classNames(styles.name, styles.skeletonBox)} />
                                <div className={classNames(styles.authors, styles.skeletonBox)} />
                                <div className={classNames(styles.price, styles.skeletonBox)} />
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        )
    };

    const topicsCarousel = topics => {
        const topicsData = _.chunk(topics, 2);
        return (
            <ArrowCarousel
                pageSize={5}
                speed={500}
                buttonSize={34}
                dataSource={topicsData}
                renderItem={topicsPair => (
                    <div className={styles.pairItem} key={topicsPair[0]._id + _.uniqueId('topics_')}>
                        <div className={styles.topic} style={{ marginBottom: '10px' }} onClick={() => router.push(`/courses/topic/${topicsPair[0]._id}`)}>{formatMessage({ id: topicsPair[0].name })}</div>
                        {topicsPair[1] && <div className={styles.topic} onClick={() => router.push(`/courses/topic/${topicsPair[1]._id}`)}>{formatMessage({ id: topicsPair[1].name })}</div>}
                    </div>
                )}
                renderEmptyItem={() => <div className={styles.pairtem} />}
            />
        )
    };

    const instructorsCarousel = instructors => {
        return (
            <ArrowCarousel
                pageSize={5}
                speed={500}
                buttonSize={34}
                dataSource={instructors}
                renderItem={instructor => (
                    <div className={styles.instructorItem} key={instructor._id + _.uniqueId('instructor_')}>
                        <Instructor instructor={instructor} />
                    </div>
                )}
                renderEmptyItem={() => <div className={styles.instructorItem} />}
            />
        )
    };

    const renderFilters = (type, initialCount = 100, stepCount = 1) => (
        <FilterOptionsList
            dataSource={courses.filters[type].list}
            rowKey={option => `${(option._id || option.key)}_${type}`}
            initialCount={initialCount}
            stepCount={stepCount}
            renderItem={option => (
                <div className={styles.option}>
                    <Tooltip placement="bottom" mouseEnterDelay={1} title={`${option.title} (${option.count} ${option.count > 1 ? 'courses' : 'course'})`}>
                        <Checkbox 
                            className={styles.checkbox}
                            checked={_.indexOf(courses.filters[type].select, (option._id || option.key)) > -1}
                            onChange={checked => handleFilter(type, (option._id || option.key), checked)}
                        >
                            <span className={styles.filterName}>{option.title}</span>
                            <span className={styles.count}>{option.count}</span>
                        </Checkbox>
                    </Tooltip>
                </div>
            )}
        />
    );

    const renderStarRatings = () => _.map(courses.filters['ratings'].list, option => (
        <div className={classNames(styles.option, styles.ratingOption)} key={`${(option._id || option.key)}_ratings`}>
            <Tooltip placement="bottom" mouseEnterDelay={1} title={`${option.title} (${option.count} ${option.count > 1 ? 'courses' : 'course'})`}>
                <Checkbox
                    className={styles.checkbox}
                    checked={_.indexOf(courses.filters['ratings'].select, (option._id || option.key)) > -1}
                    onChange={checked => handleFilter('ratings', (option._id || option.key), checked)}
                >
                    <span>
                        <Rate disabled value={option.star} className={styles.star}/>
                    </span>
                    <span className={styles.filterName}>{option.title}</span>
                    <span className={styles.count}>{option.count}</span>
                </Checkbox>
            </Tooltip>
        </div>
    ));

    let isClearable;
    if (courses) isClearable = _.some(_.map(_.values(courses.filters), subFilter => subFilter.select.length > 0));

    return (
        <div className={styles.area}>
            {!infoLoading && areaInfo && (
                <div className={styles.jumpotron}>
                    <div className={styles.title}>{`${areaInfo.title} courses`}</div>
                </div>
            )}
            <div className={styles.main}>
                {!recommend || recommendLoading ? (
                    <div className={styles.recommendLoading}>
                        {courseSkeletonsCarousel()}
                    </div>
                ) : (
                    <div className={styles.recommend}>
                        <div className={styles.title}>Courses to get you started</div>
                        <div className={styles.content}>
                            <Tabs animated={false}>
                                {_.map(recommend, recommendType => (
                                    <TabPane tab={recommendType.title} key={recommendType.key}>
                                        <div>{coursesCarousel(recommendType.courses)}</div>
                                    </TabPane>
                                ))}
                            </Tabs>
                        </div>
                    </div>
                )}
                {!topicsLoading && topics && !_.isEmpty(topics) && (
                    <div className={styles.topics}>
                        <div className={styles.title}>Most popular topics</div>
                        <div className={styles.content}>
                            {topicsCarousel(topics)}
                        </div>
                    </div>
                )}
                {!instructorsLoading && instructors && !_.isEmpty(instructors) && (
                    <div className={styles.instructors}>
                        <div className={styles.title}>Popular instructors</div>
                        <div className={styles.content}>
                            {instructorsCarousel(instructors)}
                        </div>
                    </div>
                )}
                {!courses || coursesLoading ? (
                    <div className={styles.coursesLoading}>
                        <Spin indicator={<Icon type="loading" spin style={{ fontSize: 64 }} />} />
                    </div>
                ) : (
                    <div className={styles.courses}>
                        <div className={styles.title}>All courses in this area</div>
                        <div className={styles.content}>
                            <Loading isCenter fontSize={8} spinning={!!filterLoading}>
                                <div className={styles.filter}>
                                    <div className={styles.btns}>
                                        {!filterOpen ? (
                                            <Badge dot={isClearable} style={{ background: '#fe7f9c' }}>
                                                <Button className={styles.filterOpen} onClick={() => setFilterOpen(true)}>
                                                    <Icon type="filter" />
                                                    Filter
                                                </Button>
                                            </Badge>
                                        ) : (
                                            <React.Fragment>
                                                <Button className={styles.done} type="primary" onClick={() => setFilterOpen(false)}>
                                                    <Icon type="check-circle" />
                                                    Done
                                                </Button>
                                                {isClearable && (
                                                    <Button className={styles.clear} onClick={handleClear}>
                                                        <Icon type="close" />
                                                        Clear
                                                    </Button>
                                                )}
                                            </React.Fragment>
                                        )}
                                        <span style={{ marginLeft: '20px' }}>Sort by:</span>
                                        <Select
                                            className={styles.sortBy}
                                            value={courses.sortBy}
                                            onChange={val => handleSortBy(val)}
                                            dropdownMatchSelectWidth={false}
                                            loading={sortByLoading}
                                        >
                                            <Option value="highest-rated">Highest rated</Option>
                                            <Option value="popularity">Popularity</Option>
                                            <Option value="newest">Newest</Option>
                                        </Select>
                                    </div>
                                    <Collapse
                                        bordered={false}
                                        activeKey={filterOpen ? ['filter'] : null}
                                    >
                                        <Panel key="filter" showArrow={false} className={styles.filterPanel}>
                                            <Row gutter={8}>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Topic
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('topics', 10, 3)}
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Category
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('categories', 6, 3)}
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Level
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('levels')}
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Language
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('languages', 12, 4)}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row gutter={8} style={{ marginTop: '10px' }}>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Price
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('prices')}
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Rating
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderStarRatings()}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Panel>
                                    </Collapse>
                                </div>
                                <Loading fontSize={6} isCenter spinning={!!sortByLoading || !!changePageLoading}>
                                    <div className={styles.list}>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={courses.list}
                                            rowKey={course => course._id + _.uniqueId('course_')}
                                            pagination={courses.total > 8 ? {
                                                total: courses.total,
                                                pageSize: 8,
                                                defaultCurrent: 1,
                                                onChange: handleChangePage
                                            } : false}
                                            renderItem={course => (
                                                <div className={styles.courseInList}>
                                                    <CourseInList course={course} />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </Loading>

                            </Loading>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default connect(
    ({ area, loading }) => ({
        infoLoading: loading.effects['area/fetchInfo'],
        recommendLoading: loading.effects['area/fetchRecommendCourses'],
        topicsLoading: loading.effects['area/fetchTopTopics'],
        instructorsLoading: loading.effects['area/fetchTopInstructors'],
        coursesLoading: loading.effects['area/fetchCourses'],
        filterLoading: loading.effects['area/filter'] || loading.effects['area/clear'],
        sortByLoading: loading.effects['area/sortCourses'],
        changePageLoading: loading.effects['area/changePage'],
        areaInfo: area.info,
        recommend: area.recommend,
        topics: area.topics,
        instructors: area.instructors,
        courses: area.courses
    })
)(Area);
