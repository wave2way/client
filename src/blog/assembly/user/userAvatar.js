import React, { Component } from 'react';
import { Avatar, Card, Popover, Button, Icon } from 'antd';
import { message } from 'antd';
import RequestUtil from '../../../util/request';
import { Link } from 'react-router-dom';

export default class UserAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            user_id: this.props.id,
            user_avatar: this.props.avatar,
            placement: this.props.placement,
            userInfo: {}
        }
    }

    getUserInfo = () => {
        RequestUtil.GET(`/api/user/info/${this.state.user_id}`)
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    userInfo: res.data,
                    user_avatar: res.data.avatar,
                })
            }
            
        })
    }

    onOptionBarClick = (type) => {
        switch (type) {
            case "follow": {
                let follow_status
                switch (this.state.userInfo.follow_status) {
                    case "follow": {
                        follow_status = "unfollow"
                        break
                    }
                    case "unfollow": {
                        follow_status = "follow"
                        break
                    }
                    case "each": {
                        follow_status = "unfollow"
                        break
                    }
                    default: {
                        follow_status = "follow"
                    }
                }
                RequestUtil.PUT(`/api/user/follow/${this.state.userInfo.id}`, {
                    option: follow_status
                })
                .then(res => {
                    if (res.code === 0) {
                        this.getUserInfo()
                    }
                })
                break
            }
            case "logout": {
                localStorage.removeItem("user_token")
                window.location.reload()
                break
            }
            default: {
                message.error("暂不支持该功能，敬请期待")
            }
        }
    }

    render() {
        let optionBar = null
        let follow_status
        switch (this.state.userInfo.follow_status) {
            case "follow": {
                follow_status = "已关注"
                break
            }
            case "unfollow": {
                follow_status = "关注"
                break
            }
            case "each": {
                follow_status = "互相关注"
                break
            }
            default: {
                follow_status = "关注"
            }
        }
        switch (this.state.type) {
            case "self": {
                optionBar = 
                <div>  
                    <Link to={{pathname: `/center/article/${this.state.user_id}`, query:{name: "用户中心"}}}><Button>主页</Button></Link> 
                    <Button onClick={this.onOptionBarClick.bind(this, "logout")}>注销</Button>
                </div>
                break
            }
            default: {
                optionBar = 
                <div>   
                    <Link to={{pathname: `/center/article/${this.state.user_id}`, query:{name: "用户中心"}}}><Button>主页</Button></Link> 
                    <Button onClick={this.onOptionBarClick.bind(this, "follow")}>{follow_status}</Button>
                </div>
            }
        }
        return (
            <Popover 
                autoAdjustOverflow
                placement={this.state.placement ? this.state.placement : "bottom"}
                content={
                    <Card bordered={false}>
                        <div>
                            <div style={{display:"flex", paddingBottom:"1rem"}}>
                                <Avatar size="large" icon="user" src={this.state.userInfo.avatar} />
                                <div style={{paddingLeft:"1rem"}}>{this.state.userInfo.name}{this.state.userInfo.sex === 1 ? <Icon type="man" /> : <Icon type="woman" />}</div>
                            </div>
                            <div>
                                <p>{this.state.userInfo.signture || "这个人很懒..."}</p>
                            </div>
                        </div>
                        <div style={{display:"flex", justifyContent:"center", paddingBottom:"1rem"}}>
                            关注: {this.state.userInfo.followed_user_num || 0}  粉丝: {this.state.userInfo.user_followed_num || 0}
                        </div>
                        {optionBar}
                    </Card>
                } 
                trigger="hover"
            >
                <Link to={`/center/article/${this.state.user_id}`}>
                    <Avatar 
                        onMouseEnter={this.getUserInfo}
                        icon="user" src={this.state.user_avatar} 
                        size="small"
                    />
                </Link>
            </Popover>
        )
    }
}