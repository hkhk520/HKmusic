<template>
  <div @click="$emit('toggle-show-lyric')" class="play-full-chart">

    <!-- 可视化唱片图片界面 start -->
    <div class="music-chart">
      <div class="gan-box">
        <img src="../assets/images/musicgan.png" class="chart-gan" :class="{stop: !pause}" />
      </div>
      <div class="circle-chart" :class="{stop: !pause}">
        <img :src="currentSong.picUrl || currentSong.al.picUrl" />
      </div>
    </div>
    <!-- 可视化唱片图片界面 end -->

    <!-- 底部功能栏 start -->
    <ul class="music-function">
      <li><img :src="likeIcon" @click.stop="userIsLike"/></li>
      <li><img src="../assets/images/download.png" /></li>
      <li><img src="../assets/images/sing.png" /></li>
      <li><img src="../assets/images/message.png" /></li>
      <li><img src="../assets/images/more.png" /></li>

    </ul>
    <!-- 底部功能栏 end -->

  </div>
</template>

<script>
export default {
  name: "PlayFullChart",

  props: ["currentSong","pause"],

  data() {
    return {
      // 控制是否喜欢
      isLike: false,
    };
  },

  computed: {
    likeIcon(){
      return this.isLike ? require('../assets/images/islike.png') : require('../assets/images/like.png')
    }
  },

  methods: {
    userIsLike(){
      this.isLike = !this.isLike;
    }
  },
};
</script>

<style lang="less" scoped>
.play-full-chart {
  width: 100vw;
  height: 74vh;
  margin-top: 4px;

  .music-chart{
    width: 100%;
    height: 92%;
    // background-color: rgba(255, 0, 0, .3);
    padding-top: 76px;
    box-sizing: border-box;
    position: relative;

    .gan-box{
      position: absolute;
      left: 46%;
      top: 10px;

      .chart-gan{
        width: 90px;
        height: 128px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 8;
        transition: 1s;
        transform-origin: left top;
        position: relative;

        &.stop{
          transform: rotate(-30deg);
          transform-origin: left top;
        }
      }

      // &::before{
      //   content: "";
      //   width: 20px;
      //   height: 20px;
      //   position: absolute;
      //   left: 3px;
      //   top: -17px;
      //   background-color: #fff;
      //   border-radius: 50%;
      //   box-shadow: 0 0 4px 2px #000;
      //   z-index: 8;
      // }
    }


    .circle-chart{
      width: 250px;
      height: 250px;
      margin: 0 auto;
      border-radius: 50%;
      background: url('../assets/images/musicchart.png') no-repeat center;
      background-size: 250px;
      display: flex;
      justify-content: center;
      align-items: center;

      animation: chartRotate 20s linear infinite;

      img{
        width: 66%;
        height: 66%;
        border-radius: 50%;
      }

      &.stop{
        animation-play-state: paused;
      }

      @keyframes chartRotate {
        from{
          transform: rotate(0);
        }
        to{
          transform: rotate(360deg);
        }
      }
    }
  }

  .music-function {
    width: 72%;
    margin: 10px auto 0;
    display: flex;
    justify-content: space-between;
    li {
      img {
        width: 22px;
        height: 22px;
        vertical-align: bottom;
      }
    }
  }
}
</style>