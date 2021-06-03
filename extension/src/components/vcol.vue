<template>
  <div class="v-col" :class="classes">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'vCol',
  props: {
    span: {
      type: Number,
      default: 24
    }
  },
  data () {
    return {
      classes: {
      }
    }
  },
  computed: {

  },
  methods: {
  },
  created () {
    this.classes[`v-col-${this.span}`] = true
  }
}
</script>

<style lang="less" scoped>
[class*="v-col-"] {
  float: left;
  box-sizing: border-box;
}

.v-col-0 {
  display: none;
}

// 栅格类函数循环
.v-col-loop(@n, @i: 0) when (@i <= @n) {
  .v-col-@{i} {
    width: (1 / @n * @i * 100) * 1%;
  }

  .v-col-offset-@{i} {
    margin-left: (1 / @n * @i * 100) * 1%;
  }

  .v-col-pull-@{i} {
    position: relative;
    right: (1 / @n * @i * 100) * 1%;
  }

  .v-col-push-@{i} {
    position: relative;
    left: (1 / @n * @i * 100) * 1%;
  }

  .v-col-loop(@n, (@i + 1));
}

.v-col-loop(24);
</style>
