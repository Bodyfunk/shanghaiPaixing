<template>
  <div class="app-container">
    <div>{{ wsUrl }}</div>
    <!-- 硬件状态信息区 表格加图表 -->
    <div>
      <h3>硬件状态信息区</h3>
      <a-row type="flex" justify="space-around" align="middle">
        <a-card title="硬盘" style="width: 30%">
          <p>总剩余：</p>
          <p>总容量：</p>
          <p>总空闲：</p>
        </a-card>
        <a-card title="内存" style="width: 30%">
          <p>card content</p>
          <p>card content</p>
          <p>card content</p>
        </a-card>
        <a-card title="cpu" style="width: 30%">
          <p>card content</p>
          <p>card content</p>
          <p>card content</p>
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
        <a-tab-pane key="1" tab="Tab 1">Content of Tab Pane 1</a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" force-render
          >Content of Tab Pane 2</a-tab-pane
        >
        <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup name="Monitor">
import { getWebsocket } from "@/api/service";
import { ref } from "vue";
import WSUtils from "@/utils/ws.ts";

// 进程假数据
const dataSource = [
  {
    key: "1",
    reboots: "胡彦斌",
    boot: 32,
    mem: "西湖区湖底公园1号",
  },
  {
    key: "1",
    reboots: "胡彦斌",
    boot: 32,
    mem: "西湖区湖底公园1号",
  },
  {
    key: "1",
    reboots: "胡彦斌",
    boot: 32,
    mem: "西湖区湖底公园1号",
  },
];

const columns = [
  {
    title: "重启次数",
    dataIndex: "reboots",
    key: "reboots",
  },
  {
    title: "上次启动时间",
    dataIndex: "boot",
    key: "boot",
  },
  {
    title: "当前内存占用大小",
    dataIndex: "mem",
    key: "mem",
  },
];

const activeKey = ref("1");

// 获取wss地址
const wsUrl = ref("");
function socketAddr() {
  getWebsocket()
    .then((res) => {
      wsUrl.value = "wss://" + window.location.host + res.data.url;
      // wsUrl.value = 'wss://172.22.225.24:9888' + res.data.url
      WSUtils.init(wsUrl.value);
    })
    .then(() => {
      console.log("  服务器Echo原始信息");
      WSUtils.ws.send("服务器Echo原始信息");
    });
}
socketAddr();
</script>

<style>
.app-container {
  overflow: hidden;
}
</style>