import React, { Component } from 'react';
import moment from 'moment';
import crypto from 'crypto'
import axios from "axios"
moment.locale('zh-cn')

axios.defaults.headers.common["content-type"] = "application/json"
axios.defaults.timeout = 1000 * 60

let salt = "test"

function signParams(data, timestamp) {
    let keyArray = []
  for (let key in data) {
    keyArray.push(key)
  }
  keyArray.sort((item1, item2) => {
    return item1.length > item2.length
  })
  let sortParamsStr = ''
  keyArray.forEach(item => {
    sortParamsStr += item
  })
  let hmac = crypto.createHmac('sha256', salt);
  hmac.update(`${sortParamsStr}_timestamp${timestamp}`);
  let sign = hmac.digest('hex').toLocaleUpperCase()
  return sign
}

// 请求中间件
axios.interceptors.request.use(function (config) {
    // Do something with response data
    let timestamp = moment().unix()
    config.headers["sign"] = signParams(config.params, timestamp)
    config.headers["timestamp"] = timestamp
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 响应中间件
axios.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    }
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

// 请求工具
class RequestUtil {
    static GET(path, data) {
        return new Promise((resolve, reject) => {
            axios.get(path, {
                params: data
            })
            .then((res) => {
                resolve(res)
            })
            .catch((err => {
                reject(err)
            }))
        })
    }
    static POST(path, data) {
        return new Promise((resolve, reject) => {
            axios.post(path, data)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }
    static PUT(path, data) {
        return new Promise((resolve, reject) => {
            axios.put(path, data)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }
    static DELETE(path, data) {
        return new Promise((resolve, reject) => {
            axios.delete(path, {
                params: data
            })
            .then((res) => {
                resolve(res)
            })
            .catch((err => {
                reject(err)
            }))
        })
    }
}

class CheckAuth extends Component {
    constructor(props) {
        super(props);
        this.handleGetClick = this.handleGetClick.bind(this)
        this.handlePostClick = this.handlePostClick.bind(this)
        this.handlePutClick = this.handlePutClick.bind(this)
        this.handleDeleteClick = this.handleDeleteClick.bind(this)
        this.state = {
            data: null
        }
    }

    handleGetClick() {
        RequestUtil.GET("/users/test/get", {
            test: "123"
        })
        .then((res) => {
            this.setState({
                data: JSON.stringify(res)
            })
            
        })
        .catch((err) => {
            alert(err)
        })
    }

    handlePostClick() {
        RequestUtil.POST("/users/test/post", {
            test: "123",
        })
        .then((res) => {
            this.setState({
                data: JSON.stringify(res)
            })
            
        })
        .catch((err) => {
            alert(err)
        })
    }

    handlePutClick() {
        RequestUtil.PUT("/users/test/put", {
            test: 123
        })
        .then((res) => {
            this.setState({
                data: JSON.stringify(res)
            })
            
        })
        .catch((err) => {
            alert(err)
        })
    }

    handleDeleteClick() {
        RequestUtil.DELETE("/users/test/delete", {
            test: 123
        })
        .then((res) => {
            this.setState({
                data: JSON.stringify(res)
            })
            
        })
        .catch((err) => {
            alert(err)
        })
    }

    render() {
        const data = this.state.data
        return (
            <div>
                <button onClick={this.handleGetClick}>Get请求</button>
                <button onClick={this.handlePostClick}>Post请求</button>
                <button onClick={this.handlePutClick}>Put请求</button>
                <button onClick={this.handleDeleteClick}>Delete请求</button>
                <h5>{data}</h5>
            </div>
        )
    }
}

export default CheckAuth