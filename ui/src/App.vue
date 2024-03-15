<template>
  <el-config-provider>
    <left-menu />

  </el-config-provider>
</template>

<script>
import LeftMenu from "./override/components/LeftMenu.vue";

export default {
  components: {
    LeftMenu
  },
}
</script>

<style lang="scss">
@use "styles/vendor";
@use "styles/app";
</style>
