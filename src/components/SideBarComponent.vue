<template>
    <div class="sidebar">
      <ul>
        <li><router-link :class="{ active: isActive('/home') }" to="/home">Dashboard</router-link></li>
        <li><router-link :class="{ active: isActive('/members') }" to="/members">Members</router-link></li>
        <li><router-link :class="{ active: isActive('/trainers') }" to="/trainers">Trainers</router-link></li>
      </ul>
    </div>
  </template>
  
  <script>
  import { useRoute } from "vue-router";

  export default {
      setup() {
        const route = useRoute();

        const isActive = (path) => route.path === path;

        return { isActive };
      },
    };

  </script>
  
  <style scoped>

  .sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
    padding: 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    text-decoration:none;
    color:white;
    margin-bottom: 10px;
    cursor: pointer;
  }
  
  li:hover {
    color: #42b983;
  }
  
  .active {
    font-weight: bold;
    color:  #42b983;
    text-decoration: underline;
  }

  a{
    text-decoration:none;
    color:white;
  }
  </style>