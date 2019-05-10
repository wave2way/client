import React, { Component } from 'react';
import { Row, Col, Card, Typography, Button, Tag } from 'antd';
import RequestUtil from '../../util/request'
import { ListContent, TagContent } from '../common'
import UserAvatar from '../assembly/user/userAvatar'
import moment from 'moment'
import { Link } from 'react-router-dom';
import Comment from '../assembly/article/comment'
import wechat from '../../static/wechat.jpg'

export default class ArticleDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            sameArticleData: [],
            tagData: [],
            detailData: {}
        }
    }

    componentDidMount() {
        RequestUtil.GET("/api/article/type", {
            start: 1,
            limit: 5,
            type: "same",
            id: this.state.id,
        })
        .then(res => {
            this.setState({
                sameArticleData: res.data.data
            })
        })
        RequestUtil.GET("/api/article/tags")
        .then(res => {
            this.setState({
                tagData: res.data
            })
        })
        RequestUtil.GET(`/api/article/detail/${this.state.id}`,)
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    detailData: res.data
                })
            }
        })
    }

    onClickLike = () => {
        RequestUtil.POST(`/api/community/option/${this.state.id}`, {
            kind: "article",
            type: "like",
            option: this.state.detailData.like_status >= 0 ? -1 : 1,
        })
        .then(res => {
            if (res.code === 0) {
                let detailData = this.state.detailData
                detailData.like_users_num = res.data.num
                detailData.like_status = res.data.status
                this.setState({
                    detailData
                })
            }
        })
    }

    render() {
        const data = this.state.detailData
        return (
            <Row>
                <Col span={17}>
                    <div style={{paddingTop: "1rem"}}>
                        <Card>
                            <Typography>
                                <Typography.Title level={2}><p style={{color: "black"}}>{data.title}</p></Typography.Title>
                                <Typography.Text>
                                <div style={{display: "flex"}}>
                                    <UserAvatar key={data.title} id={data.create_user} avatar={data.create_user_avatar} />
                                    <p style={{paddingLeft: "1rem"}}>发布时间: {moment.unix(data.create_time).fromNow()}</p>
                                    
                                    <p style={{paddingLeft: "1rem"}}>浏览量: {data.read_num}</p>
                                </div>
                                </Typography.Text>
                                <div style={{display: "flex"}}>
                                    {data.tags ? data.tags.map((item, index) => {
                                        return <Tag key={index}><Link to={{pathname: "/article/all", query: {name: "全部文章"}}}>{item}</Link></Tag>
                                    }) : null}
                                </div>
                                <Card bordered={false}>
                                    <Card.Meta description={<div><p style={{color: "black"}}>摘要: </p>{data.description}</div>}/>
                                </Card>
                                <Card>
                                    <div dangerouslySetInnerHTML={{__html: data.content}} />
                                    <div style={{display: "flex", justifyContent: "flex-end", paddingTop: "1rem"}}>
                                        <div><p style={{paddingLeft: "1rem"}}>更新时间: {moment.unix(data.update_time).fromNow()}</p></div>
                                        <div><p style={{paddingLeft: "1rem"}}>作者: {data.create_user_name}</p></div>
                                    </div>
                                    
                                </Card>
                            </Typography>
                            <Card>
                                <div style={{display: "flex", justifyContent: "center" }}>
                                    <div>
                                        <img alt="wechat" src={wechat}/>
                                        <div>扫描关注微信公众号，第一时间获取博客更新动态</div>
                                    </div>
                                </div>
                            </Card>
                            <div style={{display: "flex", justifyContent: "center", paddingTop: "1rem"}}>
                            <Button style={{color: data.like_status >= 0 ? "red": "green"}} onClick={this.onClickLike}>点赞一下吧~({data.like_users_num})</Button>
                            </div>
                        </Card>
                    </div>
                    <div style={{paddingTop: "1rem"}}>
                        <Card>
                            <p>评论</p>
                            <Comment object_id={this.state.id} />
                        </Card>
                    </div>
                </Col>
                <Col span={7}>
                    <div style={{paddingLeft: "1rem", paddingTop: "1rem"}}>
                        <ListContent title="猜你喜欢" data={this.state.sameArticleData} linkPath="/article/all" />
                    </div>
                    <div style={{paddingLeft: "1rem", paddingTop: "1rem"}}>
                        <TagContent title="标签" data={this.state.tagData} />
                    </div>
                    
                </Col>
            </Row>
        )
    }
}