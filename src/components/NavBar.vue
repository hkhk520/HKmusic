<template>
  <div class="nav-bar">
    <div class="nav">
      <span><slot></slot></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style lang="less" scoped>
.nav {
  font-size: 17px;
  margin-bottom: 14px;

  span {
    border-left: 3px solid #dd001b;
    padding-left: 9px;
  }
}
</style>