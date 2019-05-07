import React, { Component } from 'react';
import E from 'wangeditor'

export default class Editor extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            editorContent: ''
        }
    }
    componentDidMount() {
        const elem = this.refs.editorElem
        const editor = new E(elem)
        // 菜单配置
        editor.customConfig.menus = [
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'justify',  // 对齐方式
            'quote',  // 引用
            'link', // 链接
            'emoticon',  // 表情
            'image',  // 插入图片
            'code',  // 插入代码
            'undo',  // 撤销
        ]
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            this.setState({
                editorContent: html
            })
            this.props.onContentChange(html)
        }
        editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        editor.create()
    }
    clickHandle() {
        alert(this.state.editorContent)
    }
    render() {
        return (
            <div>
                {/* <div style={{width: "100%"}} dangerouslySetInnerHTML={{__html: this.state.editorContent}} /> */}
                {/* 将生成编辑器 */}
                <div ref="editorElem" style={{textAlign: 'left', width: "100%"}}/>
                {this.props.debug ? <button onClick={this.clickHandle.bind(this)}>获取内容</button> : null}
            </div>
        );
    }
    
}