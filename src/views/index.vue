<template>
  <div class="app-container home" :key="sid + 1">
    <div class="hello">
      <h1>欢迎使用xxxx</h1>
      <div v-if="!sid">
        <div>您还未登陆，请先登陆！！！</div>
        <a-button type="primary" @click="showLogin">登陆</a-button>
      </div>
    </div>
  </div>
</template>

<script setup name="Home">
import { useRouter } from "vue-router";
import cache from "../utils/cache";

const router = useRouter();

let sid = cache.session.get("sid");

function showLogin() {
  router.push("/login");
}
</script>

<style scoped lang="scss">
.hello {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }
}

.login-form-button {
  width: 100%;
}
</style>

