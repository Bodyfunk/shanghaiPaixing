<template>
  <!-- 登陆dialog -->
  <div class="home">
    <a-form :model="loginFormState" name="login" @finish="handleLogin">
      <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
        <a-input v-model:value="loginFormState.username" />
      </a-form-item>

      <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
        <a-input-password v-model:value="loginFormState.password" />
      </a-form-item>

      <a-form-item name="remember">
        <a-button type="link" @click="goRegister">没有账号？注册一个</a-button>
      </a-form-item>

      <a-form-item>
        <a-button :block="true" :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          登陆
        </a-button>
      </a-form-item>

    </a-form>

  </div>
</template>


<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/login.js'
import cache from '../utils/cache.js'
import { getToken } from '../utils/auth'

const router = useRouter()

const labelCol = { style: { width: '100px' } }
// 登陆相关
const loginFormState = reactive({
  username: '',
  password: '',
})
const disabled = computed(() => {
  return !(loginFormState.username && loginFormState.password)
})

const handleLogin = () => {
  let data = {
    usrname: loginFormState.username,
    password: loginFormState.password,
  }
  login(data).then((res) => {
    let sid = getToken()
    // 关键用户信息记载到session
    cache.session.set('sid', sid)
    cache.session.set('username', data.usrname)
    router.push('/home')
  })
}

function handleCancelLogin() {}

function goRegister() {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.home {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>