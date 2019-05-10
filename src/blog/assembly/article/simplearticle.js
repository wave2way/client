import React, { Component } from 'react';
import { List, Button, Skeleton, Icon } from 'antd';
import RequestUtil from '../../../util/request'
import moment from 'moment';
moment.locale('zh-cn')

export default class SimpleArticleList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 分页
            start: 1,
            limit: 10,
            total: 0,
            // 加载文章数据
            initLoading: false,
            loading: false,
            data: [],
            list: [],
        }
    }

    componentDidMount() {
        let { start } = this.state
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
            user_id: "5cc066bc6fe3ce1e68308481",
            type: "user"
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
                renderItem={(item, index) => (
                    <List.Item key={item.id}>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <div style={{display:"flex", justifyContent:"space-between", paddingTop: "1rem", paddingLeft: "1rem"}}>
                                            <div style={{paddingLeft:"1rem"}}>{item.title}</div>
                                            <div>{<p>{moment.unix(item.update_time).fromNow()}</p>} </div>
                                        </div>}
                                    description={
                                        <div>
                                            <div style={{display:"flex"}}>
                                                <div style={{textIndent:"2rem"}}>{item.description || "暂无"}</div>
                                                <div>{Array.isArray(item.images) && item.images.length > 0 ? <img width="250px" alt="item" src={item.images[0]}/> : null}</div>
                                            </div>
                                            <div style={{paddingBottom:"1rem"}}>
                                                <span style={{paddingRight:"1rem"}}>
                                                    <Icon 
                                                        type="star-o" 
                                                        style={{ marginRight: 8, color: item.collect_status >= 0 ? "red" : "" }} 
                                                    />
                                                    {item.collect_users_num}
                                                </span>
                                                <span style={{paddingRight:"1rem"}}>
                                                    <Icon
                                                        type="like-o" 
                                                        style={{ marginRight: 8, color: item.like_status >= 0 ? "red" : "" }} 
                                                    />
                                                    {item.like_users_num}
                                                </span>
                                                <span style={{paddingRight:"1rem"}}>
                                                    <Icon
                                                        type="message" 
                                                        style={{ marginRight: 8 }} />
                                                    {item.comment_num}
                                                </span>
                                            </div>
                                        </div>}
                                />
                               
                            </List.Item>
                        </Skeleton>
                    </List.Item>
                )}
            />
        )
    }
}

