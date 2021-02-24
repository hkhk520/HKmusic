<template>
  <div class="mainnav">
    <ul class="nav">
      <li
        v-for="(item, index) in navDatas"
        :key="index"
        @click="toggerNav(index, item.name)"
      >
        <span :class="{ active: currentIndex == index }">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MainNav",

  props: ["currentIndex"],

  data() {
    return {
      navDatas: [
        { title: "推荐音乐", name: "Recommend" },
        { title: "热歌榜", name: "Hot" },
        { title: "搜索", name: "Search" },
      ],
    };
  },

  created() {
    let routeName = this.$route.name;
    for (let i in this.navDatas) {
      if (routeName == this.navDatas[i].name) {
        this.$emit("update:currentIndex",i);
        return;
      }
    }
  },

  methods: {
    toggerNav(index, name) {
      // 当点击了同一个路由，拦截，不然跳转
      if (this.currentIndex == index) {
        console.log("拦截");
        return;
      }

      this.$emit("update:currentIndex",index);
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="less" scoped>
.mainnav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background: #fff;
  z-index: 8;
  
  .nav {
    display: flex;
    justify-content: space-around;
    box-shadow: 0 0 1px 1px #eee;
    text-align: center;

    li {
      flex: 1;
      height: 40px;
      line-height: 40px;
      font-size: 15px;
      color: #333;

      span.active {
        height: 100%;
        border-bottom: 3px solid #dd001b;
        display: inline-block;
        padding: 0 6px;
        box-sizing: border-box;
        color: #dd001b;
      }
    }
  }
}
</style>