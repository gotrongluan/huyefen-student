import React from 'react';
import _ from 'lodash';
import { List, Spin as Loading, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import MessagesList from '@/components/Message/List';
import styles from './MessageView.less';

class MessageView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.messageView = React.createRef();
    }

    componentDidMount() {
        this.messageView.current.scrollToBottom();
    }

    getSnapshotBeforeUpdate(prevProps) {
        const messages = _.flatten(_.map(this.props.messages, l => l.messages));
        const prevMessages = _.flatten(_.map(prevProps.messages, l => l.messages));
        if (_.size(messages) > _.size(prevMessages) && _.size(prevMessages) > 0) {
            const scrollbar = this.messageView.current;
            if (_.head(messages)._id !== _.head(prevMessages)._id) return scrollbar.getScrollHeight();
            return null;
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const messages = _.flatten(_.map(this.props.messages, l => l.messages));
        const prevMessages = _.flatten(_.map(prevProps.messages, l => l.messages));
        if (_.size(messages) > _.size(prevMessages) && _.size(prevMessages) > 0) {
            const scrollbar = this.messageView.current;
            if (snapshot)
                scrollbar.scrollTop(scrollbar.getScrollHeight() - snapshot);
            else
                scrollbar.scrollToBottom();
        }
    }

    handleScroll = e => {
        const element = e.srcElement;
        const { messages } = this.props;
        if (element.scrollTop === 0 && !_.isEmpty(messages)) {
            const { fetchOldMessages, converId } = this.props;
            if (converId)
                fetchOldMessages(converId);
        }
    }

    render() {
        const { messages, oldLoading, userId } = this.props;
        return (
            <Scrollbars
                height={window.innerHeight - 64 - 64 - 50}
                style={{ height: (window.innerHeight - 64 - 64 - 50) }}
                onScroll={this.handleScroll}
                ref={this.messageView}
            >
                {oldLoading && (
                    <div className={styles.oldLoading}>
                        <Loading indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
                    </div>
                )}
                {messages.length > 0 && (
                    <List
                        className={styles.listmessages}
                        itemLayout="vertical"
                        dataSource={messages}
                        split={false}
                        rowKey={item => item.day}
                        renderItem={item => {
                            return (
                                <List.Item>
                                    <div className={styles.date}><span>{item.day}</span></div>
                                    <MessagesList messages={item.messages} userId={userId} />
                                </List.Item>
                            );
                        }}
                    />
                )}
            </Scrollbars>
        )
    }
}

export default MessageView;
