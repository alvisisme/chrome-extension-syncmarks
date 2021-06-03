<template>
  <button class="v-button" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'VButton',
  props: {
    msg: String
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="less" scoped>
.v-button {
  color: red;
  padding: 6px 24px;
}
</style>
