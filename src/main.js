import { createApp } from 'vue'
import router from './router'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import './style.css'


import echarts from './utils/echarts.js'

import App from './App.vue'



let app = createApp(App).use(Antd).use(router).mount('#app')
app.config.globalProperties.$echarts = echarts;