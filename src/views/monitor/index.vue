<template>
  <div class="app-container">
    <!-- 硬件状态信息区 表格加图表 -->
    <div>
      <div class="header-line">
        <h3>硬件状态信息区</h3>
        <h6>切换视图</h6>
        <a-switch v-model:checked="loading" :loading="checked" />
      </div>
      <a-row type="flex" justify="space-around" align="middle">
        <a-card v-for="item of machineArr" :key="item.value.endpt" :title="item.value.alias" style="width: 25%" class="activate">

          <h4>存储状态</h4>
          <PieChart v-if="!loading" :pieData="beautifyPie(item.value.machineDiskInfo)"></PieChart>
          <div v-else>
            <span v-for="(item, index) of item.value.machineDiskInfo" :key="index">
              <strong>{{ item.name + ": " }}</strong>
              <span>{{ item.value }}&nbsp</span>
            </span>
          </div>

          <h4>内存负载</h4>
          <PieChart v-if="!loading" :pieData="beautifyPie(item.value.machineMemInfo)"></PieChart>
          <div v-else>
            <span v-for="(item, index) of item.value.machineMemInfo" :key="index">
              <strong>{{ item.name + ": " }}</strong>
              <span>{{ item.value }}&nbsp</span>
            </span>
          </div>

          <h4>计算负载</h4>
          <span v-for="(item, index) of item.value.machineCPUInfo" :key="index">
            <strong>{{ item.name + ": " }}</strong>
            <span>{{ item.value }}&nbsp</span>
          </span>
          <a-button type="primary" @click="showInfo(item.value.machineCourseInfo)">查看进程</a-button>
        </a-card>
      </a-row>
    </div>
    <!-- 进程状态信息区 -->
    <div>
      <h3>进程状态信息区</h3>
      <a-table :dataSource="dataSource" :columns="columns" size="small" />
    </div>

    <!-- 服务区 -->
    <div>
      <h3>服务区</h3>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="(item) of serviceArr" :key="item.value.endpt" :tab="item.value.alias">
          <a-descriptions :title="item.value.host" :column="4">
            <a-descriptions-item v-for="el of item.value.params" :key="el.name" :label="el.alias">{{ Object.values(el.Value)[0] }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup name="Monitor">
import { PieChart } from '@/components/page-charts/index'
import { getWebsocket } from '@/api/service'
import { nextTick, ref, toRaw } from 'vue'
import WSUtils from '@/utils/ws.ts'

// 为echarts做准备时间
const checked = ref(true)
setTimeout(() => (checked.value = false), 1000)

// 服务器的数据处理

// 通过name匹配对象数组中符合的对象
function getDataByName(objects, key) {
  const foundObject = objects.find((obj) => obj.name === key)
  return foundObject
}

// 格式化value，将value对象中的str属性，格式化成对象，例如value：{str:"availiable(243GB), capacity(255GB), load(4%)"}
// 结果[{name:"available",value:"243GB"},{name:"capacity",value:"255GB"},{name:"load",value:"4%"}]`
function formatValue(value) {
  const regex = /([^\s(]+)\(([^)]+)\)/g
  const matches = value.Str.matchAll(regex)
  const result = []
  for (const match of matches) {
    result.push({ name: match[1], value: match[2] })
  }
  return result
}

// 格式化
function formatValue2(data) {
  //   const data = [
  //   { value: { str: "availiable(243GB), capacity(255GB), load(4%)" }, alias: "数据库3#", name: "数据库3#" },
  //   { value: { str: "availiable(100GB), capacity(200GB), load(50%)" }, alias: "服务器1#", name: "服务器1#" }
  // ];

  const regex = /(\w+)\(([^)]+)\)/g

  const formattedData = data.map((item) => {
    const { Str } = item.Value
    const props = {}
    let match

    while ((match = regex.exec(Str))) {
      const [, key, value] = match
      props[key.toLowerCase()] = value
    }

    return {
      ...props,
      alias: item.alias,
      name: item.name,
    }
  })

  return formattedData
}

// 去除数组后面的几个元素
function removeLastElements(arr, numToRemove) {
  return arr.slice(0, arr.length - numToRemove)
}

// 格式化3
function formatValue3(input) {
  // const input = [{ name: 'Search Engine', value: '12GB' }];

  const output = input.map((obj) => {
    return {
      ...obj,
      value: obj.value.replace(/[^\d]/g, ''),
    }
  })
  return output // [{ name: 'Search Engine', value: '12' }]
}

