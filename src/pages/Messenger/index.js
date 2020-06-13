import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { Row, Col, Avatar, Badge, List, Collapse, Input, Button, Icon, Spin as Loading, message as messagePopup, Skeleton } from 'antd';
import UserAvatar from '@/components/Avatar';
import { Scrollbars } from 'react-custom-scrollbars';
import MessageView from './MessageView';
import PaperPlane from '@/elements/icon/PaperPlane';
import { truncate, fromNow } from '@/utils/utils';
import { usePrevious } from '@/utils/hooks';
import styles from './index.less';


const { Panel } = Collapse;

const Messenger = ({ dispatch, match, ...props }) => {
    const [firstUser, setFirstUser] = useState(null);
    const [message, setMessage] = useState('');
    const {
        firstConversation,
        conversations,
        currentUser,
        hasMoreConversations,
        hasMoreMessages,
        conversationsInitLoading,
        messagesInitLoading,
        currentUserLoading,
        messagesLoading,
        conversationsLoading,
        userId
    } = props;
    let { messages } = props;
    const prevConversations = usePrevious(conversations);
    const { converId } = match.params;

    //const firstConversation = null;
    // const firstConversation = {
    //     _id: 'new_conver',
    //     avatar: 'https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-9/42526239_1351247001684101_2131590022736904192_o.jpg?_nc_cat=105&_nc_sid=110474&_nc_oc=AQkYcdB2i-E0mZTEXV81owkPhMa-UBcPsdJlGVcrYiCWxodZBaLoxcnoXwD2VNocbrw&_nc_ht=scontent.fsgn2-2.fna&oh=b61af62f10a5c7bc1c98c36d02941ba2&oe=5E95752D',
    //     name: 'My Hanh',
    //     lastMessage: 'Typing message...'
    // };

    useEffect(() => {
        dispatch({
            type: 'messenger/fetchConversations'
        });
        return () => dispatch({
            type: 'messenger/reset'
        });
    }, []);

    useEffect(() => {
        if (converId) {
            dispatch({
                type: 'messenger/fetchMessages',
                payload: converId
            });
            dispatch({
                type: 'messenger/fetchUser',
                payload: converId
            });
        }
    }, [converId]);

    useEffect(() => {
        if (!prevConversations && conversations && !converId) {
            if (firstConversation) {
                const user = {
                    ..._.pick(firstConversation, ['name', 'avatar']),
                    _id: firstConversation.userId,
                    converId: firstConversation._id
                };
                dispatch({
                    type: 'messenger/saveUser',
                    payload: { ...user }
                });
                setFirstUser({ ...user });
            }
            else {
                const firstConver = _.maxBy(_.toArray(conversations), 'lastUpdated');
                if (firstConver) {
                    const converId = firstConver._id;
                    router.push(`/messenger/${converId}`);
                }
            }
        }
    }, [conversations]);

    const fetchOldMessages = converId => {
        if (hasMoreMessages)
            dispatch({
                type: 'messenger/moreMessages',
                payload: converId
            });
    };

    const handleScrollConverList = e => {
        const element = e.srcElement;
        if (element.scrollTop === element.scrollHeight - (window.innerHeight - 128)) {
            if (!conversationsInitLoading && !conversationsLoading && hasMoreConversations)
                dispatch({
                    type: 'messenger/moreConversations'
                });
        }
    };

    const handleClickConver = newConverId => {
        // const { fetchMessages, fetchCurrentUser, currentUser, saveCurrentUser, resetMessages, userId } = this.props;
        // const { curConverId } = this.state;
        // if (currentUser.converId !== converId) {
        //     if (_.startsWith(converId, 'new_conver_')) {
        //         this.setState({
        //             curConverId: null
        //         });
        //         saveCurrentUser(this.state.firstUser);
        //         resetMessages();
        //         if (curConverId) {
        //             this.socket.emit('leaveConversation', curConverId, userId);
        //         }
        //     }
        //     else {
        //         fetchMessages(converId);
        //         fetchCurrentUser(converId);
        //         if (curConverId) {
        //             this.socket.emit('leaveConversation', curConverId, userId);
        //         }
        //         this.socket.emit('joinConversation', converId, userId);
        //         this.setState({
        //             curConverId: converId
        //         });
        //     }
        // }
        if (converId !== newConverId) {
            dispatch({
                type: 'messenger/resetMessages'
            });
            if (newConverId === 'new_conver') {
                if (converId) {
                    dispatch({
                        type: 'messenger/saveUser',
                        payload: {
                            ...firstUser
                        }
                    })
                    router.push('/messenger');
                }
            }
            else router.push(`/messenger/${newConverId}`);
        }
    };

    const handleTypeMessage = e => setMessage(e.target.value);

    const parseToMessageListsByDate = messages => {
        let messageListsByDate = [];
        let currentTime = null;
        let currentObj = null;
        for (let i = 0; i < messages.length; ++i) {
            const message = messages[i];
            const time = moment(message.createdAt).format("MMM D");
            if (time !== currentTime) {
                currentTime = time;
                currentObj = {
                    day: currentTime,
                    messages: [message],
                };
                messageListsByDate.push(currentObj);
            }
            else {
                currentObj.messages.push(message);
            }
        }
        return messageListsByDate;
    };

    const handleSendMessage = () => {
        const messageContent = _.trim(message);
        if (messageContent !== '') {
            const targetId = currentUser._id;
            dispatch({
                type: 'messenger/send',
                payload: {
                    converId,
                    userId: targetId,
                    content: {
                        text: messageContent,
                        image: null,
                        video: null
                    },
                    createdAt: moment().toISOString()
                }
            });
            setMessage('');
        }
    };
    let conversationsData;
    if (!conversations || conversationsInitLoading) {
        conversationsData = [
            {
                _id: _.uniqueId('conver_loading_'),
                loading: true
            },
            {
                _id: _.uniqueId('conver_loading_'),
                loading: true
            },
            {
                _id: _.uniqueId('conver_loading_'),
                loading: true
            },
            {
                _id: _.uniqueId('conver_loading_'),
                loading: true
            }
        ];
    }
    else if (conversations !== null) {
        conversationsData =  _.orderBy(conversations, ['lastUpdated'], ['desc']);
        if (firstConversation) conversationsData = _.concat([firstConversation], conversationsData);
    }
    const messagesData = parseToMessageListsByDate(messages);
    const disabledInput = messagesLoading || conversationsInitLoading || conversations === null || currentUser === null || currentUserLoading;

    return (
        <Row className={styles.messenger}>
            <Col className={styles.conversations} span={6}>
                <div className={styles.header}>
                    <span className={styles.title}>Messenger</span>
                </div>
                <div className={styles.convers}>
                    <Scrollbars
                        autoHeight
                        autoHeightMax={window.innerHeight - (64 + 64)}
                        onScroll={handleScrollConverList}
                    >
                        <List
                            className={styles.conversationsList}
                            dataSource={conversationsData}
                            rowKey={item => item._id}
                            renderItem={item => (
                                <List.Item 
                                    className={(currentUser && (currentUser.converId === item._id)) ? classNames(styles.item, styles.select) : styles.item}
                                    extra={item.loading ? null : <span style={{ fontSize: '13px', color: 'gray' }}>{ fromNow(item.lastUpdated) }</span>}
                                    onClick={() => handleClickConver(item._id)}
                                >   
                                    <Skeleton avatar={{ size: 36 }} title={false} paragraph={{ rows: 2, width: ['40%','86%'] }} active loading={item.loading}>
                                        <List.Item.Meta
                                            avatar={(
                                                <UserAvatar
                                                    src={item.avatar}
                                                    text={item.name}
                                                    size={36}
                                                    textSize={36}
                                                    borderWidth={0}
                                                    style={{ background: 'white', color: 'black' }}
                                                />
                                            )}
                                            title={(
                                                <span className={styles.itemTitle}>
                                                    <span>{truncate(item.name, 46)}</span>
                                                    <span className={styles.unreadCount}>
                                                        <Badge count={item.unseen} className={styles.badge}/>
                                                    </span>
                                                </span>
                                            )}
                                            description={(<span className={styles.description}>{truncate(item.lastMessage, 46)}</span>)}
                                        />
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                        {conversationsLoading && (
                            <div className={styles.oldConverLoading}>
                                <Loading indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
                            </div>
                        )}
                    </Scrollbars>
                </div>
            </Col>
            <Col className={styles.rightCont} span={18}>
                <div className={styles.header}>
                    {currentUser !== null && !currentUserLoading && (
                        <React.Fragment>
                            <UserAvatar
                                src={currentUser.avatar}
                                text={currentUser.name}
                                size={36}
                                textSize={36}
                                borderWidth={0}
                                style={{ background: 'black', color: '#fada5e' }}
                            />
                            <span className={styles.name}>{currentUser.name}</span>
                        </React.Fragment>
                    )}                
                </div>
                <Row className={styles.content}>
                    <Col className={styles.messages} span={16}>
                        {messagesInitLoading ? (
                            <div className={styles.messLoading} style={{ height: `${window.innerHeight - 64 - 64 - 50}px`, position: 'relative' }}>
                                <div className={styles.inlineDiv}>
                                    <Loading indicator={<Icon type="loading-3-quarters" style={{ fontSize: 84 }} spin />} />
                                </div>
                            </div>
                        ) : (
                            <MessageView 
                                userId={userId}
                                messages={messagesData}
                                converId={converId}
                                fetchOldMessages={fetchOldMessages}
                                oldLoading={messagesLoading}
                            />
                        )}
                        <div className={styles.typeMessage}>
                            <Input placeholder="Enter message..." disabled={disabledInput} value={message} onChange={handleTypeMessage} onPressEnter={handleSendMessage}/>
                            <PaperPlane onClick={handleSendMessage} />
                        </div>
                    </Col>
                    <Col className={styles.info} span={8}>
                        <div className={styles.avatar}>
                            {currentUser !== null && !currentUserLoading && (
                                <React.Fragment>
                                    <UserAvatar
                                        src={currentUser.avatar}
                                        text={currentUser.name}
                                        size={111}
                                        textSize={111}
                                        borderWidth={0}
                                        style={{ background: 'black', color: '#fada5e', fontSize: '50px' }}
                                    />
                                    <div className={styles.name}>{currentUser.name}</div>
                                </React.Fragment>
                            )}
                            {currentUserLoading && (
                                <div className={styles.avatarLoading}>
                                    <div className={styles.inlineDiv}>
                                        <Skeleton active avatar={{ size: 111 }} title={false} paragraph={false} />
                                        <br />
                                        <Loading indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <Collapse
                            className={styles.allOptions}
                            bordered={false}
                            defaultActiveKey={['option']}
                        >
                            <Panel header={<span style={{ color: 'gray', fontWeight: 'bold' }}>OPTIONS</span>} key="option">
                                {currentUser !== null && !currentUserLoading && (
                                    <React.Fragment>
                                        <Row className={styles.option}>
                                            <Col span={20} className={styles.action}>
                                                Find in conversation
                                            </Col>
                                            <Col span={4} className={styles.icon}>
                                                <Button type="dashed" shape="circle" icon="search" onClick={() => router.push(`/friend/${currentUser._id}`)}/>
                                            </Col>
                                        </Row>
                                        <Row className={styles.option}>
                                            <Col span={20} className={styles.action}>
                                                Change color
                                            </Col>
                                            <Col span={4} className={styles.icon}>
                                                <Button type="dashed" shape="circle" icon="edit" />
                                            </Col>
                                        </Row>
                                        <Row className={styles.option}>
                                            <Col span={20} className={styles.action}>
                                                View profile
                                            </Col>
                                            <Col span={4} className={styles.icon}>
                                                <Button type="dashed" shape="circle" icon="profile" />
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                )}
                                {currentUserLoading && (
                                    <div className={styles.optionLoading}>
                                        <div className={styles.inlineDiv}>
                                            <Loading indicator={<Icon type="loading-3-quarters" style={{ fontSize: 44 }} spin />} />
                                        </div>
                                    </div>
                                )}
                            </Panel>
                            <Panel header={<span style={{ color: 'gray', fontWeight: 'bold' }}>SHARED IMAGES</span>} key="images">

                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default withRouter(
    connect(
        ({ messenger, user, loading }) => ({
            userId: user._id,
            conversations: messenger.conversations.list,
            messages: _.concat(messenger.messages.list, messenger.messages.sending),
            currentUser: messenger.user,
            firstConversation: messenger.conversations.first,
            hasMoreConversations: messenger.conversations.hasMore,
            hasMoreMessages: messenger.messages.hasMore,
            conversationsInitLoading: !!loading.effects['messenger/fetchConversations'],
            conversationsLoading: !!loading.effects['messenger/moreConversations'],
            messagesInitLoading: !!loading.effects['messenger/fetchMessages'],
            messagesLoading: !!loading.effects['messenger/moreMessages'],
            currentUserLoading: !!loading.effects['messenger/fetchUser']
        })
    )(Messenger)
);