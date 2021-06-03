<template>
  <div id="app">
    <v-row>
      <h1>配置页面</h1>
    </v-row>
    <v-row>
      配置项
    </v-row>

    <v-row>
      <v-col :span=12>
        <v-button>保存</v-button>
      </v-col>
      <v-col :span=12>
        <v-button>取消</v-button>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import vRow from '@/components/vrow.vue'
import vCol from '@/components/vcol.vue'
import vButton from '@/components/vbutton.vue'

export default {
  name: 'App',
  components: {
    vRow,
    vCol,
    vButton
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
}
</style>
