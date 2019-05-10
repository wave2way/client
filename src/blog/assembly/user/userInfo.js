import React, { Component } from 'react';
import { Badge, Dropdown, Icon, List, Button } from 'antd'
import RequestUtil from '../../../util/request'
import UserAvatar from '../user/userAvatar'
import UserLogin from './Signin'
import moment from 'moment';
moment.locale('zh-cn')

export default class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            userInfo: null,
            userMessage: [],
            userMessageTotal: 0
        }
    }

    handleAvatarClick = () => {
        alert("user center")
    }

    handleMessageClick = () => {
        
    }

    getUserLoginStatus = (res) => {
        this.setState({
            isLogin: true,
            userInfo: res.userInfo
        })
    }

    handleUserMenuClick = (value) => {
        switch (value.key) {
            case "userCenter":{
                break
            }
            case "logout": {
                this.setState({
                    isLogin: false,
                    userInfo: null
                })
                localStorage.removeItem("user_token")
                break
            }
            default: {

            }
        }
    }

    handleUserLogout = () => {
        this.setState({
            isLogin: false,
            userInfo: null
        })
        localStorage.removeItem("user_token")
    }

    componentDidMount() {
        this.getUserInfo()
        this.getUserMessageList()
    }

    getUserMessageList = () => {
        RequestUtil.GET("/api/message/list")
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    userMessage: res.data.data,
                    userMessageTotal: res.data.total,
                })
            }
        })
    }

    getUserInfo = () => {
        RequestUtil.GET(`/api/user/info`)
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    userInfo: res.data,
                    isLogin: true
                })
            }
            
        })
    }

    handleMessageRead = (value) => {
        RequestUtil.PUT(`/api/message/read/${value}`)
        .then(res => {
            if (res.code === 0) {
                this.getUserMessageList()
            }
        })
    }

    onUserMessageMouseEnter = () => {
        this.getUserMessageList()
    }

    onReadAllButtonClick = () => {
        RequestUtil.PUT("/api/message/readall")
        .then(res => {
            if (res.code === 0) {
                this.getUserMessageList()
            }
        })
    }

    setLoginStatus = (status) => {
        this.setState({
            isLogin: status
        })
    }

    render() {
        let userMessageDropDownItem = 
        <div style={{"background":"white"}}>
            <List 
                bordered={true} 
                size="small" 
                itemLayout="horizontal" 
                dataSource={this.state.userMessage} 
                header={<div style={{display:"flex", justifyContent:"space-around"}}><div style={{textAlign:"center"}}></div><Button onClick={this.onReadAllButtonClick}>全部已读</Button></div>}
                renderItem={item => (
                <List.Item 
                    key={item.id} 
                    actions={[<Button onClick={this.handleMessageRead.bind(this, item.id)}>知道了</Button>]}
                >
                    <div>
                    <List.Item.Meta 
                        className="userCenter" 
                        avatar={<UserAvatar id={item.from_user_id} avatar={item.from_user_avatar} placement="left"/>}
                        //avatar={<Avatar src={item.from_user_avatar}/>} 
                        title={item.title} 
                        description={<p onClick={this.handleMessageRead.bind(this, item.id)} dangerouslySetInnerHTML={{ __html: item.content }}  />}
                    />
                    <div style={{display:"flex", justifyContent:"end"}}><p>{moment.unix(item.time).format("YY-MM-DD HH:mm:ss")}</p></div>
                    </div>
                    
                </List.Item>
            )}/>  
        </div>  
        return (
            <div style={{display:"flex", justifyContent:"flex-end"}}>
                <div>
                    <Icon type="search" theme="outlined"  style={{fontSize: 18, paddingRight:"20px"}}/>
                </div>
                <div>
                    <Dropdown overlay={userMessageDropDownItem} trigger={['click', "hover"]}>
                        <Badge count={this.state.userMessageTotal}>
                            <Icon type="bell" theme="outlined"  onMouseEnter={this.onUserMessageMouseEnter} style={{fontSize: 18}}/>      
                        </Badge>
                    </Dropdown>
                </div>
                <div style={{paddingLeft:"1rem"}}>
                    {   
                        this.state.isLogin ?
                            <UserAvatar id={this.state.userInfo.id} avatar={this.state.userInfo.avatar} type="self" getUserLoginStatus={this.getUserLoginStatus}/>
                        :
                            <UserLogin isLogin={this.state.isLogin} getUserLoginStatus={this.getUserLoginStatus}/>
                    }
                </div>
            </div>
        )
    }
}