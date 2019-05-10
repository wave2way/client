import React, { Component } from 'react';
import { List, Icon, Input, Button } from 'antd';
import UserAvatar from '../user/userAvatar'
import moment from 'moment';
import RequestUtil from '../../../util/request'
import Replies from './reply'
moment.locale('zh-cn')

export default class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 1,
            limit: 10,
            data: [],
            total: 0,
            article_id: props.object_id,
            comment_num: 0,
            replyNum: 0,
            commentListStatus: []
        }
    }

    componentDidMount() {
        this.getComments(this.state.start, this.state.article_id)
    }

    getComments = (start, article_id) => {
        RequestUtil.GET("/api/community/comment/list", {
            kind: "article_comment",
            object_id: article_id,
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

    onCommentPageChange = (page) => {
        this.getComments(page, this.state.article_id)
        this.setState({
            start: page
        })
    }

    onArticleCommentClick = () => {
        RequestUtil.POST("/api/community/create/comment", {
            kind: "article_comment",
            content: this.state.article_comment_content,
            object_id: this.state.article_id,
        })
        .then(res => {
            if (res.code === 0) {
                this.getComments(this.state.start, this.state.article_id)
                //this.props.setCommentNum(res.data.comment_num, this.props.index)
            }
        })
    }

    onArticleCommentChange = (e) => {
        let value = e.target
        this.setState({
            article_comment_content: value.value
        })
    }

    onClickCommentIcon = (index) => {
        let commentListStatus = this.state.commentListStatus
        let pos = commentListStatus.indexOf(index)
        if (pos >= 0) {
            commentListStatus.splice(pos, 1)
        } else {
            commentListStatus.push(index)
        }
        this.setState({
            commentListStatus: commentListStatus
        })
    }

    onClickCommentAction = (id, status, index) => {
        RequestUtil.POST(`/api/community/option/${id}`, {
            kind: "comment",
            option: status >= 0 ? -1 : 1
        })
        .then(res => {
            if (res.code === 0) {
                let list = this.state.list
                list[index].like_users_num = res.data.num
                list[index].like_status = res.data.status
                this.setState({
                    list: list
                })
            }
        })
    }

    render() {
        return (
            <div className="comment-list">
                <List
                    bordered={true}
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: this.onCommentPageChange,
                        total: this.state.total
                    }}
                    dataSource={this.state.data}
                    header={<div style={{display:"flex", justifyContent:"space-between"}}><div>共有{this.state.total}人评论</div><div><Icon type="swap"/>切换排序</div></div>}
                    footer={
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <Input onChange={this.onArticleCommentChange} style={{width: "100%"}} addonAfter={<Icon type="smile" />} />
                            <Button onClick={this.onArticleCommentClick}>评论</Button>
                        </div>
                    }
                    renderItem={(item, index) => (
                        <List.Item key={item.id}>
                            <div style={{width:"100%"}}>
                                <div style={{display:"flex"}}>
                                    <div style={{display:"flex"}}>
                                        <UserAvatar id={item.create_user} avatar={item.create_user_avatar} />
                                    </div>
                                    <div style={{paddingLeft: "1rem"}}>
                                        {item.create_user_name}
                                    </div>
                                </div>
                                <div style={{paddingTop: "1rem", textIndent:"2rem"}}>{item.content}</div>
                                <div style={{display:"flex", justifyContent:"space-between"}}>
                                    <div style={{paddingTop:"1rem"}}>
                                        {/* <span style={{paddingRight:"1rem"}}>
                                            <Icon 
                                                onClick={this.onClickCommentAction.bind(this, item.id, item.like_status, index)}
                                                type="like-o" 
                                                style={{ marginRight: 8, color: item.like_status >= 0 ? "red" : "" }} 
                                            />
                                            {item.like_num}
                                        </span> */}
                                        <span onClick={this.onClickCommentIcon.bind(this, index)} style={{paddingRight:"1rem"}}>
                                            <Icon type="message" style={{ marginRight: 8 }} />
                                            <span>{this.state.commentListStatus.indexOf(index) >= 0 ? "收起评论" : "查看评论"}</span>
                                        </span>
                                    </div>
                                    <div>
                                        {moment.unix(item.create_time).fromNow()}
                                    </div>
                                </div>
                                {this.state.commentListStatus.indexOf(index) >= 0 ? <div style={{paddingTop:"1rem"}}><Replies comment_id={item.id} comment_user={item.create_user} index={index}/></div> : null}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}