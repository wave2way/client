import React, { Component } from 'react';

export default class Foo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false 
        }
    }

    callback = () => {
        this.setState({
            status: !this.state.status
        })
    }

    render() {
        return (
            <div>
                <h1>{this.state.status ? "true" : "false"}</h1>
                <Child callback={this.callback}/>
            </div>
            
        )
    }
}

class Child extends Component {

    change = () => {
        this.props.callback()
    }
    

    render() {
        return (
            <button onClick={this.change}>123</button>
        )
    }
}