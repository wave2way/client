import React, { Component } from 'react';
import { List, Card } from 'antd';
import UserAvatar from '../assembly/user/userAvatar'
import RequestUtil from '../../util/request'
import UserEntry from '../user/center'

export default class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            userInfo: {}
        }
    }

    componentDidMount() {
        RequestUtil.GET(`/api/user/info/${this.state.id}`)
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    userInfo: res.data
                })
            }
        })
    }
    
    render() {
        return (
            <UserEntry>
                <Card>
                    
                </Card>
            </UserEntry>
        )
    }
}