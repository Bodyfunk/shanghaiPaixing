<template>
  <!-- 注册 -->
  <div class="home">
    <a-form :model="registerFormState" name="register" :labelCol="labelCol" :rules="rules" @finish="handleRegister">
      <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
        <a-input has-feedback v-model:value="registerFormState.username" />
      </a-form-item>

      <a-form-item has-feedback label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
        <a-input-password v-model:value="registerFormState.password" />
      </a-form-item>

      <a-form-item has-feedback label="retype" name="retype">
        <a-input-password v-model:value="registerFormState.retype" />
      </a-form-item>

      <a-form-item>
        <a-button :block="true" type="primary" html-type="submit" class="login-form-button">
          注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { register } from '../api/login.js'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 14 }
//注册相关
const registerFormState = reactive({
  username: '',
  password: '',
  retype: '',
})
const visibleRegister = ref(false)
const loading = ref(false)

function handleRegister() {
  let data = {
    usrname: registerFormState.username,
    password: registerFormState.password,
    retype: registerFormState.retype,
  }
  register(data).then((res) => {
    message.success(res.msg)
    router.push('/login')
  })
}
function handleCancelRegister() {}

// 校验规则
let validatePass2 = async (_rule, value) => {
  console.log(value)
  if (value === '') {
    return Promise.reject('Please input the password again')
  } else if (value !== registerFormState.password) {
    return Promise.reject("Two inputs don't match!")
  } else {
    console.log('通过')
    return Promise.resolve()
  }
}

const rules = {
  retype: [{ required: true, validator: validatePass2, trigger: 'change' }],
}
</script>

<style>
.home {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>