import React, { Component } from 'react';
import { Empty } from 'antd';
import UserEntry from '../user/center'


export default class EmptyEntry extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <UserEntry>
                <Empty
                    image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                    description={
                        <span>
                            {this.props.content}
                        </span>
                    }
                >
                </Empty>
            </UserEntry>
            
        )
    }
}