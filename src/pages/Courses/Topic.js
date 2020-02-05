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
import FilterOptionsList from '@/components/FilterOptionsList';
import { range } from '@/utils/utils';
import RECOMMEND from '@/assets/fakers/recommends';
import INSTRUCTORS from '@/assets/fakers/instructors1';
import COURSES from '@/assets/fakers/coursesInArea';
import FOO_COURSES from '@/assets/fakers/fooCourses';
import styles from './Topic.less';

const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;

const Topic = ({ match }) => { 
    const [filterOpen, setFilterOpen] = useState(false);
    const [topicInfo, setTopicInfo] = useState(null);
    const [recommend, setRecommend] = useState(null);
    const [recommendLoading, setRecommendLoading] = useState(false);
    const [instructors, setInstructors] = useState(null);
    const [instructorsLoading, setInstructorsLoading] = useState(false);
    const [courses, setCourses] = useState(null);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [sortByLoading, setSortByLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [changePageLoading, setChangePageLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setTopicInfo({
                _id: 1,
                title: 'Javascript'
            })
        }, 1000)
    }, [match.params.topicId]);
    useEffect(() => {
        setRecommendLoading(true);
        setTimeout(() => {
            setRecommend(RECOMMEND);
            setRecommendLoading(false);
        }, 2000);
    }, [match.params.topicId]);
    useEffect(() => {
        setInstructorsLoading(true);
        setTimeout(() => {
            setInstructors(INSTRUCTORS);
            setInstructorsLoading(false);
        }, 1900);
    }, [match.params.topicId]);
    useEffect(() => {
        setCoursesLoading(true);
        setTimeout(() => {
            //call api with topicId in filters.topic
            setCourses(COURSES);
            setCoursesLoading(false);
        }, 2000);
    }, [match.params.topicId]);

    const handleSortBy = sortBy => {
        setSortByLoading(true);
        setTimeout(() => {
            //handle with current filters, sortBy --> dispatch effect with (sortBy)
            setCourses({
                ...courses,
                sortBy
            })
            setSortByLoading(false);
        }, 1000);
    };

    const handleClear = () => {
        //subset of handleChange
        //filterLoading = loading.effects(['topic/change', 'topic/clear])!!!
        setFilterLoading(true);
        setTimeout(() => {
            //call api with only topicId in filters.topic
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
            ///call api with filters, ko can topicId truyen len;
            const { checked } = e.target;
            message.success(`${checked}`);
            const coursesData = { ...courses };
            if (checked)
                coursesData.filters[type].select.push(option);
            else coursesData.filters[type].select = _.filter(coursesData.filters[type].select, opt => opt !== option);
            coursesData.filters['topic'].list = _.concat(coursesData.filters['topic'].list, [
                {
                    _id: 1,
                    title: 'Javascript',
                    count: 564,
                },
                {
                    _id: 2,
                    title: 'jQuery',
                    count: 5,
                },
                {
                    _id: 3,
                    title: 'PHP',
                    count: 3,
                },
                {
                    _id: 4,
                    title: 'Angular',
                    count: 11,
                },
                {
                    _id: 5,
                    title: 'VueJS',
                    count: 103,
                },
                {
                    _id: 6,
                    title: 'React',
                    count: 2399,
                },
                {
                    _id: 7,
                    title: 'Typescript',
                    count: 20,
                },
                {
                    _id: 8,
                    title: 'Java',
                    count: 54,
                },
                {
                    _id: 9,
                    title: 'HTML5',
                    count: 55,
                },
                {
                    _id: 10,
                    title: 'CSS3',
                    count: 7,
                },
                {
                    _id: 11,
                    title: 'Laravel',
                    count: 18,
                },
                {
                    _id: 12,
                    title: 'NodeJS',
                    count: 1,
                },
                {
                    _id: 13,
                    title: 'ExpressJS',
                    count: 3,
                },
                {
                    _id: 14,
                    title: 'Wordpress',
                    count: 33,
                },
                {
                    _id: 15,
                    title: 'Firebase',
                    count: 34,
                },
                {
                    _id: 16,
                    title: 'Django',
                    count: 33,
                },
            ]);
            setCourses({ ...coursesData });
            setFilterLoading(false);
        }, 1500);
    };

    const handleChangePage = page => {
        setChangePageLoading(true);
        setTimeout(() => {
            //current filters, new pagination
            if (page % 2 === 0)
                setCourses({
                    ...courses,
                    list: [...FOO_COURSES]
                });
            else 
                setCourses(COURSES);
            setChangePageLoading(false);
        }, 1200);
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
            rowKey={option => (option._id || option.key) + _.uniqueId(`option_${type}_`)}
            initialCount={initialCount}
            stepCount={stepCount}
            renderItem={option => (
                <div className={styles.option}>
                    <Tooltip placement="bottom" mouseEnterDelay={1} title={`${option.title} (${option.count} ${option.count > 1 ? 'courses' : 'course'})`}>
                        {type === 'topic' && option._id.toString() === match.params.topicId ? (
                            <Checkbox 
                                className={styles.checkbox}
                                disabled
                                defaultChecked
                            >
                                <span className={styles.filterName}>{option.title}</span>
                                <span className={styles.count}>{option.count}</span>
                            </Checkbox>
                        ) : (
                            <Checkbox 
                                className={styles.checkbox}
                                checked={_.indexOf(courses.filters[type].select, (option._id || option.key)) > -1}
                                onChange={checked => handleFilter(type, (option._id || option.key), checked)}
                            >
                                <span className={styles.filterName}>{option.title}</span>
                                <span className={styles.count}>{option.count}</span>
                            </Checkbox>
                        )}
                        
                    </Tooltip>
                </div>
            )}
        />
    );

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
        <div className={styles.topic}>
            {topicInfo && (
                <div className={styles.jumpotron}>
                    <div className={styles.title}>{`${topicInfo.title} courses`}</div>
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
                        <div className={styles.title}>All courses in this topic</div>
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
                                                        {renderFilters('topic', 18, 3)}
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={styles.filterTitle}>
                                                        Topic
                                                    </div>
                                                    <div className={styles.filterOptions}>
                                                        {renderFilters('category', 6, 3)}
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
                                                        {renderFilters('language', 12, 4)}
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

export default Topic;
