<template>
  <div id="app">
    <v-loading class="loading" v-if="loading"></v-loading>

    <v-row>
      <v-col :span=12>
        最近更新：
      </v-col>
      <v-col :span=12>
        {{updateTime}}
      </v-col>
    </v-row>

    <v-row>
      <v-col :span=12>
        <v-button>上传</v-button>
      </v-col>
      <v-col :span=12>
        <v-button>下载</v-button>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import vLoading from '@/components/vloading.vue'
import vRow from '@/components/vrow.vue'
import vCol from '@/components/vcol.vue'
import vButton from '@/components/vbutton.vue'

export default {
  name: 'App',
  components: {
    vLoading,
    vButton,
    vRow,
    vCol
  },
  data () {
    return {
      loading: false,
      updateTime: new Date()
    }
  }
}
</script>

<style lang="less" scoped>
.loading {
  height: 24px;
}

.row {
  position: relative;
  box-sizing: border-box;
}

.col {
  position: relative;
  box-sizing: border-box;
  float: left;
}

.col-12 {
  width: 100% * 12 * 1 / 24;
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
