import React, { Component } from 'react';
import { List, Icon, Input, Button } from 'antd';
import UserAvatar from '../user/userAvatar'
import moment from 'moment';
import RequestUtil from '../../../util/request'
moment.locale('zh-cn')

export default class Replies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 1,
            limit: 10,
            data: [],
            total: 0,
            comment_id: props.comment_id,
            comment_user: props.comment_user,
            article_comment_reply_content: "",
        }
    }

    componentDidMount() {
        this.getCommentReplies(this.state.start, this.state.comment_id)
    }

    getCommentReplies = (start, comment_id) => {
        RequestUtil.GET("/api/community/reply/list", {
            id: comment_id,
            start: start,
            limit: this.state.limit,
        })
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    data: res.data.data,
                    total: res.data.total
                })
            }
        })
    }

    onCommentReplyPageChange = (page) => {
        this.getCommentReplies(page, this.state.comment_id)
        this.setState({
            start: page
        })
    }

    onArticleCommentReplyClick = () => {
        RequestUtil.POST("/api/community/create/commentReply", {
            comment_user: this.state.comment_user,
            content: this.state.article_comment_reply_content,
            object_id: this.state.comment_id,
        })
        .then(res => {
            if (res.code === 0) {
                this.getCommentReplies(this.state.start, this.state.comment_id)
            }
        })
    }

    onArticleCommentReplyChange = (e) => {
        let value = e.target
        this.setState({
            article_comment_reply_content: value.value
        })
    }

    render() {
        return (
            <div className="comment-reply-list">
                <List
                    bordered={true}
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: this.onCommentReplyPageChange,
                        total: this.state.total
                    }}
                    dataSource={this.state.data}
                    header={<div style={{display:"flex", justifyContent:"space-between"}}><div>共有{this.state.total}人评论</div><div><Icon type="swap"/>切换排序</div></div>}
                    footer={
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <Input onChange={this.onArticleCommentReplyChange} style={{width: "100%"}} addonAfter={<Icon type="smile" />} />
                            <Button onClick={this.onArticleCommentReplyClick}>评论</Button>
                        </div>
                    }
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <div style={{width:"100%"}}>
                                <div style={{display:"flex"}}>
                                    <div style={{display:"flex"}}>
                                        <UserAvatar id={item.to_user} avatar={item.to_user_avatar} />
                                    </div>
                                    <div style={{paddingLeft:"1rem", paddingRight:"1rem"}}>
                                        <Icon type="swap" />
                                    </div>
                                    <div style={{display:"flex"}}>
                                        <UserAvatar id={item.user} avatar={item.user_avatar} />
                                    </div>
                                </div>
                                <div style={{paddingLeft: "3rem", paddingBottom: "1rem", paddingTop:"1rem"}}>
                                    {item.content}
                                </div>
                                <div style={{display:"flex", justifyContent:"space-between"}}>
                                    <div>
                                        {/* <span style={{paddingRight:"1rem"}}>
                                            <Icon 
                                                type="like-o" 
                                                style={{ marginRight: 8, color: item.like_status >= 0 ? "red" : "" }} 
                                            />
                                            {item.like_users_num}
                                        </span> */}
                                        {/* <span style={{paddingRight:"1rem"}}>
                                            <Icon type="message" style={{ marginRight: 8 }} />
                                            {2}
                                        </span> */}
                                    </div>
                                    <div>
                                        {moment.unix(item.create_time).fromNow()}
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}