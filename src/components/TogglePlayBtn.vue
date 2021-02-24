<template>
  <div class="toggle-play-btn">
    <!-- currentSong.id == song.id 用来控制是否当前播放的歌曲 -->
    <span class="voice" v-if="currentSong.id == song.id">
      <!-- pause用来控制 暂停时，停止动画效果 -->
      <i class="first" :class="{stop: !pause}"></i>
      <i class="second" :class="{stop: !pause}"></i>
      <i class="three" :class="{stop: !pause}"></i>
      <i class="four" :class="{stop: !pause}"></i>
    </span>
    <div class="play-icon" v-else></div>
  </div>
</template>

<script>
export default {
  name: "TogglePlayBtn",
  props: {
    pause: Boolean,
    song: Object,
    currentSong: Object
  },
};
</script>

<style lang="less" scoped>
.toggle-play-btn {
  .voice {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 22px;
    height: 27px;
    padding: 0 10px;

    i {
      display: inline-block;
      border-left: 2px solid #dd001b;
      margin: 0 1px;

      // 暂停时，停止动画效果
      &.stop{
        animation-play-state: paused;
      }
    }

    .first {
      height: 8px;
      animation: first 0.4s linear 0s infinite alternate;
    }

    .second {
      height: 4px;
      animation: second 0.8s linear 0s infinite alternate;
    }

    .three {
      height: 6px;
      animation: three 0.6s linear 0s infinite alternate;
    }

    .four {
      height: 12px;
      animation: four 0.4s linear 0s infinite alternate;
    }

    @keyframes first {
      0% {
        height: 4px;
      }

      50% {
        height: 8px;
      }

      100% {
        height: 10px;
      }
    }

    @keyframes second {
      0% {
        height: 12px;
      }

      50% {
        height: 9px;
      }

      100% {
        height: 7px;
      }
    }

    @keyframes three {
      0% {
        height: 14px;
      }

      50% {
        height: 12px;
      }

      100% {
        height: 10px;
      }
    }

    @keyframes four {
      0% {
        height: 10px;
      }

      50% {
        height: 8px;
      }

      100% {
        height: 5px;
      }
    }
  }

  .play-icon {
    width: 24px;
    height: 36px;
    padding: 0 10px;
    background: url("../assets/images/icon.png") no-repeat;
    background-position: -12px 11px;
    background-size: 162px 97px;
  }
}
</style>