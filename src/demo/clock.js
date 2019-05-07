import React, { Component } from 'react';


class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        }
    }

    componentDidMount() {
        this.timeId = setInterval(() => {
            this.tick()
        }, 1000)
    }

    componentWillMount() {
        clearInterval(this.timeId)
    }

    tick() {
        this.setState({
            date: new Date()
        })
    }

    render() {
        return (
            <div>
                <h1>Hello react</h1>
                <p>现在的时间是: {this.state.date.toLocaleTimeString()}.</p>
            </div>
        )
    }
}

export default Clock