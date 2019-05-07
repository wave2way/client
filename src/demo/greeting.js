import React, { Component } from 'react';

export default class Greet extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            isLogin: false,
            userInfo: [1,2,3,4,5,6,7,8,9]
        }
    }

    handleClick() {
        let isLogin = this.state.isLogin
        this.setState({isLogin:!isLogin})
    }

    render() {
        const isLogin = this.state.isLogin
        let button = null
        let userInfoItems = null
        if (isLogin) {
            button = <button onClick={this.handleClick}>Logout</button>
            userInfoItems = this.state.userInfo.map((info, index) => <Item key={index} entry={info}/>)
        } else {
            button = <button onClick={this.handleClick}>Login</button>
        }
        return (
            <div>
                <Greeting isLogin={isLogin}/>
                {button}
                {userInfoItems}
            </div>
        )
    }
}

function Greeting(props) {
    let isLogin = props.isLogin
    if (isLogin) {
        return (
            <h1>Welcome back</h1>
        )
    }
    return (
        <h1>Please login</h1>
    )
}

function Item(props) {
    let entry = props.entry
    return (
        <li>{entry}</li>
    )
}