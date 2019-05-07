import React, { Component } from 'react';
import TestTable from './table'


class Test extends Component {
    
    render() {
        const userColumns = [{
            title: 'ID',
            dataIndex: 'id',
        },{
            title: '账号',
            dataIndex: 'account',
        },{
            title: '姓名',
            dataIndex: 'name',
        },{
            title: '性别',
            dataIndex: 'sex',
        },{
            title: '手机号',
            dataIndex: 'phone',
        },{
            title: '邮箱',
            dataIndex: 'email',
        },{
            title: '年龄',
            dataIndex: 'age',
        },{
            title: '头像',
            dataIndex: 'avatar',
        },{
            title: '个性签名',
            dataIndex: 'signtrue',
        },{
            title: '城市',
            dataIndex: 'city',
        },{
            title: '国家',
            dataIndex: 'country',
        }]
        return (
            <TestTable path="/user/list" columns={userColumns}/>
        )
    }
}

export default Test