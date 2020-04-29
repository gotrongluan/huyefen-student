import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import classNames from 'classnames';
import TimeAgo from 'react-timeago';
import { Row, Col, Rate, Button, Tabs, Icon, Skeleton, Spin, List, Divider, Avatar, Collapse, Table, Modal, message } from 'antd';
import { YoutubeFilled, ReadOutlined } from '@ant-design/icons';
import UserAvatar from '@/components/Avatar';
import TeacherCourse from '@/components/TeacherCourse';
import FeaturedBadge from '@/components/FeaturedBadge';
import ViewMore from '@/components/ViewMore';
import Sticky from 'react-sticky-el';
import { roundStarRating, numberWithCommas, minutesToHour, transAuthors } from '@/utils/utils';
import storage from '@/utils/storage';
import styles from './Detail.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const Loading = () => {
    return (
        <div className={styles.loading}>
            <div className={styles.inlineDiv}>
                <Spin indicator={<Icon type="loading" style={{ fontSize:'5em' }} spin />} />
            </div>
        </div>
    );
};

const Syllabus = ({ data: syllabus, handlePreview }) => {
    const countLecturesAll = _.map(syllabus, chapter => chapter.lectures.length);
    const totalLectures = _.sum(countLecturesAll);
    const times = _.map(syllabus, chapter => _.sumBy(chapter.lectures, 'time'));
    const totalTime = _.sum(times);
    const defaultActiveKey = _.map(syllabus, chapter => chapter._id);
    return (
        <React.Fragment>
            <Row className={styles.header}>
                <Col span={12} className={styles.title}>
                    Course content
                </Col>
                <Col span={12} className={styles.extra}>
                    <span className={styles.totalLectures}>{`${totalLectures} lectures`}</span>
                    <span className={styles.totalTime}>{`${minutesToHour(totalTime)}`}</span>
                </Col>
            </Row>
            <Row className={styles.main}>
                <Collapse
                    defaultActiveKey={defaultActiveKey}
                >
                    {_.map(syllabus, (chapter, index) => (
                        <Panel
                            header={chapter.title}
                            key={chapter._id}
                            extra={(
                                <>
                                    <span className={styles.countLectures}>{`${countLecturesAll[index]} lectures`}</span>
                                    <span className={styles.allTime}>{`${minutesToHour(times[index])}`}</span>
                                </>
                            )}
                        >
                            <List
                                className={styles.chapter}
                                itemLayout="horizontal"
                                rowKey={item => `${chapter._id}_${item._id}`}
                                dataSource={chapter.lectures}
                                renderItem={lecture => (
                                    <List.Item
                                        className={styles.lecture}
                                        extra={!lecture.isPreviewed ? (
                                            <span className={styles.time}>{`${minutesToHour(lecture.time)}`}</span>
                                        ) : (
                                            <>
                                                <span className={styles.preview} onClick={() => handlePreview(lecture._id)}>Preview</span>
                                                <span className={styles.time}>{`${minutesToHour(lecture.time)}`}</span>
                                            </>
                                        )}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar size={16} icon={lecture.type === 0 ? <YoutubeFilled /> : <ReadOutlined />} style={{ background: lecture.type === 0 ? '#fada5e' : 'white', color: 'black', position: 'relative', top: '3px' }}/>}
                                            title={<span className={styles.lectureName}>{lecture.title}</span>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    ))}
                </Collapse>
            </Row>
        </React.Fragment>
    )
};

const RelatedCourses = ({ data, onAddBundleToCart, isInCart }) => {
    const [alsoBoughtCount, setAlsoBoughtCount] = useState(_.min([data.alsoBought.length, 5]));
    if (_.isEmpty(data.alsoBought) && _.isEmpty(data.frequent.list) && _.isEmpty(data.sameAuthors)) {
        return (
            <div>Empty.</div>
        )
    };

    const renderAlsoBoughtCourse = course => {
        const { _id, lastUpdated, name, numOfLectures, avatar } = course;
        return (
            <Row className={styles.course} onClick={() => router.push(`/course/${_id}`)}>
                <Col span={8} className={styles.avatar}>
                    <img alt="course-ava" src={avatar} />
                    <div className={styles.numOfLectures}>{`${numOfLectures} lectures`}</div>
                </Col>
                <Col span={16} className={styles.info}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.updatedTime}>{`Updated at ${moment(lastUpdated).format('MM/YYYY')}`}</div>
                </Col>
            </Row>
        )
    };
    const renderRating = rating => {
        return (
            <div className={styles.starRating}>
                <Icon type="star" theme="filled" style={{ color: '#fada5e' }} />
                <span className={styles.value}>{rating}</span>
            </div>
        )
    };
    const renderNumOfEnrolled = num => {
        return (
            <div className={styles.numOfEnrolled}>
                <Icon type="team" />
                <span className={styles.value}>{numberWithCommas(num)}</span>
            </div>
        );
    };
    const renderPrice = (price, realPrice) => {
        return (
            <div className={styles.price}>
                <div className={styles.priceVal}>
                    {`$${_.round(price, 2)}`}
                </div>
                {realPrice > price && (
                    <div className={styles.realPriceVal}>
                        {`$${_.round(realPrice, 2)}`}
                    </div>
                )}
            </div>
        )
    };
    const alsoBoughtColumns = [
        {
            title: 'Course',
            dataIndex: '',
            key: 'course',
            width: '55%',
            render: course => renderAlsoBoughtCourse(course)
        },
        {
            title: 'Ratings',
            dataIndex: 'starRating',
            key: 'ratings',
            width: '15%',
            render: rating => renderRating(rating)
        },
        {
            title: 'Num enrolled',
            dataIndex: 'numOfEnrolled',
            key: 'numOfEnrolled',
            width: '15%',
            render: num => renderNumOfEnrolled(num)
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '15%',
            render: (price, row) => renderPrice(price, row.realPrice)
        }
    ];

    return (
        <React.Fragment>
            {data.alsoBought && !_.isEmpty(data.alsoBought) && (
                <Row className={styles.alsoBought}>
                    <div className={styles.title}>People also bought</div>
                    <div className={styles.main}>
                        <Table
                            columns={alsoBoughtColumns}
                            dataSource={_.slice(data.alsoBought, 0, alsoBoughtCount)}
                            rowKey={item => item._id + _.uniqueId('also_course_')}
                            showHeader={false}
                            className={styles.table}
                            pagination={false}
                        />
                        {data.alsoBought.length > alsoBoughtCount && (
                            <div className={styles.seeMore} onClick={() => setAlsoBoughtCount(_.min([data.alsoBought.length, alsoBoughtCount + 3]))}>
                                <Icon type="plus" />
                                <span className={styles.text}>See more</span>
                            </div>
                        )}
                    </div>
                </Row>
            )}
            {data.frequent && !_.isEmpty(data.frequent) && (
                <Row className={styles.frequent}>
                    <div className={styles.title}>Frequent bought together</div>
                    <div className={styles.main}>
                        <List
                            grid={{
                                gutter: 16,
                                column: 4
                            }}
                            dataSource={data.frequent.list}
                            rowKey={course => (course._id || course.key) + _.uniqueId('freq_course_')}
                            renderItem={course => (
                                <List.Item>
                                    <TeacherCourse course={course} />
                                </List.Item>
                            )}
                        />
                        <div className={styles.icon}>
                            <Icon type="gift" theme="filled" />
                        </div>
                        <div className={styles.total}>
                            <span className={styles.text}>
                                {'Total: '}
                            </span>
                            <span className={styles.totalVal}>
                                {`$${_.round(data.frequent.total, 2)}`}
                            </span>
                            <span className={styles.realTotalVal}>
                                {`$${_.round(data.frequent.realTotal, 2)}`}
                            </span>
                        </div>
                        {isInCart ? (
                            <div className={styles.goToCart}>
                                <Button type="primary" icon="shopping" size="large" onClick={() => router.push('/shopping-cart')}>Go to cart</Button>
                            </div>
                        ) : (
                            <div className={styles.addToCart}>
                                <Button type="primary" icon="shopping-cart" size="large" onClick={onAddBundleToCart}>Add all to cart</Button>
                            </div>
                        )}
                    </div>
                </Row>
            )}
            {data.sameAuthors && !_.isEmpty(data.sameAuthors) && (
                <Row className={styles.sameAuthors}>
                    <div className={styles.title}>More courses by same authors</div>
                    <div className={styles.main}>
                        <List
                            grid={{
                                gutter: 16,
                                column: 4
                            }}
                            dataSource={data.sameAuthors}
                            rowKey={course => (course._id || course.key) + _.uniqueId('same_authors_course_')}
                            renderItem={course => (
                                <List.Item>
                                    <TeacherCourse course={course} />
                                </List.Item>
                            )}
                        />
                    </div>
                </Row>
            )}
        </React.Fragment>
    )
};

const Answer = ({ answer }) => {
    return (
        <div className={styles.answer}>
            <div className={styles.user}>
                <div className={styles.avatarCont}>
                    <UserAvatar
                        src={answer.user.avatar}
                        size={48}
                        textSize={48}
                        alt="ava-user"
                        text={answer.user.name}
                        borderWidth={0}
                        style={{ background: '#fada5e', color: 'white' }}
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.names}>
                        <span className={styles.name}>{answer.user.name}</span>
                        {answer.user.isInstructor && <span className={styles.instructor}>{`(Instructor)`}</span>}
                    </div>
                    <div className={styles.time}>
                        <TimeAgo date={answer.createdAt} />
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <ViewMore height={150}>
                    <div dangerouslySetInnerHTML={{ __html: answer.content }}/>
                </ViewMore>
            </div>
        </div>
    )
};

