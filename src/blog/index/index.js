import { Layout, Affix, BackTop, Row, Col, Menu, Breadcrumb, Card } from 'antd';
import React, { Component } from 'react';
import './index.less'
import { Route, Switch, Link, withRouter, Redirect } from 'react-router-dom';
import Home from '../home/home'
import Article from '../article/article'
import UserCenter from '../user/center'
import UserFollow from '../user/userFollowList'
import ArticleEntry from '../user/article'
import ArticleDetail from '../article/articleDetail'
import Message from '../assembly/message/message'
import logo from '../../static/monsterlogo.png'
import UserInfo from '../assembly/user/userInfo'
import ErrorPage from './error'


const { Header, Content, Footer } = Layout;

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
        }
    }

    setLoginStatus = (status) => {
        this.setState({
            isLogin: status
        })
    }

    render() {
        const HomeEntry = withRouter((props) => {
            const { location } = props
            const pathSnippets = location.pathname.split('/').filter(i => i);
            let breadcrumbItems = []
            breadcrumbItems.push(
                <Breadcrumb.Item key={1}>
                    主页
                </Breadcrumb.Item>
            )
            const extraBreadcrumbItems = pathSnippets.map((item, index) => {
                let url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                let name = ""
                if (item === "article" && url === "/article") {
                    name = "文章"
                } else if (item === "hot" && url === "/article/hot") {
                    name = "热门文章"
                } else if (item === "new" && url === "/article/new") {
                    name = "最新文章"
                } else if (item === "recommend" && url === "/article/recommend") {
                    name = "推荐文章"
                } else if (item === "all" && url === "/article/all") {
                    name = "全部文章"
                } else if (item === "detail" && url === "/article/detail") {
                    name = location.query ? location.query.name : "文章详情"
                } else if (item === "message" && url === "/message") {
                    name = "留言"
                } else if (item === "center" && url === "/center") {
                    name = "用户中心"
                } else if (item === "article" && url === "/center/article") {
                    name = "文章"
                } else if (item === "follow" && url === "/center/follow") {
                    name = "关注"
                }
                return (
                    <Breadcrumb.Item key={url}>
                        {name}
                    </Breadcrumb.Item>
                );
            });
            breadcrumbItems = breadcrumbItems.concat(extraBreadcrumbItems)
            return (
                <Card>
                    <Breadcrumb>
                        {breadcrumbItems}
                    </Breadcrumb>
                </Card>
                
            )
        })
        return (
                <Layout>
                    <Row>
                        <Col span={5}></Col>
                        <Col span={14}>
                        <Affix>
                            <Header>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <div style={{width: "20%"}}>
                                        <Link to={{pathname: "/", query: {name: "主页"}}}><img alt="logo" width="100%" src={logo} /></Link>
                                    </div>
                                    <div>
                                        <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ lineHeight: '64px'}} >
                                            <Menu.Item key="home">
                                                <Link to={{pathname: "/", query: {name: "主页"}}}>首页</Link>
                                            </Menu.Item>
                                            <Menu.Item key="article">
                                                <Link to={{pathname: "/article", query: {name: "文章"}}}>文章</Link>
                                            </Menu.Item>
                                            <Menu.Item key="message">
                                                <Link to={{pathname: "/message", query: {name: "留言"}}}>留言</Link>
                                            </Menu.Item>
                                        </Menu>
                                    </div>
                                    <div>
                                        <UserInfo />
                                    </div>
                                </div>
                            </Header>
                        </Affix>
                        <Content>
                            <div style={{paddingTop: "1rem"}}>
                                <HomeEntry />
                            </div>
                            
                            <Switch>
                                {/* 导航 */}
                                <Route exact path="/" component={ Home } />
                                <Route exact path="/article" component={ props => <Article {...props} articleType="hot"/> } />
                                <Route exact path="/message" component={ Message } />
                                {/* 文章 */}
                                <Route exact path="/article/hot" component={ props => <Article {...props} articleType="hot"/> } />
                                <Route exact path="/article/new" component={ props => <Article {...props} articleType="new"/> } />
                                <Route exact path="/article/recommend" component={ props => <Article {...props} articleType="recommend"/> } />
                                <Route exact path="/article/all" component={ props => <Article {...props} articleType="all"/> } />
                                <Route exact path="/article/detail/:id" component={ ArticleDetail } />
                                {/* 用户中心 */}
                                <Route exact path="/usercenter/:id" component={ UserCenter } />
                                <Route exact path="/center/user/:id" component={ ArticleEntry } />
                                <Route exact path="/center/article/:id" component={ ArticleEntry } />
                                <Route exact path="/center/follow/:id" component={ UserFollow } />
                                <Redirect exact strict from="/usercenter/:id" to="/center/article/:id" />
                                {/* 错误页面 */}
                                <Route component={ErrorPage} />
                            </Switch>
                            <BackTop />
                        </Content>
                        <Footer>
                            <div style={{ textAlign: 'center' }}>
                                <p>Copyright © 2019 RunnerMonster. All rights Reserved.</p>
                            </div>    
                        </Footer>  
                        </Col>
                        <Col span={5}></Col>
                    </Row>
                </Layout>
        )
    }
}