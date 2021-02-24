<template>
  <div id="app">
    <!-- 加载框 -->
    <!-- <div class="loading" v-show="$root.isShowLoading">加载框</div> -->

    <router-view />

  </div>
</template>


<style lang="less">
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
// 设置好页面触控范围
.cont{ width: 100%; height: 100%; }

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  // 加载框的样式
  .loading{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.5);
    z-index: 10;
  }

}

:root {
  --animate-duration: 500ms;
}
</style>
