import React, { Component } from 'react';
import {Comment, Avatar, Form, Button, Popover, Input, Card, Modal } from 'antd';
import RequestUtil from '../../../util/request'
import moment from 'moment';

export default class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 分页
            start: 1,
            limit: 10,
            total: 0,
            data: [],
            messagerAvatar: "http://jxhx2.yangqq.com/e/tool/images/tx1.jpg",
            messagerName: "游客",
            submitting: false,
            content: '',
        }
    }

    componentDidMount = () => {
        this.getLeaveMessageList(this.state.start, this.state.limit)
    }

    handleChange = (e) => {
        this.setState({
          content: e.target.value,
        });
    }

    onClickSelectAvatar = (index) => {
        this.setState({
            messagerAvatar: defaultAvatar[index].src
        })
    }

    getLeaveMessageList = (start, limit) => {
        RequestUtil.GET("/api/leaveMessage/list", {
            start: start,
            limit: limit
        })
        .then(res => {
            this.setState({
                data: res.data.data,
                total: res.data.total
            })
        })
    }

    onClickLeaveMessageButton = () => {
        if (!this.state.content) {
            return;
        }
      
        this.setState({
            submitting: true,
        });

        RequestUtil.POST("/api/leaveMessage/create/leaveMessage", {
            content: this.state.content,
            create_user_avatar: this.state.messagerAvatar,
            create_user_name: this.state.messagerName,
        })
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    submitting: false,
                    content: '',
                });
                this.getLeaveMessageList(this.state.start, this.state.limit)
                this.setState({
                    visible: false
                })
            }
        })
    }

    commentLeaveMessage = (messageId) => {
        if (!this.state.content) {
            return;
        }
      
        this.setState({
            submitting: true,
        });

        RequestUtil.POST("/api/leaveMessage/comment", {
            content: this.state.content,
            create_user_avatar: this.state.messagerAvatar,
            create_user_name: this.state.messagerName,
            message_id: messageId,
        })
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    submitting: false,
                    content: '',
                });
                this.getLeaveMessageList(this.state.start, this.state.limit)
                this.setState({
                    visible: false
                })
            }
        })
    }

    onClickReply = (id) => {
        this.setState({
            visible: !this.state.visible
        })
        this.commentLeaveMessage(id)
    }

    render() {
        return (
            <div>
                <LeaveMessageEntry 
                        messagerAvatar={this.state.messagerAvatar}
                        onClickSelectAvatar={this.onClickSelectAvatar}
                        handleChange={this.handleChange}
                        onClickLeaveMessageButton={this.onClickLeaveMessageButton}
                        submitting={this.state.submitting}
                        content={this.state.content}
                    />

                    <Card>
                        {this.state.data.map((item, index) => {
                            return (
                                <LeaveMessage item={item} key={index} onClickReply={this.onClickReply} >
                                    {item.comments.map((entry, num) => {
                                        return <LeaveMessage item={entry} key={num} onClickReply={this.onClickReply} />
                                    })}
                                </LeaveMessage>
                            )
                        })}
                    </Card>
                    
                    <Modal
                        title="Modal"
                        visible={this.state.visible}
                        onCancel={this.onClickReply}
                        footer={null}
                        closable={true}
                    >
                        <LeaveMessageEntry 
                            messagerAvatar={this.state.messagerAvatar}
                            onClickSelectAvatar={this.onClickSelectAvatar}
                            handleChange={this.handleChange}
                            onClickLeaveMessageButton={this.commentLeaveMessage}
                            submitting={this.state.submitting}
                            content={this.state.content}
                        />
                    </Modal>
            </div>
            
        )
    } 
}

const LeaveMessage = ({children, item, onClickReply, id}) => (
    <Comment
        //actions={[<span onClick={onClickReply.bind(this, id)}>回复</span>]}
        author={<p>{item.create_user_name}</p>}
        avatar={(
            <Avatar
                src={item.create_user_avatar}
                alt={item.create_user_name}
            />
        )}
        //datetime={moment.unix(item.create_time).fromNow()}
        datetime={moment.unix(item.create_time).calendar()}
        content={<p>{item.content}</p>}
    >
        {children}
    </Comment>
);

function LeaveMessageEntry(props) {
    const { messagerAvatar, onClickSelectAvatar, handleChange, onClickLeaveMessageButton, submitting, content } = props
    return (   
        <Card>
            <Comment
                avatar={(
                    <div>
                        <div style={{display:"flex", justifyContent:"center", paddingTop:"1rem"}}>
                            <Avatar
                                src={messagerAvatar}
                                alt="visitor"
                            />
                        </div>
                        <div style={{paddingTop: "1rem"}}>
                            <Popover 
                                placement="bottom" 
                                content={
                                    <Card>
                                        {defaultAvatar.map((item, index) => {
                                            return (
                                                <Card.Grid 
                                                    onClick={onClickSelectAvatar.bind(this, index)}
                                                    key= {index} 
                                                    style={{width:"25%", textAlign: 'center'}}
                                                >
                                                    <img alt={item.alt} src={item.src}/>
                                                </Card.Grid>
                                            )
                                        })}
                                    </Card>
                                } 
                                trigger="click">
                                <Button>选择头像</Button>
                            </Popover>
                        </div>
                    </div>               
                )}
                content={(
                    <Editor
                        onChange={handleChange}
                        onSubmit={onClickLeaveMessageButton}
                        submitting={submitting}
                        value={content}
                    />
                )}
            />
        </Card> 
    )
}

const TextArea = Input.TextArea;

const Editor = ({
    onChange, onSubmit, submitting, value,
  }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <div style={{display:"flex", justifyContent: "flex-end"}}>
                <Button
                    htmlType="submit"
                    loading={submitting}
                    onClick={onSubmit}
                    type="primary"
                >
                    留言
                </Button>
            </div>
      </Form.Item>
    </div>
);

const defaultAvatar = [
    {
        alt: "default1",
        src: "http://jxhx2.yangqq.com/e/tool/images/tx1.jpg"
    }
    ,{
        alt: "default2",
        src: "http://jxhx2.yangqq.com/e/tool/images/tx2.jpg"
    }
    ,{
        alt: "default3",
        src: "http://jxhx2.yangqq.com/e/tool/images/tx3.jpg"
    }
    ,{
        alt: "default4",
        src: "http://jxhx2.yangqq.com/e/tool/images/tx4.jpg"
    }
    ,{
        alt: "default5",
        src: "http://jxhx2.yangqq.com/e/tool/images/tx5.jpg"
    }
    ,{
        alt: "default6",
        src: "http://jxhx2.yangqq.com/e/tool/images/tx6.jpg"
    }
    ,{
        alt: "default7",
        src: "http://jxhx2.yangqq.com/e/tool/images/tx7.jpg"
    }
    ,{
        alt: "default8",
        src: "http://jxhx2.yangqq.com/e/tool/images/tx8.jpg"
    }
]