// 美化饼状图
function beautifyPie(arr) {
  let availiable, all
  let temp = formatValue3(arr)
  temp.forEach((element) => {
    if (element.name === 'availiable') {
      availiable = element.value
    }
    if (element.name === 'capaticy') {
      all = element.value
    }
  })
  return [
    { name: '总量', value: all },
    { name: '余量', value: availiable },
  ]
}

// 进程列数据
const columns = [
  {
    title: '进程名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '重启次数',
    dataIndex: 'reboots',
    key: 'reboots',
  },
  {
    title: '上次启动时间',
    dataIndex: 'boot',
    key: 'boot',
  },
  {
    title: '当前内存占用大小',
    dataIndex: 'mem',
    key: 'mem',
  },
]

// 进程行数据
const dataSource = ref([])
function showInfo(data) {
  dataSource.value = data
}

const activeKey = ref('service-dbsv_chn')

// 获取wss地址
const wsUrl = ref('')
function socketAddr() {
  getWebsocket()
    .then((res) => {
      wsUrl.value = 'wss://' + window.location.host + res.data.url
      // wsUrl.value = 'wss://172.22.225.24:9888' + res.data.url
      WSUtils.init(wsUrl.value)
    })
    .then(() => {
      WSUtils.ws.send('服务器Echo原始信息')
    })
}
socketAddr()

// 时间紧任务重，这里写的比较冗余，日后可以好好思考如何抽象剥离出来
// 八个硬件服务器
const loading = ref(true)
const machineBis = ref({})
WSUtils.CEvent.on('machine-bis', (data) => {
  machineBis.value = JSON.parse(data)
  machineBis.value['machineMemInfo'] = formatValue(
    getDataByName(machineBis.value.params, 'mem').Value
  )
  machineBis.value['machineDiskInfo'] = formatValue(
    getDataByName(machineBis.value.params, 'disk').Value
  )
  machineBis.value['machineCPUInfo'] = formatValue(
    getDataByName(machineBis.value.params, 'cpu').Value
  )
  machineBis.value['machineCourseInfo'] = formatValue2(
    removeLastElements(machineBis.value.params, 4)
  )
})

const machineRdata = ref({})
WSUtils.CEvent.on('machine-rdata', (data) => {
  machineRdata.value = JSON.parse(data)
  machineRdata.value['machineMemInfo'] = formatValue(
    getDataByName(machineRdata.value.params, 'mem').Value
  )
  machineRdata.value['machineDiskInfo'] = formatValue(
    getDataByName(machineRdata.value.params, 'disk').Value
  )
  machineRdata.value['machineCPUInfo'] = formatValue(
    getDataByName(machineRdata.value.params, 'cpu').Value
  )
  machineBis.value['machineCourseInfo'] = formatValue2(
    removeLastElements(machineBis.value.params, 4)
  )
})

const machinePars = ref({})
WSUtils.CEvent.on('machine-pars', (data) => {
  machinePars.value = JSON.parse(data)
  machinePars.value['machineMemInfo'] = formatValue(
    getDataByName(machinePars.value.params, 'mem').Value
  )
  machinePars.value['machineDiskInfo'] = formatValue(
    getDataByName(machinePars.value.params, 'disk').Value
  )
  machinePars.value['machineCPUInfo'] = formatValue(
    getDataByName(machinePars.value.params, 'cpu').Value
  )
  machineRdata.value['machineCourseInfo'] = formatValue2(
    removeLastElements(machineRdata.value.params, 4)
  )
})

const machinedbsv1 = ref({})
WSUtils.CEvent.on('machine-dbsv1', (data) => {
  machinedbsv1.value = JSON.parse(data)
  machinedbsv1.value['machineMemInfo'] = formatValue(
    getDataByName(machinedbsv1.value.params, 'mem').Value
  )
  machinedbsv1.value['machineDiskInfo'] = formatValue(
    getDataByName(machinedbsv1.value.params, 'disk').Value
  )
  machinedbsv1.value['machineCPUInfo'] = formatValue(
    getDataByName(machinedbsv1.value.params, 'cpu').Value
  )
  machinedbsv1.value['machineCourseInfo'] = formatValue2(
    removeLastElements(machinedbsv1.value.params, 4)
  )
})

