<template>
  <a-row type="flex" justify="space-around" align="middle">
    <a-col :span="22">
      <a-menu v-model:selectedKeys="current" mode="horizontal">
        <a-menu-item key="/home" @click="gotoHome"> 首页 </a-menu-item>
        <a-menu-item key="/monitor" @click="gotoMonitor" v-if="sid">
          监控
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col :span="2" v-if="sid">
      <a-popover trigger="hover">
        <template #content>
          <a-button @click="() => (visible = true)">登出</a-button>
        </template>
        <a-avatar :size="32">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </a-popover>
    </a-col>
    <a-col :span="2" v-else>
      <p>未登陆</p>
    </a-col>
  </a-row>

  <!-- 确定登出 -->
  <a-modal v-model:visible="visible" title="登出提醒" @ok="handleSignOut">
    <p>确定登出吗？</p>
  </a-modal>
</template>
<script setup>
import { UserOutlined } from '@ant-design/icons-vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import cache from '../utils/cache'
import { signOut } from '../api/login'
import WSUtils from '@/utils/ws.ts'

let sid = cache.session.get('sid')

const router = useRouter()
const current = ref(['/home'])

watch(
  () => router.currentRoute.value.fullPath,
  (newValue) => {
    current.value = [newValue]
  },
  { immediate: true }
)

function gotoHome() {
  console.log('gotoHome')
  router.push('/home')
}

function gotoMonitor() {
  console.log('gotoMonitor')
  router.push('/monitor')
}

const visible = ref(false)
function handleSignOut() {
  signOut().then(() => {
    WSUtils.ws.dispose()
    cache.session.remove('sid')
    router.push('/login')
  })
}

if (!cache.session.get('sid')) {
  router.push('/home')
}
</script>

