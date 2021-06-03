<template>
  <div class="v-row">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'VRow'
}
</script>

<style lang="less" scoped>
@import "~@/styles/mixins.less";

.v-row {
  position: relative;
  box-sizing: border-box;

  .utils-clearfix-mixin()
}
</style>
