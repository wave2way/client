import React, { Component } from 'react';
import { Table } from 'antd';
import RequestUtil from '../util/request'

export default class TestTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 分页
            defaultStart:1,
            defaultLimit:10,
            // 列表
            total: 0,
            data: []
        }
    }

    componentDidMount() {
        RequestUtil.GET(this.props.path, {
            start:this.state.defaultStart,
            limit:this.state.defaultLimit
        })
        .then((res) => {
            if (res.code > 0) {
                alert(res.message)
            }
            let data = res.data && res.data.data ? res.data.data : []
            if (Array.isArray(data)) {
                this.setState({
                    data: data
                })
            }
            
        })
        .catch((err) => {
            alert(err, "123123")
        })
    }

    onChange = (page) => {
        RequestUtil.GET(this.props.path, {
            start:page,
            limit:this.state.limit
        })
        .then((res) => {
            if (res.code > 0) {
                alert(res.message)
            }
            let data = res.data.data
            if (Array.isArray(data)) {
                this.setState({
                    data: data
                })
            }
            
        })
        .catch((err) => {
            alert(err)
        })
    }

    render() {
        let data = this.state.data ? this.state.data : null
        return (
            <div>
                <Table 
                    dataSource={data} 
                    rowKey="id" 
                    pagination={{ pageSize: this.state.limit, total: this.state.total, onChange: this.onChange}}
                    columns={this.props.columns}
                />
            </div>
            
        )
    }
}