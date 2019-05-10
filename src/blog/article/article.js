import React, { Component } from 'react';
import { Row, Col, Card, Menu, Tag, Icon } from 'antd';
import ArticleList from '../assembly/article/article'
import { Link } from 'react-router-dom';
import RequestUtil from '../../util/request'
import {ListContent, TagContent} from '../common'
const CheckableTag = Tag.CheckableTag;


export default class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort: -1,
            hotArticleData: [],
            newArticleData: [],
            recommendArticleData: [],
            tags: [],
            selectedTags: [],
            articleKey: 0,
        }
    }

    componentDidMount() {
        const tag = this.props.location && this.props.location.query && this.props.location.query.tag ? this.props.location.query.tag : null
        if (tag) {
            let { selectedTags } = this.state
            selectedTags.push(tag)
            this.setState({
                selectedTags
            })
        }
        RequestUtil.GET("/api/article/type", {
            type: "hot",
            limit: 5,
        })
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    hotArticleData: res.data.data
                })
            }
        })
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

    onClickSort = () => {
        let sort = this.state.sort === 1 ? -1 : 1
        this.setState({
            sort: sort
        })
    }

    selectTag(tag, checked) {
        const { selectedTags, articleKey } = this.state;
        const nextSelectedTags = checked
          ? [...selectedTags, tag]
          : selectedTags.filter(t => t !== tag);
        this.setState({ selectedTags: nextSelectedTags, articleKey: articleKey + 1 });
    }
    
    render() {
        return (
            <Row >
                <Col span={17}>
                    <div style={{paddingTop: "1rem"}}>
                        <Card>
                            <Menu mode="horizontal" onSelect={this.onArticleTypeChange} selectedKeys={[this.props.articleType]}>
                                <Menu.Item key="hot">
                                    <Link to={{pathname: "/article/hot", query: {name: "热门文章"}}}>热门</Link>
                                </Menu.Item>
                                <Menu.Item key="new">
                                    <Link to={{pathname: "/article/new", query: {name: "最新文章"}}}>最新</Link>
                                </Menu.Item>
                                <Menu.Item key="recommend">
                                    <Link to={{pathname: "/article/recommend", query: {name: "推荐文章"}}}>推荐</Link>
                                </Menu.Item>
                                <Menu.Item key="all">
                                    <Link to={{pathname: "/article/all", query: {name: "全部文章"}}}>全部</Link>
                                </Menu.Item>
                            </Menu>
                            {this.props.articleType === "all" ? 
                                <Card>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <p style={{color: "black"}}>标签</p>
                                        <div onClick={this.onClickSort}><p><Icon type="filter" />{this.state.sort === 1 ? "倒序" : "正序"}</p></div>
                                        
                                    </div>
                                    <div>
                                        {this.state.tags.map((item, index) => {
                                            return (
                                                <CheckableTag
                                                    key={item.tag}
                                                    checked={this.state.selectedTags.indexOf(item.tag) > -1}
                                                    onChange={checked => this.selectTag(item.tag, checked)}
                                                >
                                                    {item.tag}
                                                </CheckableTag>
                                            )
                                        })}
                                    </div>
                                </Card>
                            : null}
                            <ArticleList key={this.state.selectedTags + this.state.sort} type={this.props.articleType} sort={this.state.sort} tags={this.state.selectedTags} />
                        </Card>
                    </div>
                </Col>
                <Col span={7}>
                    <div style={{ paddingLeft: "1rem"}}>
                        {this.props.articleType !== "hot" ? <div style={{paddingTop: "1rem"}}><ListContent title="热门" data={this.state.hotArticleData} linkPath="/article/hot" /></div>: null}
                        {this.props.articleType !== "new" ? <div style={{paddingTop: "1rem"}}><ListContent title="最新" data={this.state.newArticleData} linkPath="/article/new"/></div>: null}
                        {this.props.articleType !== "recommend" ? <div style={{paddingTop: "1rem"}}><ListContent title="推荐" data={this.state.recommendArticleData} linkPath="/article/recommend"/></div>: null}
                        <div style={{paddingTop: "1rem"}}>
                            <TagContent title="标签" data={this.state.tags} />
                        </div>  
                    </div>
                </Col>
            </Row>
        )
    }
}