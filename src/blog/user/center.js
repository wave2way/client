import React, { Component } from 'react';
import { Menu, Card, Row, Col, Avatar, Icon, Typography, message, Modal, Input, Tag, Button } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import Editor from '../assembly/editor/editor'
import RequestUtil from '../../util/request';
const { Paragraph } = Typography;
const CheckableTag = Tag.CheckableTag;

class UserCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            createArticle: false,
            title: "",
            description: "",
            content: "",
            categories: [],
            tags: [],
            selectedTags: [],
            selectedCategory: [],
            tagInputVisible: false,
            categoryVisible: false,
            inputValue: '',
            images: [],
        }
    }

    componentDidMount() {
        RequestUtil.GET(`/api/user/info/${this.props.match.params.id}`)
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    userInfo: res.data
                })
            }
        })
        RequestUtil.GET("/api/article/tags")
        .then(res => {
            console.log(res)
            if (res.code === 0) {
                let tags = []
                res.data.forEach(item => {
                    tags.push(item.tag)
                })
                this.setState({tags})
            }
        })
        RequestUtil.GET("/api/article/categories")
        .then(res => {
            if (res.code === 0) {
                let categories = []
                res.data.forEach(item => {
                    categories.push(item.category)
                })
                this.setState({categories})
            }
        })
    }

    onClickCreateArticle = () => {
        this.setState({
            createArticle: !this.state.createArticle
        })
        
    }

    onClickCreateArticle = () => {
        this.setState({
            createArticle: !this.state.createArticle
        })
    }

    onTitleChange = (title) => {
        this.setState({title})
    }

    onDescriptionChange = (description) => {
        this.setState({description})
    }

    onCategoryChange = (category, checked) => {
        const { selectedCategory } = this.state;
        const nextSelectedCategories = checked
            ? [...selectedCategory, category]
            : selectedCategory.filter(t => t !== category);
        this.setState({ selectedCategory: nextSelectedCategories });
    }

    onTagsChange = (tag, checked) => {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter(t => t !== tag);
        this.setState({ selectedTags: nextSelectedTags });
    }

    onContentChange = (content) => {
        this.setState({content})
    }

    saveInputRef = input => this.input = input

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = (kind) => {
        const { inputValue } = this.state;
        let { tags, categories } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1 && kind === "tag") {
            tags = [...tags, inputValue];
        } else if (inputValue && tags.indexOf(inputValue) === -1 && kind === "category") {
            categories = [...categories, inputValue]
        }
        if (kind === "tag") {
            this.setState({
                tags,
                categories,
                tagInputVisible: false,
                inputValue: '',
            });
        } else if (kind === "category") {
            this.setState({
                tags,
                categories,
                categoryInputVisible: false,
                inputValue: '',
            });
        }
        
    }

    showInput = (kind) => {
        if (kind === "tag") {
            this.setState({ tagInputVisible: true }, () => this.input.focus());
        } else {
            this.setState({ categoryInputVisible: true }, () => this.input.focus());
        }
        
    }

    submitArticle = () => {
        const { title, description, selectedTags, selectedCategory, content } = this.state
        if (title.length < 10) {
            message.error('文章标题必须大于10个字');
            return
        }
        if (description < 100) {
            message.error('描述必须大于30个字');
            return
        }
        if (selectedTags.length === 0) {
            message.error('标签数必须大于1');
            return
        }
        if (selectedCategory.length !== 1) {
            message.error('分类数必须为1');
            return
        }
        if (content.length < 100) {
            message.error('内容必须大于100个字');
            return
        }
        RequestUtil.POST("/api/article/create", {
            title: this.state.title,
            description: this.state.description,
            tags: this.state.selectedTags,
            category: this.state.selectedCategory[0],
            content: this.state.content,
            images: this.state.images,
        })
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    createArticle: false
                })
            }
        })
    }

    setImages = (images) => {
        this.setState({
            images
        })
    }
    
    render() {
        return (
            <div>
                <Row>
                    <Col span={17}>
                        <div style={{paddingTop: "1rem"}}>
                            <Menu mode="horizontal" defaultSelectedKeys={[this.state.selectMenu]}>
                                <Menu.Item key="article"><Link to={`/center/article/${this.state.userInfo.id}`}>文章</Link></Menu.Item>
                                <Menu.Item key="follow"><Link to={`/center/follow/${this.state.userInfo.id}`}>关注</Link></Menu.Item>
                            </Menu>
                            <Card>
                                {this.props.children}
                            </Card>
                        </div>
                    </Col>
                    <Col span={7}>
                        <div className="user-setting" style={{paddingTop: "1rem", paddingLeft: "1rem"}}>
                            <Card
                                actions={localStorage.getItem("id") === this.state.userInfo.id ? [<span onClick={this.onClickCreateArticle}>写文章</span>, <span>编辑</span>] : null}
                            >
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <Avatar size="large" icon="user" src={this.state.userInfo.avatar}/>
                                </div>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <Paragraph strong={true}>{this.state.userInfo.name} {this.state.userInfo.sex === 1 ? <Icon type="man" /> : <Icon type="woman" />}</Paragraph>
                                </div>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    {this.state.userInfo.signture || "这个人很懒..."}
                                </div>
                                {/* <div style={{display: "flex", justifyContent: "center"}}>
                                <span>年龄: {this.state.userInfo.age > 0 ? this.state.userInfo.age : "暂未设置"}</span>
                                </div>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                <span>城市: {this.state.userInfo.city && this.state.userInfo.city.length > 0 ? this.state.userInfo.city : "暂未设置"}</span>
                                </div>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                <span>国家: {this.state.userInfo.country && this.state.userInfo.country.length > 0 ? this.state.userInfo.country : "暂未设置"}</span>
                                </div> */}
                            </Card>
                            <Modal
                    title={<p style={{color: "black"}}>写文章</p>}
                    visible={this.state.createArticle}
                    onOk={this.submitArticle}
                    onCancel={this.onClickCreateArticle}
                    width="80%"
                >
                    <div>
                        <Card className="title">
                            <p style={{color: "black"}}>标题</p>
                            <Paragraph editable={{ onChange: this.onTitleChange }}>{this.state.title}</Paragraph>
                        </Card>
                        <Card className="description">
                            <p style={{color: "black"}}>摘要</p>
                            <Paragraph editable={{ onChange: this.onDescriptionChange }}>{this.state.description}</Paragraph>
                        </Card>
                        <Card className="category">
                            <p style={{color: "black"}}>分类</p>
                            <div>
                                {this.state.categories.map(category => {
                                    return (
                                        <CheckableTag
                                            key={category}
                                            checked={this.state.selectedCategory.indexOf(category) > -1}
                                            onChange={checked => this.onCategoryChange(category, checked)}
                                        >
                                            {category}
                                        </CheckableTag>
                                    )
                                })}
                                {
                                    this.state.categoryInputVisible ? (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            value={this.state.inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm.bind(this, "category")}
                                            onPressEnter={this.handleInputConfirm.bind(this, "category")}
                                        />
                                    ) : (
                                        <Tag
                                            onClick={this.showInput.bind(this, "category")}
                                            style={{ background: '#fff', borderStyle: 'dashed' }}
                                        >
                                            <Icon type="plus" /> 新分类 
                                        </Tag>
                                    )
                                }
                            </div>
                        </Card>
                        <Card className="tag">
                            <p style={{color: "black"}}>标签</p>
                            <div>
                                {this.state.tags.map(tag => {
                                    return (
                                        <CheckableTag
                                            key={tag}
                                            checked={this.state.selectedTags.indexOf(tag) > -1}
                                            onChange={checked => this.onTagsChange(tag, checked)}
                                        >
                                            {tag}
                                        </CheckableTag>
                                    )
                                })}
                                {
                                    this.state.tagInputVisible ? (
                                        <Input
                                            ref={this.saveInputRef}
                                            type="text"
                                            size="small"
                                            style={{ width: 78 }}
                                            value={this.state.inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm.bind(this, "tag")}
                                            onPressEnter={this.handleInputConfirm.bind(this, "tag")}
                                        />
                                    ) : (
                                        <Tag
                                            onClick={this.showInput.bind(this, "tag")}
                                            style={{ background: '#fff', borderStyle: 'dashed' }}
                                        >
                                            <Icon type="plus" /> 新标签 
                                        </Tag>
                                    )
                                }
                            </div>
                        </Card>                
                        <Card className="content">
                            <p>正文</p>
                            <div style={{width: "100%"}} dangerouslySetInnerHTML={{__html: this.state.content}} />
                        </Card>
                        <Editor onContentChange={this.onContentChange} setImages={this.setImages}/>
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <Button onClick={this.submitArticle}>提交</Button>
                        </div>
                    </div>
                </Modal>
                        </div>
                    </Col>
                </Row>
            </div>
            
        )
    }
}

export default withRouter(UserCenter)