const machinedbsv2 = ref({})
WSUtils.CEvent.on('machine-dbsv2', (data) => {
  machinedbsv2.value = JSON.parse(data)
  machinedbsv2.value['machineMemInfo'] = formatValue(
    getDataByName(machinedbsv2.value.params, 'mem').Value
  )
  machinedbsv2.value['machineDiskInfo'] = formatValue(
    getDataByName(machinedbsv2.value.params, 'disk').Value
  )
  machinedbsv2.value['machineCPUInfo'] = formatValue(
    getDataByName(machinedbsv2.value.params, 'cpu').Value
  )
  machinedbsv2.value['machineCourseInfo'] = formatValue2(
    removeLastElements(machinedbsv2.value.params, 4)
  )
})

const machinerfile = ref({})
WSUtils.CEvent.on('machine-rfile', (data) => {
  machinerfile.value = JSON.parse(data)
  machinerfile.value['machineMemInfo'] = formatValue(
    getDataByName(machinerfile.value.params, 'mem').Value
  )
  machinerfile.value['machineDiskInfo'] = formatValue(
    getDataByName(machinerfile.value.params, 'disk').Value
  )
  machinerfile.value['machineCPUInfo'] = formatValue(
    getDataByName(machinerfile.value.params, 'cpu').Value
  )
  machinerfile.value['machineCourseInfo'] = formatValue2(
    removeLastElements(machinerfile.value.params, 4)
  )
})

const machinedbsv3 = ref({})
WSUtils.CEvent.on('machine-dbsv3', (data) => {
  machinedbsv3.value = JSON.parse(data)
  machinedbsv3.value['machineMemInfo'] = formatValue(
    getDataByName(machinedbsv3.value.params, 'mem').Value
  )
  machinedbsv3.value['machineDiskInfo'] = formatValue(
    getDataByName(machinedbsv3.value.params, 'disk').Value
  )
  machinedbsv3.value['machineCPUInfo'] = formatValue(
    getDataByName(machinedbsv3.value.params, 'cpu').Value
  )
  machinedbsv3.value['machineCourseInfo'] = formatValue2(
    removeLastElements(machinedbsv3.value.params, 4)
  )
})

const machinedaemon = ref({})
WSUtils.CEvent.on('machine-daemon', (data) => {
  machinedaemon.value = JSON.parse(data)
  machinedaemon.value['machineMemInfo'] = formatValue(
    getDataByName(machinedaemon.value.params, 'memory').Value
  )
  machinedaemon.value['machineDiskInfo'] = formatValue(
    getDataByName(machinedaemon.value.params, 'disk').Value
  )
  machinedaemon.value['machineCPUInfo'] = formatValue(
    getDataByName(machinedaemon.value.params, 'cpu').Value
  )
  machinedaemon.value['machineCourseInfo'] = formatValue2(
    removeLastElements(machinedaemon.value.params, 4)
  )
})

const machineArr = ref([])

machineArr.value = [
  machineBis,
  machineRdata,
  machinePars,
  machinedbsv1,
  machinedbsv2,
  machinerfile,
  machinedbsv3,
  machinedaemon,
]

// 5个服务
const servicedbsv_chn = ref({})
WSUtils.CEvent.on('service-dbsv_chn', (data) => {
  servicedbsv_chn.value = JSON.parse(data)
})

const servicerevc_revc = ref({})
WSUtils.CEvent.on('service-recv_recv', (data) => {
  servicerevc_revc.value = JSON.parse(data)
})

const servicerevc_data = ref({})
WSUtils.CEvent.on('service-recv_data', (data) => {
  servicerevc_data.value = JSON.parse(data)
})

const servicepars_chn1 = ref({})
WSUtils.CEvent.on('service-pars_chn1', (data) => {
  servicepars_chn1.value = JSON.parse(data)
})

const servicedata_dv4 = ref({})
WSUtils.CEvent.on('service-data_dv4', (data) => {
  servicedata_dv4.value = JSON.parse(data)
})

const serviceArr = ref([])

serviceArr.value = [
  servicedbsv_chn,
  servicerevc_revc,
  servicerevc_data,
  servicepars_chn1,
  servicedata_dv4,
]
</script>

<style>
.app-container {
  overflow: hidden;
}

.activate:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.header-line {
  display: flex;
  align-items: center;
}
</style>