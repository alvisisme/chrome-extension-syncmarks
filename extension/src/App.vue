<template>
  <div id="app">
    <loading class="loading"></loading>
  </div>
</template>

<script>
import Loading from '@/components/loading.vue'
export default {
  name: 'App',
  components: {
    Loading
  }
}
</script>

<style lang="less" scoped>
.loading {
  height: 24px;
}
</style>

<style lang="less">
html,body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 300px;
}
</style>
