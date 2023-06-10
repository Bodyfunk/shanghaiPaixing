import { WebSocketBean } from 'tools-vue3'
export default class WSUtil {
    static ws: WebSocketBean
    static async init(url) {
        const sendSuffix = ''

        //初始化websokcet对象
        this.ws = new WebSocketBean({
            url: url,
            needReconnect: true,
            reconnectGapTime: 3000,
            onerror: () => {
                console.log('断开')
            },
            sendSuffix,
            messageSuffix: sendSuffix,
            heartSend: '~',
            heartGet: '~',
            heartGapTime: 3000,
            onmessage: (data) => {
                //在这里写消息处理逻辑
                console.log(data.data)
                const sp = data.data.split(sendSuffix).filter((el: string) => el.length > 0)
                console.log(sp)
            }
        })
        //建立连接
        this.ws.start()
    }
}

