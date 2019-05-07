import React, { Component } from 'react';

export default class From extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            value: 'Please input'
        }
        
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }

    handleSubmit(event) {
        alert("submit data: "+this.state.value)
        event.preventDefault()
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="textarea" value={this.state.value} onChange={this.handleChange} />
                </label>
                <select value={this.state.value} onChange={this.handleChange}>
                    <option value="address">Address</option>
                    <option value="email">Email</option>
                </select>
                <input type="submit" value="Submit"/>
            </form>
        )
    }
}