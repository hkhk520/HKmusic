<template>
  <div class="recommend" @touchstart="touchstart" @touchmove="touchmove" @touchend.stop="touchend">
    <!-- 轮播图组件 -->
    <div class="banner-box">
      <van-swipe
        :autoplay="4000"
        indicator-color="white"
        class="recommend-swipe"
        :stop-propagation="true"
      >
        <van-swipe-item
          ><img src="../assets/images/swipe1.jpg"
        /></van-swipe-item>
        <van-swipe-item
          ><img src="../assets/images/swipe2.jpg"
        /></van-swipe-item>
        <van-swipe-item
          ><img src="../assets/images/swipe3.jpg"
        /></van-swipe-item>
        <van-swipe-item
          ><img src="../assets/images/swipe4.jpg"
        /></van-swipe-item>
      </van-swipe>
    </div>

    <!-- 推荐歌单的组件 -->
    <RecommendPlayList @update:isShowMainNav="$emit('update:isShowMainNav')"></RecommendPlayList>

    <!-- 最新音乐的组件 -->
    <NewSongList
      @get-song="$emit('get-song', $event)"
      :pause="pause"
      :currentSong="currentSong"
    ></NewSongList>

    <!-- logo组件 -->
    <!-- <RecommendLogo></RecommendLogo> -->
  </div>
</template>

<script>
import RecommendPlayList from "../components/RecommendPlayList.vue";
import NewSongList from "../components/NewSongList.vue";
// import RecommendLogo from "../components/RecommendLogo.vue";

export default {
  name: "Recommend",
  props: ["pause", "currentSong"],
  data() {
    return {
      // 触摸的起始点
      startX: null,
      startY: null,
      // 触摸移动的X、Y距离
      moveX: null,
      moveY: null,
    };
  },
  components: {
    RecommendPlayList,
    NewSongList,
    // RecommendLogo,
    // vanSwipe
  },

  created() {},

  activated() {
    // 把触摸移动的X、Y距离置空
    this.moveX = null;
    this.moveY = null;
  },

  methods: {
    touchstart(event){
      // 触摸的起始点
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },
    touchmove(event){
      // 触摸移动的X、Y距离
      this.moveX = event.touches[0].clientX - this.startX;
      this.moveY = event.touches[0].clientY - this.startY;
    },
    touchend(){
      // 左滑
      if(Math.abs(this.moveX) > Math.abs(this.moveY) && this.moveX < 0){
        this.goHot();
      }
    },
    // 左滑去到热歌榜页面
    goHot(){
      this.$router.push({name: "Hot"});
      this.$emit("update:currentIndex",1);
    }
  },
};
</script>

<style lang="less" scoped>
.recommend {
  background-color: #fcfcfd;
  margin: 1.5px 0 54px;

  .banner-box{
    .recommend-swipe {
      margin: 10px;
      overflow: hidden;
      border-radius: 16px;
      img {
        border-radius: 16px;
        width: 100%; 
        box-shadow: 0 0 1px 1px rgb(209, 204, 204);
      }
    }

  }

}
</style>