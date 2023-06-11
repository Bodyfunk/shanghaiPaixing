<template>
  <TopNav></TopNav>
  <router-view :key="router.currentRoute.value.fullPath"></router-view>
</template>

<script setup>
import { useRouter } from 'vue-router'
import TopNav from '../components/TopNav.vue'
const router = useRouter()
</script>

<style lang="scss" scoped>
</style>