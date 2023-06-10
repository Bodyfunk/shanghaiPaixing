import request from '../utils/request'

// 登录方法
export function login(data) {
    return request({
        url: '/user/sign_in',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

// 注册方法
export function register(data) {
    return request({
        url: '/user/sign_up',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

// 登出方法
export function signOut() {
    return request({
        url: '/user/sign_out',
        method: 'post'
    })
}