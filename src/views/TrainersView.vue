<template>
    <div class="admin-layout">
      <Header />
  
      <div class="main-content">
        <SideBar />
        <Trainers class="content"/>
      </div>
    </div>
  </template>
  
  <script setup>
  import Header from '@/components/HeaderComponent.vue';
  import SideBar from '@/components/SideBarComponent.vue';
  import Trainers from '@/components/TrainersComponent.vue';
  </script>
  
  <style scoped>
  .admin-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .main-content {
    display: flex;
    flex: 1;
  }
  
  .contain{
    padding:1%;
    width:100%;
    height:100%;
    background-color:#F1F5F9;
  }
  
  .sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
  }
  
  .content {
    flex: 1;
    padding: 20px;
    background-color: #f5f5f5;
  }
  </style>