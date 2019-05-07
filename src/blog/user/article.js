import React, { Component } from 'react';
import UserCenter  from './center'
import Article from '../assembly/article/article'

export default class ArticleEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: props.match.params.id,
        }
    }

    render() {
        return (
            <UserCenter>
                <div>
                    <Article key={this.state.createArticle} type="user" user_id={this.state.user_id}/>
                </div>
            </UserCenter>
        )
    }
}