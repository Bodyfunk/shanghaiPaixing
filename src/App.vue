<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TopNav from './components/TopNav.vue'
</script>

<template>
  <TopNav></TopNav>
  <router-view></router-view>
</template>

<style scoped>
.top {
  background-color: gray;
  height: 10%;
}
</style>
