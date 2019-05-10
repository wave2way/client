import React, { Component } from 'react';
import { List } from 'antd';
import UserAvatar from '../assembly/user/userAvatar'
import RequestUtil from '../../util/request'
import { Tabs } from 'antd';
import UserEntry from '../user/center'

const TabPane = Tabs.TabPane;

export default class UserFollow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kind: "followed_user",
            followedStart: 1,
            followingStart: 1,
            limit: 10,
            followedData: [],
            followedTotal: 0,
            followingData: [],
            followingTotal: 0,
        }
    }

    componentDidMount() {
        this.getFollowedData(this.state.followedStart, this.state.kind)
    }

    getFollowedData = (start, kind) => {
        RequestUtil.GET(`/api/user/followed/${this.props.match.params.id}`, {
            type: kind,
            start: start,
            limit: this.state.limit,
        })
        .then(res => {
            if (res.code === 0) {
                if (this.state.kind === "followed_user") {
                    this.setState({
                        followedStart: start,
                        followedData: res.data.data,
                        followedTotal: res.data.total,
                    })
                } else {
                    this.setState({
                        followingStart: start,
                        followingData: res.data.data,
                        followedTotal: res.data.total,
                    })
                }
                
            }
        })
    }

    onFollowTabs = (key) => {
        let start = this.state.kind === "user_followed" ? this.state.followedStart : this.state.followingStart
        this.getFollowedData(start, key)
        this.setState({
            kind: key
        })
    }
    
    render() {
        return (
            <UserEntry>
                <Tabs defaultActiveKey="followed_user" onChange={this.onFollowTabs}>
                    <TabPane tab="关注" key="followed_user">
                        <UserFollowList data={this.state.followedData} />
                    </TabPane>
                    <TabPane tab="粉丝" key="user_followed">
                        <UserFollowList data={this.state.followingData} />
                    </TabPane>
                </Tabs>
            </UserEntry>
        )
    }
}

function UserFollowList(props) {
    const { data } = props
    return (
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
                <List.Item >
                    <List.Item.Meta
                        avatar={<UserAvatar id={item.id} avatar={item.avatar} />}
                        title={item.name}
                        description={item.signture && item.signture.length > 0 ? item.signture : "这个用户很懒..."}
                    />
                    <div style={{display:"flex", justifyContent: "end"}}>
                        <p style={{paddingRight: "1rem"}}>关注: {item.followed_user_num}</p>
                        <p style={{paddingRight: "1rem"}}>粉丝: {item.user_followed_num}</p>
                    </div>
                </List.Item>
            )}
        />
    )
}