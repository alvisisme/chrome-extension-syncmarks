<template>
  <button class="v-button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'VButton',
  props: {
    msg: String
  }
}
</script>

<style lang="less" scoped>
.v-button {
  color: red;
  padding: 6px 24px;
}
</style>
