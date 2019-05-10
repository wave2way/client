import React, { Component } from 'react';
import { List, Button, Skeleton, Icon, Card } from 'antd';
import RequestUtil from '../../../util/request'
import { Link } from 'react-router-dom';
import UserAvatar from '../user/userAvatar'
import moment from '../../../util/time';
const { Meta } = Card;
moment.locale('zh-cn')

export default class ArticleList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 分页 请求数据
            start: 1,
            limit: 10,
            total: 0,
            type: props.type,
            sort: props.sort,
            tags: props.tags,
            user_id: props.user_id,
            // 加载文章数据
            initLoading: false,
            loading: false,
            data: [],
            list: [],
            // 用户信息
            userInfo: {},
            commentListStatus:[],
        }
    }

    componentDidMount() {
        const { start } = this.state
        this.getData(data => {
            this.setState({
                initLoading: false,
                data: data.data,
                list: data.data,
                start: start + 1,
                total: data.total
            })
        })
    }

    getData = (callback) => {
        RequestUtil.GET("/api/article/type", {
            start: this.state.start,
            limit: this.state.limit,
            type: this.state.type,
            sort: this.state.sort,
            tags: this.state.tags,
            user_id: this.state.user_id
        })
        .then(res => {
            if (res.code === 0) {
                callback(res.data)
            }
        })
    }

    onLoadMore = () => {
        const list = this.state.data.concat([...new Array(3)].map(() => ({loading: true, name: {}})))
        this.setState({
            loading: true,
            list: list
        })
        this.getData(datas => {
            const data = this.state.data.concat(datas.data)
            let { start } = this.state
            this.setState({
                data,
                list: data,
                loading: false,
                start: start + 1,
                total: data.total
            }, () => {
                window.dispatchEvent(new Event('resize'))
            })
        })
    }

    onAvatarMouseEnter = (id) => {
        RequestUtil.GET(`/api/user/info/${id}`)
        .then(res => {
            this.setState({
                userInfo: res.data
            })
        })
    }

    onClickArticleAction = (type, id, status, index) => {
        switch (type) {
            case "like-o": {
                RequestUtil.POST(`/api/community/option/${id}`, {
                    kind: "article",
                    type: "like",
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
                break
            }
            case "star-o": {
                RequestUtil.POST(`/api/community/option/${id}`, {
                    kind: "article",
                    type: "collect",
                    option: status >= 0 ? -1 : 1
                })
                .then(res => {
                    if (res.code === 0) {
                        let list = this.state.list
                        list[index].collect_users_num = res.data.num
                        list[index].collect_status = res.data.status
                        this.setState({
                            list: list
                        })
                    }
                })
                break
            }
            default: {}
        }
    }

    onClickCommentIcon = (index) => {
        let status = this.state.commentListStatus
        let pos = status.indexOf(index)
        if (pos >= 0) {
            status.splice(pos, 1)
        } else {
            status.push(index)
        }
        this.setState({
            commentListStatus: status
        })
    }

    setCommentNum = (num, index) => {
        let data = this.state.data
        data[index].comment_num = num
        this.setState({
            data: data
        })
    }

    render() {
        const { initLoading, list, start, limit, total } = this.state
        const loadMore = (start-1) * limit < total ? (
            <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'}}>
                <Button onClick={this.onLoadMore}>加载更多</Button>
            </div>
        ) : (
            <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'}}>
                <span>我是有底线的</span>
            </div>
        )
        return (
            <List
                size="middle"
                className="article-list"
                loading={initLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={list}
                split={false}
                renderItem={(item, index) => (
                    <List.Item key={item.id}>
                        <Skeleton title={false} loading={item.loading} active>
                            <div style={{width: "100%"}}>
                            <Card>
                                <Meta 
                                    title={
                                        <div style={{display:"flex", justifyContent:"space-between"}}>
                                            <div>
                                                <Link to={{pathname: `/article/detail/${item.id}`, query: {name: item.title}}}>{item.title}</Link>
                                            </div>
                                        </div>}
                                    description={
                                        <div style={{display: "flex", height: "100px"}}>
                                            <div style={{width: Array.isArray(item.images) && item.images.length > 0 ? "70%" : "100%", height: "auto"}}>
                                                <div style={{textIndent:"2rem", height: "80%"}}>{item.description || "暂无"}</div>
                                                <div>
                                                    <span style={{paddingRight:"1rem"}}>
                                                        <Icon 
                                                            onClick={this.onClickArticleAction.bind(this, "like-o", item.id, item.like_status, index)} 
                                                            type="like-o" 
                                                            style={{ marginRight: 8, color: item.like_status >= 0 ? "red" : "" }} 
                                                        />
                                                        {item.like_users_num}
                                                    </span>
                                                    <span style={{paddingRight:"1rem"}}>
                                                        <Icon onClick={this.onClickCommentIcon.bind(this, index)} type="message" style={{ marginRight: 8 }} />
                                                        {item.comment_num}
                                                    </span>
                                                    <span style={{paddingRight:"1rem"}} >
                                                        <UserAvatar id={item.create_user} avatar={item.create_user_avatar} />
                                                    </span>
                                                    <span style={{paddingRight:"1rem"}} >
                                                        <Icon type="eye" style={{ marginRight: 8 }}/>
                                                        {item.read_num}
                                                    </span>
                                                    <span>
                                                        <Icon type="clock-circle" style={{ marginRight: 8 }}/>
                                                        {moment.unix(item.update_time).calendar()}
                                                    </span>
                                                    {/* {this.state.commentListStatus.indexOf(index) >= 0 ? <Comment index={index} setCommentNum={this.setCommentNum.bind(this)} object_id={item.id}/> : null} */}
                                                </div>
                                            </div>
                                            {}
                                            <div style={{width: Array.isArray(item.images) && item.images.length > 0 ? "30%" : "0px"}}>{Array.isArray(item.images) && item.images.length > 0 ? <img width="100%" height="auto" alt="item" src={item.images[0]}/> : null}</div>
                                        </div>
                                    }
                                />
                            </Card>
                            </div>
                            
                        </Skeleton>
                    </List.Item>
                )}
            />
        )
    }
}

