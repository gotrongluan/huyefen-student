import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import { Row, Col, Avatar, List, Collapse, Input, Button, Icon, Spin as Loading, message as messagePopup, Skeleton } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import MessageView from './MessageView';
import Spin from '@/elements/spin/secondary';
import PaperPlane from '@/elements/icon/PaperPlane';
import { truncate, fromNow } from '@/utils/utils';
import { usePrevious } from '@/utils/hooks';
import OLD_MESSAGES from '@/assets/fakers/oldMessages';
import MESSAGES from '@/assets/fakers/messages';
import CONVERSATIONS from '@/assets/fakers/conversations';
import OLD_CONVERSATIONS from '@/assets/fakers/oldConversations';
import styles from './index.less';


const { Panel } = Collapse;

const Messenger = (props) => {
    const [firstUser, setFirstUser] = useState(null);
    const [curConverId, setCurrentConverId] = useState(null);
    const [message, setMessage] = useState('');
    const [conversations, setConversations] = useState(null);
    let [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [conversationsInitLoading, setConversationsInitLoading] = useState(false);
    const [messagesInitLoading, setMessagesInitLoading] = useState(false);
    const [currentUserLoading, setCurrentUserLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [conversationsLoading, setConversationsLoading] = useState(false);
    const prevConversations = usePrevious(conversations);
    const { match: {
        params: { converId } 
    } } = props;

    const firstConversation = null;
    // const firstConversation = {
    //     _id: 'new_conver',
    //     avatar: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-0/p640x640/42792810_1917076911720427_2309321533291495424_o.jpg?_nc_cat=110&_nc_ohc=GAtqnLxcynIAX8VZhpo&_nc_ht=scontent.fdad2-1.fna&_nc_tp=1002&oh=67837b802b62d8b1fb6423a3dc393017&oe=5E9B0CF0',
    //     name: 'My Hanh',
    //     lastMessage: 'Typing message...'
    // };

    useEffect(() => {
        fetchConversations();
        return () => {
            resetConversations();
            resetMessages();
            resetCurrentUser();
        };
    }, []);

    useEffect(() => {
        //fetchMessages
        if (converId) {
            fetchMessages(converId);
            //return () => resetMessages();
        }
    }, [converId]);

    useEffect(() => {
        if (converId) {
            fetchCurrentUser(converId);
            //return () => resetCurrentUser();
        }
    }, [converId]);

    useEffect(() => {
        if (!prevConversations && conversations && !converId) {
            if (firstConversation) {
                const user = {
                    ..._.pick(firstConversation, ['name', 'avatar']),
                    _id: 1,
                    converId: firstConversation._id
                };
                setCurrentUser({ ...user });
                setFirstUser({ ...user });
            }
            else {
                const firstConver = _.maxBy(_.toArray(conversations), 'updatedAt');
                if (firstConver) {
                    const converId = firstConver._id;
                    router.push(`/messenger/${converId}`);
                }
            }
        }
    }, [converId, conversations, prevConversations]);

    const fetchOldMessages = converId => {
        setMessagesLoading(true);
        setTimeout(() => {
            setMessages([...OLD_MESSAGES, ...messages]);
            setMessagesLoading(false);
        }, 1200);
    };

    const fetchMessages = converId => {
        setMessagesInitLoading(true);
        setTimeout(() => {
            setMessages(MESSAGES);
            setMessagesInitLoading(false);
        }, 1800);
    };

    const fetchCurrentUser = converId => {
        setCurrentUserLoading(true);
        setTimeout(() => {
            setCurrentUser({
                converId,
                _id: 1,
                name: 'Ngoc Hanh Vuong',
                avatar: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-0/p640x640/42792810_1917076911720427_2309321533291495424_o.jpg?_nc_cat=110&_nc_ohc=GAtqnLxcynIAX8VZhpo&_nc_ht=scontent.fdad2-1.fna&_nc_tp=1002&oh=67837b802b62d8b1fb6423a3dc393017&oe=5E9B0CF0'
            });
            setCurrentUserLoading(false);
        }, 2000);
    };

    const fetchConversations = () => {
        setConversationsInitLoading(true);
        setTimeout(() => {
            setConversations(CONVERSATIONS);
            setConversationsInitLoading(false);
        }, 2000);
    };

    const fetchOldConversations = () => {
        setConversationsLoading(true);
        setTimeout(() => {
            setConversations({
                ...conversations,
                ...OLD_CONVERSATIONS
            });
            setConversationsLoading(false);
        }, 1500);
    };

    const resetCurrentUser = () => setCurrentUser(null);

    const resetConversations = () => setConversations(null);

    const resetMessages = () => setMessages([]);

    const handleScrollConverList = e => {
        const element = e.srcElement;
        if (element.scrollTop === element.scrollHeight - (window.innerHeight - 128)) {
            if (!conversationsInitLoading && !conversationsLoading) fetchOldConversations();
        }
    };

    const handleClickConver = converId => {
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
        if (currentUser.converId !== converId) {
            if (converId === 'new_conver') {
                resetMessages();
                setCurrentUser({
                    ...firstUser
                });
                router.push('/messenger');
            }
            else router.push(`/messenger/${converId}`);
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
        messagePopup.success(`Sent message: "${message}" to ${curConverId}`);
        setMessage('');
        // if (message && _.trim(message) !== '') {
        //     const {
        //         sendMessage,
        //         currentUser,
        //     } = this.props;
        //     const userId = currentUser._id;
        //     const callback = converId => {
        //         this.socket.emit('joinConversation', converId, userId);
        //     }
        //     sendMessage(curConverId, userId, _.trim(message), callback);
        //     this.setState({
        //         message: ''
        //     });
        // }
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
        conversationsData =  _.orderBy(conversations, ['updatedAt'], ['desc']);
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
                            rowKey={item => item._id + _.uniqueId('conver_')}
                            renderItem={item => (
                                <List.Item 
                                    className={(currentUser && (currentUser.converId === item._id)) ? classNames(styles.item, styles.select) : styles.item}
                                    extra={item.loading ? null : <span style={{ fontSize: '13px', color: 'gray' }}>{ fromNow(item.updatedAt) }</span>}
                                    onClick={() => handleClickConver(item._id)}
                                >   
                                    <Skeleton avatar={{ size: 36 }} title={false} paragraph={{ rows: 2, width: ['40%','86%'] }} active loading={item.loading}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar} size={36} />}
                                            title={<span>{truncate(item.name, 46)}</span>}
                                            description={item.unseen > 0 ? (<span style={{ color: '#fada5e', fontWeight: 'bold' }}>{truncate(item.lastMessage, 46)}</span>) : (<span>{truncate(item.lastMessage, 46)}</span>)}
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
                            <Avatar size={36} src={currentUser.avatar} />
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
                                messages={messagesData}
                                converId={(currentUser && currentUser.converId) || null}
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
                                    <Avatar size={111} src={currentUser.avatar} />
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

export default withRouter(Messenger);