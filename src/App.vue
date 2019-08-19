<template>
  <div id="app">
    <MainContainer></MainContainer>
  </div>
</template>
<script>
import MainContainer from './components/main-container.vue'; 

export default {
  name: 'app',
  components: {
      MainContainer
  }
}
</script>

<style>
@import './assets/style/reset.css';
@import './assets/style/skystyle.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.el-scrollbar__wrap{
  overflow-x:hidden!important;
  }
</style>
