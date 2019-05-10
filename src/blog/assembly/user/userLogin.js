import {Form, Input, Select, Button, Drawer, Icon} from 'antd';
import React, { Component } from 'react';
import RequestUtil from '../../../util/request'
const { Option } = Select;

export default class UserLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            visible: false
        }
    }

    // 处理提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                RequestUtil.POST("/api/user/login", values)
                .then(res => {
                })
                .catch(err => {
                })
            }
        });
        
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    
    onClose = () => {
            this.setState({
            visible: false,
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Button type="primary" onClick={this.showDrawer}>
                    <Icon type="plus" /> 登陆
                </Button>
                <Drawer title="Login" width={300} onClose={this.onClose} visible={this.state.visible} style={{overflow: 'auto',height: 'calc(100% - 108px)',paddingBottom: '108px',}}>
                    <Form  layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
                        <Form.Item
                            label="账号类型" hasFeedback>
                            {getFieldDecorator('type', {
                                rules: [
                                    { required: true, message: 'Please select your account type!' },
                                ],
                            })(
                                <Select defaultValue="phone" placeholder="Please select account type">
                                    <Option value="phone">手机号</Option>
                                    <Option value="account">账号</Option>
                                    <Option value="email">邮箱</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="账号" >
                            {getFieldDecorator('account', {
                                rules: [{ required: true, message: 'Please input your phone/account/email!' }],
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: 'Please input your password!',
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button style={{ marginRight: 8 }} onClick={this.onClose} type="primary" htmlType="submit" >
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        )
    }
}


  