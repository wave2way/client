import React, { Component } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import RequestUtil from '../../../util/request'
  
const LoginForm = Form.create({ name: 'modal' })(
    class extends Component {
        render() {
            const {
            visible, onCancel, onCreate, form,
            } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title={<p style={{color:"black"}}>加入我们</p>}
                    okText="登录"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical" style={{color: "black"}}>
                        <Form.Item label={<p style={{color: "black"}}>账号</p>}>
                            {getFieldDecorator('account', {
                            rules: [{ required: true, message: '请输入账号' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label={<p style={{color: "black"}}>密码</p>}>
                            {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }],
                            })(
                                <Input type="password"/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    }
);
  
// 
export default class UserLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLogin: props.loginStatus,
            userInfo: {}
        }
    }
  
    showModal = () => {
        this.setState({ visible: true });
    }
  
    handleCancel = () => {
        this.setState({ visible: false });
    }
  
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
            return;
            }
    
            this.login(values.account, values.password)
            form.resetFields();
            this.setState({ visible: false });
        });
    }
  
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    login = (account, password) => {
        RequestUtil.POST("/api/user/login", {
            account: account,
            password: password,
        })
        .then(res => {
            if (res.code === 0 && res.token) {
                localStorage.setItem('user_token', res.token);
                localStorage.setItem('id', res.data.id);
                this.setState({
                    userInfo: res.data
                }, () => {
                    window.location.reload()
                })
                this.props.getUserLoginStatus({userInfo: res.data})
            }
        })
    }
  
    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>登录</Button>
                <LoginForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}