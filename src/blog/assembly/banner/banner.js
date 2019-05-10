import React, { Component } from 'react';
import { Carousel } from 'antd';
import './banner.less'
import RequestUtil from '../../../util/request'

export default class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerData: []
        }
    }

    componentDidMount() {
        this.getBannerData()
    }

    getBannerData = () => {
        RequestUtil.GET("/api/common/banner/list")
        .then(res => {
            if (res.code === 0) {
                this.setState({
                    bannerData: res.data
                })
            }
        })
    }

    render() {
        let images = this.state.bannerData
        let Item = images.map((item,index) => (
	        <div style={{ display:'flex', justifyContent:'center' }} key={item.object_id}><img alt="test" width="100%" height="auto" src={item.link} key={item.object_id}/></div>
	    ))
        return (
            <Carousel autoplay>
                {Item}
            </Carousel>
        )
    }
}