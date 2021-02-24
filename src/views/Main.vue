<template>
  <div class="main">
    <!-- 导航栏组件 全局的 -->
    <MainNav
      :currentIndex="currentIndex"
      @update:currentIndex="currentIndex = $event"
      v-show="isShowMainNav"
    ></MainNav>

    <!-- 加上keep-alive就会在第一次created之后就不会销毁组件，从而在以后的切换组件时的created等生命周期函数就无效了 -->
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__fadeIn"
    >
      <keep-alive>
        <router-view
          @get-song="getSong"
          :pause="pause"
          :currentSong="currentSong"
          style="padding-top: 40px"
          @update:currentIndex="currentIndex = $event"
          @update:isShowMainNav="isShowMainNav = !isShowMainNav"
        ></router-view>
      </keep-alive>
    </transition>

    <!-- 歌曲播放进度条组件 全局的 -->
    <Play
      :currentSong="currentSong"
      :pause="pause"
      @change-pause="changePause"
      @update:currentSong="currentSong = $event"
    ></Play>
  </div>
</template>

<script>
import MainNav from "../components/MainNav.vue";
import Play from "../components/Play.vue";

export default {
  name: "Main",
  data() {
    return {
      currentSong: {},
      // 控制播放或者暂停
      pause: false,
      // 当前导航栏路由的下标
      currentIndex: 0,
      isShowMainNav: true,
    };
  },
  components: {
    MainNav,
    Play,
  },

  methods: {
    getSong(song) {
      this.pause = true;
      this.currentSong = song;
    },

    changePause() {
      this.pause = !this.pause;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  color: #333;
}
</style>