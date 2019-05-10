import React, { Component } from 'react';
import { Row, Col, Card, Typography, Avatar, Icon, Popover } from 'antd';
import Banner from '../assembly/banner/banner'
import ArticleList from '../assembly/article/article'
import RequestUtil from '../../util/request';
import {ListContent, TagContent} from '../common'
import wechat from '../../static/wechat.jpg'
import qq from '../../static/qq.jpg'
const { Paragraph } = Typography;



export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newArticleData: [],
            recommendArticleData: [],
            tags: [],
        }
    }

    componentDidMount() {
        RequestUtil.GET("/api/article/type", {
            type: "new",
            limit: 5,
        })
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    newArticleData: res.data.data
                })
            }
        })
        RequestUtil.GET("/api/article/type", {
            type: "recommend",
            limit: 5,
        })
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    recommendArticleData: res.data.data
                })
            }
        })
        RequestUtil.GET("/api/article/tags")
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    tags: res.data
                })
            }
        })
    }
    
    render() {
        return (
            <Row >
                <Col span={17}>
                    <div style={{paddingTop: "1rem"}}>
                        <Banner/>
                    </div>
                    <div style={{paddingTop: "1rem"}}>
                        <Card>
                            <p><Icon type="fire" twoToneColor="#eb2f96" theme="twoTone" />  博文</p>
                            <ArticleList type="hot"/>
                        </Card>
                    </div>
                </Col>
                <Col span={7}>
                    <div style={{ paddingLeft:"1rem", paddingTop: "1rem" }}>
                        <Card
                            actions={[
                                <Popover content={<img width="150px" alt="wechat" src={wechat}/>}>
                                    <Icon type="wechat" />
                                </Popover>,
                                <Popover content={<img width="150px" alt="qq" src={qq}/>}>
                                    <Icon type="qq" />
                                </Popover>,
                                <Popover content={<Paragraph copyable>ynhmonster@163.com</Paragraph>}>
                                    <Icon type="mail" />
                                </Popover>,
                            ]}
                        >
                            <div style={{display:"flex"}}>
                                <span style={{position: "relative", bottom: "0px"}}>
                                    <Avatar size="large" icon="user" src="http://img.52z.com/upload/news/image/20180212/20180212084623_32086.jpg"/>
                                </span>
                                <div style={{paddingLeft: "1rem"}}>
                                    <div style={{color: "black"}}>怪人怪性&</div>
                                    <div>职业: 后端服务工程师</div>
                                    <div>现居: 北京</div>
                                </div>
                            </div>
                        </Card>
                        <div style={{paddingTop: "1rem"}}>
                            <ListContent data={this.state.newArticleData} title="最新文章" linkPath="/article/new"/>
                        </div>
                        <div style={{paddingTop: "1rem"}}>
                            <ListContent data={this.state.recommendArticleData} title="推荐文章" linkPath="/article/recommed"/>
                        </div>
                        <div style={{paddingTop: "1rem"}}>
                            <TagContent data={this.state.tags} title="标签" />
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}