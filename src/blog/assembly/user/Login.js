import { Modal, Form, Input, Select } from 'antd';
import React, { Component } from 'react';
import RequestUtil from '../../../util/request';
const { Option } = Select;
  
const UserLoginFrom = Form.create({ name: '登陆' })(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onLogin, form,
            } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal visible={visible} title="登陆" okText="登陆" onCancel={onCancel} onOk={onLogin} >
                    <Form layout="vertical">
                        <Form.Item
                            label="账号类型" hasFeedback>
                            {getFieldDecorator('type', {
                                rules: [
                                    { required: true, message: 'Please select your account type!' },
                                ],
                            })(
                                <Select initialValue="phone" placeholder="Please select account type">
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
                    </Form>
                </Modal>
            );
        }
    }
);

const UserRegistFrom = Form.create({ name: '注册' })(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onLogin, form,
            } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal visible={visible} title="加入我们" okText="注册" onCancel={onCancel} onOk={onLogin} >
                    <Form layout="vertical">
                        <Form.Item
                            label="账号类型" hasFeedback>
                            {getFieldDecorator('type', {
                                rules: [
                                    { required: true, message: 'Please select your account type!' },
                                ],
                            })(
                                <Select initialValue="phone" placeholder="Please select account type">
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
                        <Form.Item
                            label="Password"
                            >
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
                        <Form.Item
                            label="Confirm Password"
                            >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                required: true, message: 'Please confirm your password!',
                                }, {
                                validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    }
);
  
export default class UserLoginOrRegist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            modalType: "login"
        }
    }
  
    showModal = (value) => {
        this.setState({ visible: true, modalType: value });
    }
  
    handleCancel = () => {
      this.setState({ visible: false });
    }

    handleLoginStatus = (isLogin, userInfo) => {
        this.props.callback({isLogin:isLogin, userInfo:userInfo})
    }
  
    handleLogin = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            RequestUtil.POST("/api/user/login", values)
            .then(res => {
                if (res.code === 0 && res.token) {
                    localStorage.setItem('user_token', res.token);
                    this.handleLoginStatus(true, res.data)
                }
            })
            form.resetFields();
            this.setState({ visible: false }, () => {
                window.location.reload()
            })
            
        });
    }

    handleRegist = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            RequestUtil.POST("/api/user/regist", values)
            .then(res => {
                localStorage.setItem('user_token', res.token);
                this.handleLoginStatus(true, res.data)
            })
            form.resetFields();
            this.setState({ visible: false });
        });
    }
  
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
  
    render() {
        return (
            <div>
                <p onClick={this.showModal.bind(this, "login")}>登陆</p>       <p onClick={this.showModal.bind(this, "regist")}>注册</p>
                {this.state.modalType === "login" ? 
                    <UserLoginFrom
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onLogin={this.handleLogin}
                    />
                    :
                    <UserRegistFrom
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onLogin={this.handleRegist}
                    />
                }  
            </div>
        );
    }
}