<template>
    <Header/>
    <Content/>
    <router-view></router-view>
</template>

<script setup>
     import Header from '@/components/HeaderComponent.vue'
     import SideBar from '@/components/SideBarComponent.vue'
</script>

<style>
  .main{
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
</style>
