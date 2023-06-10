import { createApp } from 'vue'
import router from './router'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import './style.css'
import App from './App.vue'



createApp(App).use(Antd).use(router).mount('#app')
