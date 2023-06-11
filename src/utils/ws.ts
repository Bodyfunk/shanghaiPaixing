import { WebSocketBean } from 'tools-vue3'
import CEventBean from 'tools-vue3/src/CEventBean'
export default class WSUtil {
    static CEvent = new CEventBean()
    static ws: WebSocketBean
    static async init(wsUrl) {
        const sendSuffix = ''

        //初始化websokcet对象
        this.ws = new WebSocketBean({
            url: wsUrl,
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
                // console.log(typeof data.data)
                if (data.data.length > 10) {

                    let dataObj = JSON.parse(data.data)
                    // console.log(dataObj.endpt);

                    // const sp = data.data.split(sendSuffix).filter((el: string) => el.length > 0)
                    // console.log(sp)
                    this.CEvent.emit(dataObj.endpt, data.data)
                }
            }
        })
        //建立连接
        this.ws.start()
    }
}