const FeaturedReview = ({ data: review, handleVoting }) => {
    return (
        <div className={styles.featuredReview}>
            <div className={styles.user}>
                <div className={styles.avatarCont}>
                    <UserAvatar
                        src={review.user.avatar}
                        size={60}
                        textSize={60}
                        alt="ava-user"
                        text={review.user.name}
                        borderWidth={0}
                        style={{ background: '#fada5e', color: 'white'} }
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.names}>
                        <span className={styles.name}>{review.user.name}</span>
                        <span className={styles.time}><TimeAgo date={review.createdAt} /></span>
                    </div>
                    <div className={styles.starRating}>
                        <Rate allowHalf value={roundStarRating(review.starRating)} disabled className={styles.stars} />
                        <span className={styles.ratingVal}>{review.starRating}</span>
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <ViewMore height={250}>
                    <div dangerouslySetInnerHTML={{ __html: review.content }}/>
                </ViewMore>
            </div>
            <div className={styles.voting}>
                <span className={styles.text}>Was this review helpful?</span>
                <span
                    className={styles.like}
                    onClick={() => {
                        if (review.status !== 1) handleVoting('featured', review._id, 1, review.status);
                        else handleVoting('featured', review._id, null, review.status);
                    }}
                >
                    <Icon type="like" theme="filled" style={{ color: (review.status === 1) ? '#fada5e' : 'white' }}/>
                </span>
                <span
                    className={styles.dislike}
                    onClick={() => {
                        if (review.status !== 0) handleVoting('featured', review._id, 0, review.status);
                        else handleVoting('featured', review._id, null, review.status);
                    }}
                >
                    <Icon type="dislike" theme="filled" style={{ color: (review.status === 0) ? '#fada5e' : 'white' }}/>
                </span>
            </div>
            {!_.isEmpty(review.answers) && (
                <div className={styles.answers}>
                    <div className={styles.title}>Answers</div>
                    <div className={styles.data}>
                        {_.map(review.answers, (answer, i) => (
                            <React.Fragment key={answer._id}>
                                {i > 0 && (<Divider dashed className={styles.divider} />)}
                                <Answer key={answer._id} answer={answer} />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};

const Review = ({ data: review, handleVoting }) => {
    return (
        <Row className={styles.review}>
            <Col span={6} className={styles.user}>
                <div className={styles.avatarCont}>
                    <UserAvatar
                        src={review.user.avatar}
                        size={60}
                        textSize={60}
                        alt="ava-user"
                        text={review.user.name}
                        borderWidth={0}
                        style={{ background: '#fada5e', color: 'white'} }
                    />
                </div>
                <div className={styles.name}>
                    {review.user.name}
                </div>
                <div className={styles.time}>
                    <TimeAgo date={review.createdAt} />
                </div>
            </Col>
            <Col span={18} className={styles.right}>
                <div className={styles.starRating}>
                    <Rate allowHalf value={roundStarRating(review.starRating)} disabled className={styles.stars} />
                    <span className={styles.ratingVal}>{review.starRating}</span>
                </div>
                <div className={styles.content}>
                    <ViewMore height={250}>
                        <div dangerouslySetInnerHTML={{ __html: review.content }}/>
                    </ViewMore>
                </div>
                <div className={styles.voting}>
                    <span className={styles.text}>Was this review helpful?</span>
                    <span
                        className={styles.like}
                        onClick={() => {
                            if (review.status !== 1) handleVoting('default', review._id, 1, review.status);
                            else handleVoting('default', review._id, null, review.status);
                        }}>
                            <Icon type="like" theme="filled" style={{ color: (review.status === 1) ? '#fada5e' : 'white' }}/>
                        </span>
                    <span
                        className={styles.dislike}
                        onClick={() => {
                            if (review.status !== 0) handleVoting('default', review._id, 0, review.status);
                            else handleVoting('default', review._id, null, review.status);
                        }}
                    >
                        <Icon type="dislike" theme="filled" style={{ color: (review.status === 0) ? '#fada5e' : 'white' }}/>
                    </span>
                </div>
                {!_.isEmpty(review.answers) && (
                    <div className={styles.answers}>
                        <div className={styles.title}>Answers</div>
                        <div className={styles.data}>
                            {_.map(review.answers, (answer, i) => (
                                <React.Fragment key={answer._id}>
                                    {i > 0 && (<Divider dashed className={styles.divider} />)}
                                    <Answer key={answer._id} answer={answer} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </Col>
        </Row>
    );
};

const Reviews = ({ list, featured, hasMore, handleVoting, handleMoreReviews, reviewsLoading }) => {
    const loadMore = (
        hasMore && !reviewsLoading && list && featured ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreReviews}>More reviews</Button>
            </div>
        ) : null
    );
    const reviewsList = !reviewsLoading ? list : _.concat(list, [
        {
            _id: _.uniqueId('review_loading_'),
            loading: true
        },
        {
            _id: _.uniqueId('review_loading_'),
            loading: true
        },
    ]);
    let count = 0;
    return (
        <React.Fragment>
            {featured && !_.isEmpty(featured) && (
                <Row className={styles.featured}>
                    <div className={styles.title}>Featured reviews</div>
                    <div className={styles.main}>
                        {_.map(featured, (review, i) => (
                            <React.Fragment key={review._id + _.uniqueId('feature_review_')}>
                                {i > 0 && (
                                    <Divider dashed className={styles.divider} />
                                )}
                                <FeaturedReview data={review} key={review._id + _.uniqueId('featured_review_')} handleVoting={handleVoting}/>
                            </React.Fragment>
                        ))}
                    </div>
                </Row>
            )}
            <Row className={styles.listReviews}>
                <div className={styles.title}>Reviews</div>
                <div className={styles.main}>
                    <List
                        dataSource={reviewsList}
                        itemLayout="horizontal"
                        split={false}
                        className={styles.list}
                        rowKey={item => item._id + _.uniqueId('review_')}
                        loadMore={loadMore}
                        renderItem={item => (
                            <>
                                {count++ > 0 && (<Divider dashed className={styles.divider} />)}
                                <List.Item style={{ borderBottom: 'none' }}>
                                    <Skeleton loading={item.loading} active avatar={{ size: 60 }} paragraph={{ rows: 3, width: ['90%', '75%', '45%']}} title={{ width: '30%' }}>
                                        <Review data={item} handleVoting={handleVoting} />
                                    </Skeleton>  
                                </List.Item>
                            </>
                        )}
                    />
                </div>
            </Row>
        </React.Fragment>
    )
};

const Instructors = ({ instructors }) => {
    return (
        <React.Fragment>
            {_.map(instructors, (instructor, i) => {
                return (
                    <Row className={styles.instructor} key={instructor._id}>
                        {i > 0 && (<Divider dashed className={styles.divider} />)}
                        <Col span={6} className={styles.summary}>
                            <div className={styles.avatarCont}>
                                <UserAvatar
                                    src={instructor.avatar}
                                    size={120}
                                    textSize={126}
                                    alt="ins-ava"
                                    text={instructor.name}
                                    borderWidth={6}
                                    style={{ background: 'black', color: '#fada5e', fontSize: '52px' }}
                                />
                            </div>
                            <div className={classNames(styles.stat, styles.numReviews)}>
                                <Icon type="block" />
                                <span className={styles.value}>{`${numberWithCommas(instructor.numOfReviews)} reviews`}</span>
                            </div>
                            <div className={classNames(styles.stat, styles.students)}>
                                <Icon type="user" />
                                <span className={styles.value}>{`${numberWithCommas(instructor.numOfStudents)} students`}</span>
                            </div>
                            <div className={classNames(styles.stat, styles.courses)}>
                                <Icon type="read" />
                                <span className={styles.value}>{`${numberWithCommas(instructor.numOfCourses)} courses`}</span>
                            </div>
                        </Col>
                        <Col span={18} className={styles.detail}>
                            <div className={styles.name}>{instructor.name}</div>
                            <div className={styles.job}>{instructor.job}</div>
                            <ViewMore height={270}>
                                <div className={styles.biography} dangerouslySetInnerHTML={{ __html: instructor.biography }}/>
                            </ViewMore>
                        </Col>
                    </Row>
                );
            })}
        </React.Fragment>
    )
};

const DetailCourse = ({ match, dispatch, ...props }) => {
    const [sticky, setSticky] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { courseId } = match.params;
    const {
        cart,
        user,
        courseInfo,
        courseInfoLoading,
        overview,
        overviewLoading,
        syllabus,
        syllabusLoading,
        relatedCourses,
        relatedCoursesLoading,
        instructors,
        instructorsLoading,
        reviews,
        hasMoreReviews,
        featuredReviews,
        reviewsLoading,
        moreReviewsLoading
    } = props;

    useEffect(() => {
        setSticky(false);
        dispatch({
            type: 'detail/fetchInfo',
            payload: courseId
        });
        dispatch({
            type: 'detail/fetchOverview',
            payload: courseId
        });
        dispatch({
            type: 'detail/fetchSyllabus',
            payload: courseId
        });
        dispatch({
            type: 'detail/fetchRelatedCourses',
            payload: courseId
        });
        dispatch({
            type: 'detail/fetchInstructors',
            payload: courseId
        });
        dispatch({
            type: 'detail/fetchReviews',
            payload: courseId
        });
        return () => dispatch({
            type: 'detail/reset'
        });
    }, [courseId]);

    const handleVoting = (type, reviewId, value, oldValue) => {
        dispatch({
            type: 'detail/vote',
            payload: {
                type,
                reviewId,
                value,
                oldValue
            }
        });
    };

    const handlePreview = lectureId => {
        
    };
    const handleMoreReviews = () => {
        dispatch({
            type: 'detail/moreReviews'
        });
    };

    const handleAddToCart = () => {
        if (!user || !storage.getToken()) router.push('/user/login');
        else setModalVisible(true);
    };

    const handleAddToCartNow = () => {
        dispatch({
            type: 'cart/add',
            payload: {
                ..._.pick(courseInfo, ['_id', 'name', 'avatar', 'authors', 'price', 'realPrice']),
                type: 'course'
            }
        });
        setModalVisible(false);
    }

    const handleAddBundleToCart = () => {
        if (!user || !storage.getToken()) router.push('/user/login');
        else handleAddBundleToCartNow();
    }
    
    const handleAddBundleToCartNow = (inModal = false) => {
        const bundle = relatedCourses && relatedCourses.frequent;
        if (bundle) {
            const bundleData = {
                _id: bundle._id,
                type: 'bundle',
                realPrice: bundle.realTotal,
                price: bundle.total,
                courses: _.map(bundle.list, course => ({
                    ..._.pick(course, ['_id', 'name', 'avatar', 'price', 'authors'])
                }))
            };
            dispatch({
                type: 'cart/add',
                payload: bundleData
            });
            if (inModal) setModalVisible(false);
        }
    };
    const checkInCart = () => {
        const cartItems = _.map(cart, item => ({
            _id: item._id,
            type: item.type
        }));
        if (courseInfo && relatedCourses) {
            if (_.findIndex(cartItems, item => item._id === courseInfo._id && item.type === 'course') > -1) return true;
            if (relatedCourses.frequent)
                if (_.findIndex(cartItems, item => item._id === relatedCourses.frequent._id && item.type === 'bundle') > -1) return true;
        }
        return false;
    }
    
    const isInCart = checkInCart();
    return (
        <div className={styles.detail}>
            <Row className={styles.jumpotron}>
                <Row className={styles.courseInfo}>
                    <div className={styles.info}>
                        {!courseInfo || courseInfoLoading ? (
                            <Skeleton active title={false} paragraph={{ rows: 4, width: ['80%', '70%', '45%', '55%'] }}/>
                        ) : (
                            <div>
                                <div className={styles.name}>{courseInfo.name}</div>
                                <div className={styles.summary}>{courseInfo.summary}</div>
                                {courseInfo.featured && (
                                    <div className={styles.featured}>
                                        <FeaturedBadge type={courseInfo.featured} style={{ marginRight: '12px' }}/>
                                        in <Link to="/">{courseInfo.topic}</Link>
                                        <Divider type="vertical" style={{ background: 'white' }} />
                                        <span>{courseInfo.category}</span>
                                    </div>
                                )}
                                <div className={styles.statistic}>
                                    <Rate allowHalf value={roundStarRating(courseInfo.starRating)} disabled className={styles.stars} />
                                    <span className={styles.ratingVal}>{courseInfo.starRating}</span>
                                    <span className={styles.numOfRatings}>{`(${numberWithCommas(courseInfo.numOfRatings)} ratings)`}</span>
                                    <span className={styles.numOfEnrolled}>{`${numberWithCommas(courseInfo.numOfEnrolled)} students enrolled`}</span>
                                </div>
                                <div className={styles.authors}>
                                    {`Created by ${transAuthors(courseInfo.authors)}`}
                                </div>
                                <div className={styles.extra}>
                                    <span className={styles.level}>
                                        <Icon type="rocket" />
                                        <span className={styles.levelVal}>{courseInfo.level}</span>
                                    </span>
                                    <span className={styles.language}>
                                        <Icon type="block" />
                                        <span className={styles.languageVal}>{courseInfo.language}</span>
                                    </span>
                                    <span className={styles.lastUpdated}>
                                        <Icon type="history" />
                                        <span className={styles.lastUpdatedVal}>{`Last updated ${moment(courseInfo.lastUpdated).format('MM/YYYY')}`}</span>
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className={styles.btns}>
                            {!courseInfo || courseInfoLoading ? (
                                <div className={styles.btnsLoading}>
                                    <Skeleton active avatar={false} title={false} paragraph={{ rows: 2, width: [150, 150] }}/>
                                </div>
                            ) : courseInfo.isRegistered ? (
                                <React.Fragment>
                                    <div className={styles.goToCourse}>
                                        <Button type="primary" icon="play-circle" size="large" onClick={() => router.push(`/learning/${courseId}/overview`)}>Go to course</Button>
                                    </div>
                                    {courseInfo.refundable && (
                                        <div className={styles.refund}>
                                            <Button icon="rollback" size="large">Refund</Button>
                                        </div>
                                    )}
                                </React.Fragment>
                            ) : isInCart ? (
                                <React.Fragment>
                                    <div className={styles.price}>
                                        <span className={styles.priceVal}>
                                            {`$${_.round(courseInfo.price, 2)}`}
                                        </span>
                                        {courseInfo.realPrice > courseInfo.price && (
                                            <span className={styles.realPriceVal}>
                                                {`$${_.round(courseInfo.realPrice, 2)}`}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.goToCart}>
                                        <Button icon="shopping" size="large" onClick={() => router.push('/shopping-cart')}>Go to cart</Button>
                                    </div>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <div className={styles.price}>
                                        <span className={styles.priceVal}>
                                            {`$${_.round(courseInfo.price, 2)}`}
                                        </span>
                                        {courseInfo.realPrice > courseInfo.price && (
                                            <span className={styles.realPriceVal}>
                                                {`$${_.round(courseInfo.realPrice, 2)}`}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.addToCart}>
                                        <Button type="primary" icon="shopping-cart" size="large" onClick={handleAddToCart}>Add to cart</Button>
                                    </div>
                                    <div className={styles.buyNow}>
                                        <Button icon="audit" size="large">Buy now</Button>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    
                </Row>
            </Row>
            <Sticky
                scrollElement="#mainScrollbar"
                onFixedToggle={fixed => setSticky(!fixed)}
                disabled={!courseInfo || courseInfoLoading}
                stickyStyle={{ zIndex: 100 }}
            >
                {sticky ? (
                    <div className={styles.stickyBar}>
                        <Row className={styles.info}>
                            <div className={styles.name}>
                                {courseInfo.name}
                            </div>
                            <div className={styles.statistic}>
                                <Rate allowHalf value={roundStarRating(courseInfo.starRating)} disabled className={styles.stars} />
                                <span className={styles.ratingVal}>{courseInfo.starRating}</span>
                                <span className={styles.numOfRatings}>{`(${numberWithCommas(courseInfo.numOfRatings)} ratings)`}</span>
                                <span className={styles.numOfEnrolled}>{`${numberWithCommas(courseInfo.numOfEnrolled)} students enrolled`}</span>
                            </div>
                            <div className={styles.btns}>
                                {courseInfo.isRegistered ? (
                                    <React.Fragment>
                                        <Button className={styles.goToCourse} type="primary">
                                            Go to course
                                        </Button>
                                        {courseInfo.refundable && (
                                            <Button className={styles.refund}>
                                                Refund
                                            </Button>
                                        )}
                                    </React.Fragment>
                                ) : isInCart ? (
                                    <React.Fragment>
                                        <div className={styles.goToCart}>
                                            <Button icon="shopping" type="primary" onClick={() => router.push('/shopping-cart')}>Go to cart</Button>
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <Button className={styles.addToCart} type="primary" onClick={handleAddToCart}>
                                            Add to cart
                                        </Button>
                                        <Button className={styles.buyNow}>
                                            Buy now
                                        </Button>
                                    </React.Fragment>
                                )}
                            </div>
                        </Row>
                        
                    </div>
                ) : (
                    <div />
                )}
            </Sticky>
            <Row className={styles.content}>
                {!overview || overviewLoading ? (
                    <Loading />
                ) : (
                    <Tabs
                        defaultActiveKey="overview"
                        className={styles.tabs}
                        tabBarStyle={{
                            borderBottom: 'none',
                            textAlign: 'center'
                        }}
                        size="large"
                    >
                        <TabPane
                            tab="Overview"
                            key="overview"
                            className={classNames(styles.tabPane, styles.overview)}
                        >
                            <div className={styles.whatLearn}>
                                <div className={styles.title}>What you'll learn</div>
                                <div className={styles.content}>
                                    <List
                                        dataSource={overview.whatLearn}
                                        itemLayout="horizontal"
                                        split={false}
                                        grid={{
                                            column: 2,
                                            gutter: 24
                                        }}
                                        renderItem={item => (
                                            <List.Item key={_.uniqueId('what_learn_')} className={styles.listItem}>
                                                <List.Item.Meta
                                                    avatar={<Avatar size={28} icon="check" style={{ background: '#fada5e', color: 'black' }}/>}
                                                    title={<span className={styles.item} dangerouslySetInnerHTML={{ __html: item }}/>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                            <Divider dashed className={styles.divider} />
                            <div className={styles.requirements}>
                                <div className={styles.title}>Requirements</div>
                                <div className={styles.content}>
                                    <List
                                        dataSource={overview.requirements}
                                        itemLayout="horizontal"
                                        split={false}
                                        renderItem={item => (
                                            <List.Item key={_.uniqueId('requirement_')}>
                                                <List.Item.Meta
                                                    avatar={<Avatar size={28} icon="link" style={{ background: '#fada5e', color: 'black' }}/>}
                                                    title={<span className={styles.item} dangerouslySetInnerHTML={{ __html: item }}/>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                            <Divider dashed className={styles.divider} />
                            <div className={styles.description}>
                                <div className={styles.title}>Description</div>
                                <div className={styles.content} dangerouslySetInnerHTML={{ __html: overview.description }}/>
                            </div>
                        </TabPane>
                        <TabPane
                            tab="Syllabus"
                            key="syllabus"
                            className={classNames(styles.tabPane, styles.syllabus)}
                        >
                            {!syllabus && syllabusLoading ? (
                                <Loading />
                            ) : (
                                <Syllabus data={syllabus} handlePreview={handlePreview} />
                            )}
                        </TabPane>
                        <TabPane
                            tab="Related courses"
                            key="relatedCourses"
                            className={classNames(styles.tabPane, styles.relatedCourses)}
                        >
                            {!relatedCourses || relatedCoursesLoading ? (
                                <Loading />
                            ) : (
                                <RelatedCourses data={relatedCourses} onAddBundleToCart={handleAddBundleToCart} isInCart={isInCart}/>
                            )}
                        </TabPane>
                        <TabPane
                            tab="Reviews"
                            key="reviews"
                            className={classNames(styles.tabPane, styles.reviews)}
                        >
                            {!reviews || !featuredReviews || reviewsLoading ? (
                                <Loading />
                            ) : (
                                <Reviews list={reviews} featured={featuredReviews} hasMore={hasMoreReviews} handleVoting={handleVoting} handleMoreReviews={handleMoreReviews} reviewsLoading={moreReviewsLoading} />
                            )}
                        </TabPane>
                        <TabPane
                            tab="About instructors"
                            key="instructors"
                            className={classNames(styles.tabPane, styles.instructors)}
                        >
                            {!instructors || instructorsLoading ? (
                                <Loading />
                            ) : (
                                <Instructors instructors={instructors} />
                            )}
                        </TabPane>
                    </Tabs>
                )}
            </Row>
            <Modal
                className={styles.addToCartModal}
                title={<div className={styles.modalTitle}>Ask a new question</div>}
                width={860}
                centered
                footer={null}
                bodyStyle={{ padding: '35px 10px' }}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
            >
                {relatedCoursesLoading || !relatedCourses ? (
                    <div className={styles.loading}>
                        <Spin indicator={<Icon type="loading-3-quarters" style={{ fontSize: '44px' }} spin/>} />
                        <div className={styles.tip}>
                            Loading...
                        </div>
                    </div>
                ) : (
                    <div className={styles.content}>
                        <div className={styles.bundle}>
                            {_.isEmpty(relatedCourses.frequent) ? (
                                <div className={styles.empty}>
                                    This course isn't in any bundle.
                                </div>
                            ) : (
                                <Row className={styles.frequent}>
                                    <div className={styles.title}>Frequent bought together</div>
                                    <div className={styles.main}>
                                        <List
                                            grid={{
                                                gutter: 16,
                                                column: 3
                                            }}
                                            dataSource={relatedCourses.frequent.list}
                                            rowKey={course => (course._id || course.key)}
                                            renderItem={course => (
                                                <List.Item>
                                                    <TeacherCourse course={course} />
                                                </List.Item>
                                            )}
                                        />
                                        <div className={styles.total}>
                                            <span className={styles.text}>
                                                {'Total: '}
                                            </span>
                                            <span className={styles.totalVal}>
                                                {`$${_.round(relatedCourses.frequent.total, 2)}`}
                                            </span>
                                            <span className={styles.realTotalVal}>
                                                {`$${_.round(relatedCourses.frequent.realTotal, 2)}`}
                                            </span>
                                        </div>
                                        {isInCart ? (
                                            <div className={styles.goToCart}>
                                                <Button type="primary" icon="shopping" size="large" onClick={() => router.push('/shopping-cart')}>Go to cart</Button>
                                            </div>
                                        ) : (
                                            <div className={styles.addToCart}>
                                                <Button type="primary" icon="shopping-cart" size="large" onClick={() => handleAddBundleToCartNow(true)}>Add all to cart</Button>
                                            </div>
                                        )}
                                    </div>
                                </Row>
                            )}
                        </div>
                        <div className={styles.one}>
                            <span className={styles.title}>
                                Buy only this course?
                            </span>
                            <span className={styles.btn}>
                                {isInCart ? (
                                    <Button icon="shopping" size="large" onClick={() => router.push('/shopping-cart')}>Go to cart</Button>
                                ) : (
                                    <Button icon="shopping-cart" size="large" onClick={handleAddToCartNow} disabled={!courseInfo || courseInfoLoading}>Add to cart</Button>
                                )}
                            </span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
};

export default connect(
    ({ user, cart, detail, loading }) => ({
        courseInfo: detail.info,
        syllabus: detail.syllabus,
        overview: detail.overview,
        relatedCourses: detail.relatedCourses,
        instructors: detail.instructors,
        reviews: detail.reviews.list,
        featuredReviews: detail.reviews.featured,
        hasMoreReviews: detail.reviews.hasMore,
        courseInfoLoading: loading.effects['detail/fetchInfo'],
        overviewLoading: loading.effects['detail/fetchOverview'],
        syllabusLoading: loading.effects['detail/fetchSyllabus'],
        reviewsLoading: loading.effects['detail/fetchReviews'],
        instructorsLoading: loading.effects['detail/fetchInstructors'],
        relatedCoursesLoading: loading.effects['detail/fetchRelatedCourses'],
        moreReviewsLoading: loading.effects['detail/moreReviews'],
        previewLoading: loading.effects['detail/preview'],
        cart: cart,
        user: user
    })
)(DetailCourse);