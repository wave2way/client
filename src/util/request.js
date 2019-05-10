import axios from "axios"
import { message } from 'antd';

axios.defaults.headers.common["content-type"] = "application/json"
axios.defaults.timeout = 1000 * 60

// 请求中间件
axios.interceptors.request.use(function (config) {
    // Do something with response data
    config.headers["authorization"] = localStorage.getItem('user_token')
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
        if (response.data && response.data.code === 0) {
            if (response.data && response.data.token) {
                localStorage.setItem('user_token', response.data.token);
            }
        } else if (response.data && response.data.code > 0) {
            message.error(response.data && response.data.message ? response.data.message : "Unknow err");
        }
        return response.data;
    }
        return response;
    }, function (error) {
        // Do something with response error
        return Promise.reject(error);
    }
);

// 请求工具
export default class RequestUtil {
    static GET(path , data) {
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