import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Tabs, List, Carousel, Spin, Icon, Select, Checkbox, Button, Tooltip, Collapse, Badge, Rate, Row, Col, message } from 'antd';
import CourseInList from '@/components/CourseInList';
import Loading from '@/elements/spin/secondary';
import ArrowCarousel from '@/components/ArrowCarousel';
import CourseInCarousel from '@/components/CourseCarouselItem';
import Instructor from '@/components/Instructor';
import { range } from '@/utils/utils';
import RECOMMEND from '@/assets/fakers/recommends';
import TOP_TOPICS from '@/assets/fakers/topTopics';
import INSTRUCTORS from '@/assets/fakers/instructors1';
import COURSES from '@/assets/fakers/coursesInArea';
import FOO_COURSES from '@/assets/fakers/fooCourses';
import styles from './Category.less';
import router from 'umi/router';

const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const Category = ({ match }) => { 
    const [filterOpen, setFilterOpen] = useState(false);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [recommend, setRecommend] = useState(null);
    const [recommendLoading, setRecommendLoading] = useState(false);
    const [topics, setTopics] = useState(null);
    const [instructors, setInstructors] = useState(null);
    const [courses, setCourses] = useState(null);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [sortByLoading, setSortByLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [changePageLoading, setChangePageLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setCategoryInfo({
                _id: 1,
                title: 'Web Development'
            })
        }, 1000)
    }, [match.params.categoryId]);
    useEffect(() => {
        setRecommendLoading(true);
        setTimeout(() => {
            setRecommend(RECOMMEND);
            setRecommendLoading(false);
        }, 2000);
    }, [match.params.categoryId]);
    useEffect(() => {
        setTimeout(() => {
            setTopics(TOP_TOPICS);
        }, 1600);
    }, [match.params.categoryId]);
    useEffect(() => {
        setTimeout(() => {
            setInstructors(INSTRUCTORS);
        }, 1900);
    }, [match.params.categoryId]);
    useEffect(() => {
        setCoursesLoading(true);
        setTimeout(() => {
            setCourses(COURSES);
            setCoursesLoading(false);
        }, 2000);
    }, [match.params.categoryId]);

    const handleSortBy = sortBy => {
        setSortByLoading(true);
        setTimeout(() => {
            //handle with categoryId, current filters, sortBy --> dispatch effect with (categoryId, sortBy)
            setCourses({
                ...courses,
                sortBy
            })
            setSortByLoading(false);
        }, 1000);
    };

    const handleClear = () => {
        //subset of handleChange
        //filterLoading = loading.effects(['category/change', 'category/clear])!!!
        setFilterLoading(true);
        setTimeout(() => {
            //call api with categoryId, no filters.
            setFilterLoading(false);
        }, 1300);
    };

    const handleFilter = (type, option, e) => {
        setFilterLoading(true);
        setTimeout(() => {
            // let { filters } = courses;
            // filters = _.mapValues(filters, 'select');
            // if (checked) filters[type].push(option);
            // else filters[type] = _.filter(filters[type], opt => opt !== option);
            // console.log(filters);
            ///call api with filters;
            const { checked } = e.target;
            message.success(`${checked}`);
            const coursesData = { ...courses };
            if (checked)
                coursesData.filters[type].select.push(option);
            else coursesData.filters[type].select = _.filter(coursesData.filters[type].select, opt => opt !== option);
            setCourses({ ...coursesData });
            setFilterLoading(false);
        }, 1500);
    };

    const handleChangePage = page => {
        setChangePageLoading(true);
        setTimeout(() => {
            if (page % 2 === 0)
                setCourses({
                    ...courses,
                    list: [...FOO_COURSES]
                });
            else 
                setCourses(COURSES);
            setChangePageLoading(false);
        }, 1200);
    }

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

    const renderFilters = type => _.map(courses.filters[type].list, option => (
        <div className={styles.option} key={(option._id || option.key) + _.uniqueId('option_')}>
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
    ));

    const renderStarRatings = () => _.map(courses.filters['starRating'].list, option => (
        <div className={classNames(styles.option, styles.ratingOption)} key={(option._id || option.key) + _.uniqueId('option_')}>
            <Tooltip placement="bottom" mouseEnterDelay={1} title={`${option.title} (${option.count} ${option.count > 1 ? 'courses' : 'course'})`}>
                <Checkbox
                    className={styles.checkbox}
                    checked={_.indexOf(courses.filters['starRating'].select, (option._id || option.key)) > -1}
                    onChange={checked => handleFilter('starRating', (option._id || option.key), checked)}
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
        <div className={styles.category}>
            {categoryInfo && (
                <div className={styles.jumpotron}>
                    <div className={styles.title}>{`${categoryInfo.title} courses`}</div>
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
                {topics && !_.isEmpty(topics) && (
                    <div className={styles.topics}>
                        <div className={styles.title}>Most popular topics</div>
                        <div className={styles.content}>
                            {topicsCarousel(topics)}
                        </div>
                    </div>
                )}
                {instructors && !_.isEmpty(instructors) && (
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
                        <div className={styles.title}>All courses in this category</div>
                        <div className={styles.content}>
                            <Loading isCenter fontSize={8} spinning={filterLoading}>
                                <div className={styles.filter}>
                                    <div className={styles.btns}>
                                        {!filterOpen ? (
                                            <Badge dot={isClearable} style={{ background: '#FE7F9C' }}>
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
                                            <Option value="lowest-price">Lowest price</Option>
                                            <Option value="highest-price">Highest price</Option>
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
                                                        {renderFilters('topic')}
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Category
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('category')}
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Level
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('level')}
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Language
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('language')}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row gutter={8} style={{ marginTop: '10px' }}>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Price
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('price')}
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
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Lecture
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('lecture')}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Panel>
                                    </Collapse>
                                </div>
                                <Loading fontSize={6} isCenter spinning={sortByLoading || changePageLoading}>
                                    <div className={styles.list}>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={courses.list}
                                            rowKey={course => course._id + _.uniqueId('course_')}
                                            pagination={courses.pagination.total > 8 ? {
                                                total: courses.pagination.total,
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

export default Category;
