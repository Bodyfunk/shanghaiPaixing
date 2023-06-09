<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal">
    <a-menu-item key="home" @click="gotoHome">
      首页
    </a-menu-item>
    <a-menu-item key="monitor" @click="gotoMonitor">

      监控
    </a-menu-item>

  </a-menu>
</template>
<script setup>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const current = ref(['home'])

function gotoHome() {
  console.log('gotoHome')
  router.push('/home')
}

function gotoMonitor() {
  console.log('gotoMonitor')
  router.push('/monitor')
}
</script>

