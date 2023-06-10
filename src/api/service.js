import request from '../utils/request'
// 注册方法
export function getWebsocket() {
    return request({
        url: '/service',
        method: 'post'
    })
}