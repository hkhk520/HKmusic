<template>
  <div class="play-full-footer">
    <!-- 歌曲播放时间与进度条 start -->
    <div class="time-schedule">
      <div class="time">{{ currentTime | formatTime }}</div>
      <div class="progress-box">
        <input
          type="range"
          min="0"
          :max="durationTime"
          step="1"
          @input="getValue"
          :value="currentTime"
          @touchstart="touchstart"
          @touchend="touchend"
        />
        <div
          class="progress"
          :style="{ width: (currentTime / durationTime) * 100 + '%' }"
        ></div>
        <div
          class="slider"
          :style="{ left: (currentTime / durationTime) * 100 + '%' }"
          :class="{ touching: isTouched }"
          ref="slider"
        ></div>
      </div>
      <div class="time" style="color: #ccc">
        {{ durationTime | formatTime }}
      </div>
    </div>
    <!-- 歌曲播放时间与进度条 end -->

    <!-- 下面的播放功能盒子 start -->
    <div class="play-funtion">
      <!-- 播放模式 -->
      <div class="play-mode">
        <img :src="playModeIcon.iconf" @click="$emit('update:currentIcon')" />
      </div>

      <!-- 中间的播放功能 -->
      <div class="play-next-prev-box">
        <div class="prev">
          <img src="../assets/images/prev.png" @click="$emit('play-prev')" />
        </div>
        <div class="play-status">
          <!-- 当图片路径转不过来时，需要加上require('图片路径')来进行转换 -->
          <img
            :src="
              pause
                ? require('../assets/images/pausefff.png')
                : require('../assets/images/playfff.png')
            "
            @click="$emit('toggle-play')"
          />
        </div>
        <div class="next">
          <img src="../assets/images/next.png" @click="$emit('play-next')" />
        </div>
      </div>

      <!-- 播放列表菜单 -->
      <div class="play-list-menu">
        <img
          src="../assets/images/playlistfff.png"
          @click="showPlayList = !showPlayList"
        />

        <!-- 使用播放列表模态框的组件 -->
        <MenuModel
          :showPlayList="showPlayList"
          @update:showPlayList="showPlayList = !showPlayList"
          :currentSong="currentSong"
          :songArr="songArr"
          :isEnded="isEnded"
          @transmit-song-arr="$emit('transmit-song-arr', $event)"
          :isPrev="isPrev"
          @transmit-song-arr-prev="$emit('transmit-song-arr-prev', $event)"
          @update:currentSong="$emit('update:currentSong', $event)"
          @del-song="$emit('del-song', $event)"
          :playModeIcon="playModeIcon"
          @update:currentIcon="$emit('update:currentIcon')"
        ></MenuModel>
      </div>
    </div>
    <!-- 下面的播放功能盒子 end -->
  </div>
</template>

<script>
import MenuModel from "../components/MenuModel.vue";
export default {
  props: [
    "currentTime",
    "durationTime",
    "currentSong",
    "songArr",
    "isEnded",
    "pause",
    "isPrev",
    "playModeIcon"
  ],
  data() {
    return {
      // 控制是否给滑块slider 加上个类名
      isTouched: false,
      // 控制是否显示播放列表菜单模态框
      showPlayList: false,
    };
  },

  filters: {
    // 格式化时间
    formatTime(oldValue) {
      let minutes = Math.floor(oldValue / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let seconds = Math.floor(oldValue % 60);
      seconds = seconds < 10 ? "0" + seconds : seconds;

      return minutes + ":" + seconds;
    },
  },

  components: {
    MenuModel,
  },

  methods: {
    getValue: function (e) {
      this.$emit("update:currentTime", e.target.value);
    },

    // 触摸滑块时改变滑块的样式
    touchstart() {
      this.isTouched = true;
    },
    touchend() {
      this.isTouched = false;
    },

  },
};
</script>

<style lang="less">
.play-full-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  height: 94px;

  .time-schedule {
    display: flex;
    justify-content: space-between;

    .time {
      font-style: 12px;
      transform: scale(0.6);
      height: 16px;
      width: 42px;
      text-align: center;
      color: #fff;
    }

    .progress-box {
      width: 80%;
      height: 2px;
      background-color: rgb(214, 207, 207);
      position: relative;
      margin: 8px auto;
      border-radius: 100px;

      input[type="range"] {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 8;
        opacity: 0;
      }

      .progress {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background-color: rgb(209, 73, 73);
        border-radius: 100px;
      }

      .slider {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        position: absolute;
        top: -2px;
        background-color: rgb(230, 22, 22);

        &.touching {
          border-radius: 50%;
          position: absolute;
          background-color: rgb(230, 22, 22);
          width: 10px;
          height: 10px;
          top: -4px;
          box-shadow: 0 0 1px 1px rgb(230, 22, 22);
        }
      }
    }
  }

  .play-funtion {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px 20px;
    box-sizing: border-box;

    img {
      width: 22px;
      height: 22px;
      vertical-align: bottom;
    }

    .play-next-prev-box {
      flex: 1;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      padding: 0 10px;

      .play-status {
        img {
          width: 40px;
          height: 40px;
          vertical-align: bottom;
        }
      }
    }
  }
}
</style>