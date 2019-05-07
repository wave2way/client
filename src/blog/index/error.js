import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Empty } from 'antd';

export default class ErrorPage extends Component {
    render() {
        return (
            <Empty
                image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                imageStyle={{
                width: "100%",
                height: "auto"
                }}
                description={
                <span>
                    页面跑去火星啦~！
                    <Link to={{pathname: "/", query: {name: "主页"}}}>点我返回主页</Link>
                </span>
                }
            >
            </Empty>
        )
    }
}