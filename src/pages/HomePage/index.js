import React, { useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import router from 'umi/router';
import { connect } from 'dva';
import { Parallax } from 'react-parallax';
import { Row, Col, Tabs, Carousel, Empty } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Course from '@/components/CourseCarouselItem';
import Friend from '@/components/Friend';
import ArrowCarousel from '@/components/ArrowCarousel';
import InProgressCourse from '@/components/InProgressCourse';
import TOP_TOPICS from '@/assets/fakers/topTopics';
import TOP_FRIENDS from '@/assets/fakers/topFriends';
import homeJumpotronImg from '@/assets/images/homeJumpotronImg.jpg';
import { range } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;

const Homepage = ({ dispatch, ...props }) => {
    // let loading = false;
    // let categories = CATEGORIES;
    const { user, myCourses, isFetchingMyCourses, recommendCourses, isFetchingRecommendCourses } = props;
    useEffect(() => {
      if (user) {
        dispatch({
          type: 'home/fetchMyCourses'
        });
      }
      else {
        dispatch({
          type: 'home/saveMyCourses',
          payload: []
        });
      }
      dispatch({
        type: 'home/fetchRecommendCourses'
      });
      return () => dispatch({
        type: 'home/resetHomeCourses'
      })
    }, []);
    const topTopics = TOP_TOPICS;
    const topFriends = TOP_FRIENDS;
    let recommender = null;
    const coursesCarousel = (courses) => {
        if (courses.length === 0) {
          return (
            <div className={styles.emptyRecommend}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Sorry, currently this function isn\'t supported.'}/>
            </div>
          )
        }
        return (
            <ArrowCarousel
                pageSize={5}
                speed={500}
                buttonSize={34}
                dataSource={courses}
                renderItem={course => (
                    <div className={styles.courseItem} key={course._id}>
                        <Course course={course} />
                    </div>
                )}
                renderEmptyItem={() => <div className={styles.courseItem} />}
            />
        )
    };

    const friendsCarousel = (friends) => {
        return (
            <Carousel
                arrows={false}
                slidesToShow={4}
                slidesToScroll={2}
                speed={500}
                autoplay
                autoplaySpeed={3500}
            >
                {_.map(friends, (friend, i) => (
                    <div className={styles.friendItem} key={friend._id + _.uniqueId('friend_')}>
                        <Friend friend={friend} />
                    </div>
                ))}
                {_.map(range(4 - friends.length), n => (<div key={n} className={styles.friendItem} />))}
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
    const backCoursesCarousel = backCourses => {
        return (
            <ArrowCarousel
                pageSize={3}
                speed={500}
                buttonSize={24}
                dataSource={backCourses}
                renderItem={backCourse => (
                    <div className={styles.backCourseItem} key={backCourse._id}>
                        <InProgressCourse course={backCourse} />
                    </div>
                )}
                renderEmptyItem={() => <div className={styles.backCourseItem} />}
            />
        )
    }

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

    if (recommendCourses && !isFetchingRecommendCourses) {
        recommender = (
            <React.Fragment>
                <Row className={styles.title}>{formatMessage({ id: 'home.title.whatshould' })}</Row>
                <Row className={styles.topCoursesCont}>
                    <Row className={styles.subTitle}>{formatMessage({ id: 'home.subtitle.topcourses' })}</Row>
                    <Row className={styles.topCourses}>
                        <Tabs defaultActiveKey="most-popular" animated={false}>
                            <TabPane tab={formatMessage({ id: 'home.topcourses.mostpopular' })} key="most-popular">
                                {coursesCarousel(recommendCourses['nonPersonalized'].mostPopular)}
                            </TabPane>
                            <TabPane tab={formatMessage({ id: 'home.topcourses.toprating' })} key="top-rating">
                                {coursesCarousel(recommendCourses['nonPersonalized'].starRatings)}
                            </TabPane>
                        </Tabs>
                    </Row>
                </Row>
                <React.Fragment>
                  {recommendCourses.personalized && recommendCourses.personalized.length > 0 && (
                    <Row className={styles.personalized}>
                      <Row className={styles.subTitle}>You may love these</Row>
                      <Row className={styles.topCourses}>
                        {coursesCarousel(recommendCourses.personalized)}
                      </Row>
                    </Row>
                    )}
                </React.Fragment>
                {_.map(_.keys(recommendCourses.categories), categoryKey => {
                  const categoryData = recommendCourses.categories[categoryKey];
                  return (
                    <Row className={styles.topCoursesOfCateCont} key={categoryKey}>
                      <Row className={styles.subTitle}>{`${formatMessage({ id: 'home.subtitle.topcoursesofcate' })} `}<span className={styles.cateName}>{categoryData.title}</span></Row>
                      <Row className={styles.topCoursesOfCate}>
                        {coursesCarousel(categoryData.list)}
                      </Row>
                    </Row>
                  )
                })}
                {/*<Row className={styles.topFriendsCont}>*/}
                {/*    <Row className={styles.subTitle}>{`${formatMessage({ id: 'home.subtitle.topfriends' })} `}</Row>*/}
                {/*    <Row className={styles.topFriends}>*/}
                {/*        {friendsCarousel(topFriends)}*/}
                {/*    </Row>*/}
                {/*</Row>*/}
                {/*<Row className={styles.topTopicsCont}>*/}
                {/*    <Row className={styles.subTitle}>{`${formatMessage({ id: 'home.subtitle.toptopics' })} `}</Row>*/}
                {/*    <Row className={styles.topTopics}>*/}
                {/*        {topicsCarousel(topTopics)}*/}
                {/*    </Row>*/}
                {/*</Row>*/}
            </React.Fragment>
        )
    }

    return (
        <div className={styles.homepage}>
            <Row className={styles.jumpotron}>
                <Parallax
                    bgImage={homeJumpotronImg}
                    renderLayer={() => (
                        <div>
                            <div
                                style={{
                                    background: `rgba(0, 0, 0, 0.5)`,
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute'
                                }}
                            />
                        </div>

                    )}
                >
                    <div style={{ height: 400 }}>
                        <div className={styles.inlineDiv}>
                            <div className={styles.bigSlogan}>
                                {formatMessage({ id: 'home.jumpotron.bigslogan' })}
                            </div>
                            <div className={styles.smallSlogan}>
                                {formatMessage({ id: 'home.jumpotron.smallslogan' })}
                            </div>
                        </div>
                    </div>
                </Parallax>
            </Row>
          <Row className={styles.back}>
            {!myCourses || isFetchingMyCourses ? (
              <div className={styles.backLoading}>
                <div className={classNames(styles.titleSkeleton, styles.skeletonBox)} />
                <Row className={styles.coursesSkeleton} gutter={16}>
                  <Col span={12} className={styles.course}>
                    <Row>
                      <Col span={10} className={styles.avatarCol}>
                        <div className={classNames(styles.avatar, styles.skeletonBox)} />
                      </Col>
                      <Col span={14} className={styles.infoCol}>
                        <div className={classNames(styles.name, styles.skeletonBox)} />
                        <div className={classNames(styles.progress, styles.skeletonBox)} />
                        <div className={classNames(styles.authors, styles.skeletonBox)} />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12} className={styles.course}>
                    <Row>
                      <Col span={10} className={styles.avatarCol}>
                        <div className={classNames(styles.avatar, styles.skeletonBox)} />
                      </Col>
                      <Col span={14} className={styles.infoCol}>
                        <div className={classNames(styles.name, styles.skeletonBox)} />
                        <div className={classNames(styles.progress, styles.skeletonBox)} />
                        <div className={classNames(styles.authors, styles.skeletonBox)} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            ) : (myCourses.length > 0 && (
              <>
                <Row className={styles.title}>{`${formatMessage({ id: 'home.title.back' })}, ${user && user.name}`}</Row>
                <Row className={styles.backCoursesCont}>
                  <Row className={styles.subTitle}>{formatMessage({ id: 'home.subtitle.back' })}</Row>
                  <Row className={styles.backCourses}>
                    {backCoursesCarousel(myCourses)}
                  </Row>
                </Row>
              </>
            ))}
          </Row>
          <Row className={styles.recommender}>
            {!recommendCourses || isFetchingRecommendCourses ? (
              <div className={styles.recommendLoading}>
                <div className={classNames(styles.titleSkeleton, styles.skeletonBox)} />
                <div className={styles.coursesSkeleton}>
                  {courseSkeletonsCarousel()}
                </div>
              </div>
            ) : recommender}
          </Row>
        </div>
    )
};

export default connect(({ user, loading, home }) => ({
  user: user,
  myCourses: home.myCourses,
  recommendCourses: home.recommendCourses,
  isFetchingMyCourses: !!loading.effects['home/fetchMyCourses'],
  isFetchingRecommend: !!loading.effects['home/fetchRecommendCourses']
}))(Homepage);
