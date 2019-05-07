import React, { Component } from 'react';
import { Table, Pagination } from 'antd';
import RequestUtil from '../util/request'

const { Column } = Table;

export default class RequestButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            //分页
            start:1,
            limit:10,
            // 数据表格
            data: null,
            total: 0,
            hasNext: false,
            current:0,
        }
    }

    componentDidMount() {
        RequestUtil.GET(`/user/list?start=${this.state.start}&limit=${this.state.limit}`)
        .then((res) => {
            if (res.code > 0) {
                alert(res.message)
            }
            let data = res.data.data
            if (Array.isArray(data)) {
                data.forEach((item, index) => {
                    item.key = index
                })
                this.setState({
                    data: data
                })
            }
        })
        .catch((err) => {
            alert(err)
        })
    }

    handleClick() {
        RequestUtil.GET(`/user/list?start=${this.state.start}&limit=${this.state.limit}`)
        .then((res) => {
            if (res.code > 0) {
                alert(res.message)
            }
            let data = res.data.data
            if (Array.isArray(data)) {
                data.forEach((item, index) => {
                    item.key = index
                })
                this.setState({
                    data: data
                })
            }
            
        })
        .catch((err) => {
            alert(err)
        })
    }

    changePage = () => {
        this.setState({
          current: 1,
        }, () => {
          RequestUtil.GET(`/user/list?start=${2}&limit=${10}`)
            .then((res) => {
                if (res.code > 0) {
                    alert(res.message)
                }
                let data = res.data.data
                if (Array.isArray(data)) {
                    data.forEach((item, index) => {
                        item.key = index
                    })
                    this.setState({
                        data: data
                    })
                }
                
            })
            .catch((err) => {
                alert(err)
            })
        })
      }

    render() {
        let data = this.state.data ? this.state.data : null
        return (
            <div>
                <button onClick={this.handleClick}>刷新</button>
                <GetUserList data={data} total={this.state.total} current={this.state.current}/>
            </div>
            
        )
    }
}

function GetUserList(props) {
    return (
        <div>
            <Table dataSource={props.data}>
                <Column title="ID" dataIndex="id" key="id"/>
                <Column title="Account" dataIndex="account" key="account"/>
                <Column title="Phone" dataIndex="phone" key="phone"/>
                <Column title="Email" dataIndex="email" key="email"/>
                <Column title="Name" dataIndex="name" key="name"/>
                <Column title="Sex" dataIndex="sex" key="sex"/>
                <Column title="Age" dataIndex="age" key="age"/>
                <Column title="Avatar" dataIndex="avatar" key="avatar"/>
                <Column title="SignTure" dataIndex="signTure" key="signture"/>
                <Column title="City" dataIndex="city" key="city"/>
                <Column title="Country" dataIndex="country" key="country"/>
            </Table>
            <Pagination defaultCurrent={1} total={50} />
        </div>
    )
}