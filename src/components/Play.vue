<template>
  <div class="play" v-if="currentSong.id">
    <audio
      :src="
        'https://music.163.com/song/media/outer/url?id=' +
        currentSong.id +
        '.mp3'
      "
      autoplay
      @canplay="canPlay"
      @timeupdate="timeUpdate"
      @ended="ended"
      ref="audio"
    ></audio>
    <!-- 播放控制栏 start -->
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <div
        class="play-progress"
        v-show="isShowPlayBar"
        @click="isShowPlayBar = !isShowPlayBar"
      >
        <!-- 歌曲图片 start -->
        <div class="song-icon">
          <img
            :src="currentSong.picUrl || currentSong.al.picUrl"
            :class="{ stop: !pause }"
          />
        </div>
        <!-- 歌曲图片 end -->
        <div class="song-center">
          <!-- 歌曲进度条盒子 start -->
          <!-- <div class="song-progress-box" ref="progressBoxDom">
            <div class="song-progress" ref="songProgress"></div>
            <div
              class="slider"
              @touchstart="touchStart"
              @touchmove="touchMove"
              @touchend="touchEnd"
              ref="slider"
            ></div>
          </div> -->
          <!-- 歌曲进度条盒子 end -->
          <div class="song-desc">
            {{ currentSong.name + " - "
            }}<span class="singer">{{ singers }}</span>
          </div>
        </div>

        <!-- 暂停和播放的按钮 start -->
        <div class="controls">
          <canvas width="40px" height="40px" ref="canvas"></canvas>
          <div class="text" @click.stop="togglePlay" :class="{ pause }"></div>
        </div>
        <!-- 暂停和播放的按钮 end -->

        <!-- 播放列表 start -->
        <div class="user-play-list">
          <div
            class="list-img"
            @click.stop="showPlayList = !showPlayList"
          ></div>

          <!-- 使用播放列表模态框的组件 -->
          <MenuModel
            :showPlayList="showPlayList"
            @update:showPlayList="showPlayList = !showPlayList"
            :songArr="songArr"
            :currentSong="currentSong"
            @update:currentSong="$emit('update:currentSong', $event)"
            @del-song="delSong"
            :playModeIcon="playModeIconDatas[currentIcon]"
            @update:currentIcon="updateCurrentIcon"
          ></MenuModel>
        </div>
        <!-- 播放列表 end -->
      </div>
    </transition>
    <!-- 播放控制栏 end -->

    <!-- 歌曲页面 start -->
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div class="play-full" v-show="!isShowPlayBar">
        <!-- 背景图片的模糊遮罩层 start -->
        <div class="mask" :style="{ backgroundImage }"></div>
        <!-- 背景图片的模糊遮罩层 end -->

        <PlayFullHeader
          @show-play-bar="isShowPlayBar = true"
          :currentSong="currentSong"
        />
        <template>
          <transition
            v-if="isShowLyric"
            name="custom-classes-transition"
            enter-active-class="animate__animated animate__fadeIn"
          >
            <PlayFullLyric
              @toggle-show-lyric="isShowLyric = !isShowLyric"
              :currentSong="currentSong"
              :audio="$refs.audio"
            />
          </transition>
          <transition
            v-if="!isShowLyric"
            name="custom-classes-transition"
            enter-active-class="animate__animated animate__fadeIn"
          >
            <PlayFullChart
              @toggle-show-lyric="isShowLyric = !isShowLyric"
              :currentSong="currentSong"
              :pause="pause"
            />
          </transition>
        </template>
        <PlayFullFooter
          :currentTime="currentTime"
          :durationTime="durationTime"
          @update:currentTime="$refs.audio.currentTime = $event"
          :currentSong="currentSong"
          :songArr="songArr"
          :isEnded="isEnded"
          @transmit-song-arr="acceptSongArr"
          :pause="pause"
          @toggle-play="togglePlay"
          @play-next="ended"
          @play-prev="playPrev"
          :isPrev="isPrev"
          @transmit-song-arr-prev="acceptSongArrPrev"
          @update:currentSong="$emit('update:currentSong', $event)"
          @del-song="delSong"
          :playModeIcon="playModeIconDatas[currentIcon]"
          @update:currentIcon="updateCurrentIcon"
        />
      </div>
    </transition>
    <!-- 歌曲页面 end -->
  </div>
</template>

<script>
import PlayFullHeader from "../components/PlayFullHeader.vue";
import PlayFullLyric from "../components/PlayFullLyric.vue";
import PlayFullChart from "../components/PlayFullChart.vue";
import PlayFullFooter from "../components/PlayFullFooter.vue";
import MenuModel from "../components/MenuModel.vue";
export default {
  name: "play",

  props: ["currentSong", "isBounce", "pause"],

  data() {
    return {
      // 本条歌曲的总时长
      durationTime: 0,
      // 本条歌曲的当前播放时长
      currentTime: 0,
      // 最大的宽度
      maxWidth: 0,
      // 触摸开始，记录类名为song-progress-box dom对象 的offsetLeft
      originLeft: 0,
      // 控制是否画圆 当组件销毁之前，不画圆
      beforeDestroy: true,
      // 控制显示播放列表
      showPlayList: false,
      // 控制是否显示播放控件
      isShowPlayBar: true,
      // 控制是否显示歌词还是唱片
      isShowLyric: false,
      // 用来触发歌曲播放完，提醒播放菜单传递歌曲数组
      isEnded: false,
      // 接收播放列表菜单的歌曲数组
      songArr: [],
      // 监听点击了下一曲的状态
      isPrev: false,
      // 存放播放模式图标的数据
      playModeIconDatas: [
        {
          iconb: require("../assets/images/loop.png"),
          iconf: require("../assets/images/loopfff.png"),
          text: "列表循环",
        },
        {
          iconb: require("../assets/images/random.png"),
          iconf: require("../assets/images/randomfff.png"),
          text: "随机播放",
        },
        {
          iconb: require("../assets/images/single.png"),
          iconf: require("../assets/images/singlefff.png"),
          text: "单曲循环",
        },
      ],
      // 当前播放模式的图标下标
      currentIcon: 0,
    };
  },

  components: {
    PlayFullHeader,
    PlayFullLyric,
    PlayFullChart,
    PlayFullFooter,
    MenuModel,
  },

  created() {
    // console.log('currentSong =>',this.currentSong);
  },

  // 组件销毁前不要进行canvas画圆
  beforeDestroy() {
    this.beforeDestroy = false;
  },

  watch: {
    currentSong() {
      // 判断songArr数组中是否有currentSong
      let bool = this.songArr.every((item) => {
        return item.id != this.currentSong.id;
      });
      // 没有就添加到数组songArr中去
      if (bool) {
        this.songArr.push(this.currentSong);
      }
      // console.log(this.songArr);
    },
  },

  computed: {
    // 处理歌手名
    singers() {
      let singArr = [];
      if (this.currentSong.song) {
        // 渲染NewSongList列表的处理
        this.currentSong.song.artists.forEach((item) => {
          singArr.push(item.name);
        });
      } else if (this.currentSong.ar) {
        // 渲染Hot列表的处理
        this.currentSong.ar.forEach((item) => {
          singArr.push(item.name);
        });
      } else {
        // 渲染搜索结果的列表的处理
        this.currentSong.artists.forEach((item) => {
          singArr.push(item.name);
        });
      }
      return singArr.join(" / ");
    },

    backgroundImage() {
      return this.currentSong.al
        ? `url('${this.currentSong.al.picUrl}')`
        : `url('${this.currentSong.picUrl}')`;
    },
  },

  mounted() {
    // console.log(this.$refs);
  },

  methods: {
    // oncanplay（要定义成一个匿名函数）是监听歌曲是否可以播放，可以播放才有歌曲的总时长duration
    canPlay(event) {
      this.durationTime = event.target.duration;
    },

    // 监听歌曲实时播放的当前时间  （歌曲当前播放事件发生变化 触发事件）
    timeUpdate(event) {
      if (this.beforeDestroy) {
        // 获取audio dom对象
        let audio = this.$refs.audio;
        // 获取歌曲的播放当前时间
        this.currentTime = audio.currentTime;

        // // 计算当前时间 占 总时间的百分比
        // let percent = this.currentTime / this.durationTime;
        // // 获取类名为song-progress-box dom对象
        // let progressBoxDom = this.$refs.progressBoxDom;
        // // 获取进度条的最大宽度
        // this.maxWidth = progressBoxDom.offsetWidth;
        // // 从而来实时更新滑块的left和进度条的width
        // let songProgress = this.$refs.songProgress;
        // let slider = this.$refs.slider;
        // songProgress.style["width"] =
        //   this.maxWidth * percent + slider.offsetWidth / 2 + "px";
        // slider.style["left"] = this.maxWidth * percent + "px";

        // 调用canvas画圆的方法
        this.drawCircle(this.currentTime, this.durationTime);
      }
    },

    // 监听歌曲播放结束时的方法 和 下一曲的方法
    ended() {
      // 歌曲播放结束了 或者点击了下一曲，改变isEnded的值，从此让子组件知道歌曲播放结束了 或者点击了下一曲
      this.isEnded = !this.isEnded;
    },

    // 点击了上一曲的方法
    playPrev() {
      // 当点击了下一曲，改变isNext的值，从此让子组件知道要下一曲播放了
      this.isPrev = !this.isPrev;
    },

    // 接收菜单传过来的歌曲数组，从而实现播放下一曲 监听播放结束或点击了下一曲
    acceptSongArr() {
      // 如果只有一首歌，且点击了下一曲或者歌曲播放结束时 重新播放歌曲
      if (this.songArr.length == 1) {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        return;
      }

      // 歌曲播放模式的判断
      if (this.currentIcon == 0) {
        // 歌曲循环播放的思路
        for (let i in this.songArr) {
          // 列表循环播放的思路
          if (this.songArr[i].id == this.currentSong.id) {
            // 找到播放列表中正在播放的歌曲
            if (i == this.songArr.length - 1) {
              // 如果是列表中的最后一首歌
              this.$emit("update:currentSong", this.songArr[0]);
            } else {
              // 否则
              this.$emit("update:currentSong", this.songArr[+i + 1]);
            }
            return;
          }
        }
      } else if (this.currentIcon == 1) {
        // 歌曲随机播放的思路
        // 当前播放歌曲的下标
        let index = this.songArr.findIndex((item) => {
          return item.id == this.currentSong.id;
        });

        // 获取随机下标
        let randomIndex = Math.floor(Math.random() * this.songArr.length);
        // 判断随机下标是否为当前播放的歌曲下标，是 需要重新获取随机下标
        if (randomIndex == index) {
          if (index == this.songArr.length - 1) {
            // 随机下标和当前播放下标都是最后一个时，播放第一首歌
            this.$emit("update:currentSong", this.songArr[0]);
          } else {
            randomIndex += 1;
          }
        }
        this.$emit("update:currentSong", this.songArr[randomIndex]);
        return;
      } else {
        // 单曲循环地思路
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        return;
      }
    },

    // 触发点击了上一曲的方法
    acceptSongArrPrev() {
      // 如果只有一首歌，且点击了上一曲时 重新播放歌曲
      if (this.songArr.length == 1) {
        this.$refs.audio.currentTime = 0;
        return;
      }

      // 歌曲播放模式的判断
      if (this.currentIcon == 0) { // 歌曲循环播放的思路       
        for (let i in this.songArr) {
          // 列表循环播放的思路
          if (this.songArr[i].id == this.currentSong.id) {
            // 找到播放列表中正在播放的歌曲
            if (i == 0) {
              // 如果是列表中的第一首歌
              this.$emit(
                "update:currentSong",
                this.songArr[this.songArr.length - 1]
              );
            } else {
              // 否则
              this.$emit("update:currentSong", this.songArr[+i - 1]);
            }
            return;
          }
        }
      } else if (this.currentIcon == 1) { // 歌曲随机播放的思路        
        // 当前播放歌曲的下标
        let index = this.songArr.findIndex((item) => {
          return item.id == this.currentSong.id;
        });

        // 获取随机下标
        let randomIndex = Math.floor(Math.random() * this.songArr.length);
        // 判断随机下标是否为当前播放的歌曲下标，是 需要重新获取随机下标
        if (randomIndex == index) {
          if (index == 0) {
            // 随机下标和当前播放下标都是第一个时，播放最后一首歌
            this.$emit("update:currentSong", this.songArr[this.songArr.length - 1]);
          } else {
            randomIndex -= 1;
          }
        }
        this.$emit("update:currentSong", this.songArr[randomIndex]);
        return;
      } else { // 单曲循环地思路  
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        return;
      }
    },

    // 点击了X删除这首歌曲
    delSong(itemSong) {
      if (this.songArr.length == 1) {
        this.$refs.audio.pause();
      }
      for (let i in this.songArr) {
        if (itemSong.id == this.songArr[i].id) {
          this.songArr.splice(i, 1);
          return;
        }
      }
    },

    // 更新播放模式的图标的方法
    updateCurrentIcon() {
      this.currentIcon++;
      if (this.currentIcon >= 3) {
        this.currentIcon = 0;
      }
    },

    // 触摸开始的事件
    touchStart(event) {
      // 获取类名为song-progress-box dom对象
      let progressBoxDom = this.$refs.progressBoxDom;
      // 触摸开始，记录类名为song-progress-box dom对象 的offsetLeft
      this.originLeft = progressBoxDom.offsetLeft;
      // 触摸开始，歌曲停止播放
      this.$refs.audio.pause();
    },

    // 触摸移动的事件
    touchMove(event) {
      // 移动改变的宽度
      let moveX = event.touches[0].pageX - this.originLeft;

      // 临界值的判断
      if (moveX < 0) {
        moveX = 0;
      } else if (moveX > this.maxWidth) {
        moveX = this.maxWidth;
      }

      // 占总宽度的百分比
      let percent = moveX / this.maxWidth;
      // 获取滑块和进度条的 dom对象
      let songProgress = this.$refs.songProgress;
      let slider = this.$refs.slider;
      // 从而来实时更新滑块的left和进度条的width
      songProgress.style["width"] = moveX + slider.offsetWidth / 2 + "px";
      slider.style["left"] = moveX + "px";

      // 设置歌曲的当前时间  给多媒体对象的currentTime (可读写)
      this.$refs.audio.currentTime = this.durationTime * percent;
    },

    // 触摸结束的事件
    touchEnd(event) {
      // 触摸结束时，播放歌曲
      this.$refs.audio.play();
      if (!this.pause) {
        this.$emit("change-pause");
      }
    },

    // canvas画圆的方法
    drawCircle(currentTime, durationTime) {
      if (this.beforeDestroy) {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, 40, 40);

        // 画第一个圆
        ctx.beginPath();
        ctx.strokeStyle = "#666";
        ctx.arc(20, 20, 14, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();

        // 画第二个圆
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.arc(
          20,
          20,
          14,
          Math.PI * -0.5,
          Math.PI * ((currentTime / durationTime) * 2 - 0.5),
          false
        );
        ctx.stroke();
        ctx.closePath();
      }
    },

    // 播放与暂停的切换的方法
    togglePlay() {
      this.$emit("change-pause");
      let audio = this.$refs.audio;
      if (this.pause) {
        audio.pause();
      } else {
        audio.play();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.play {
  .play-progress {
    position: fixed;
    bottom: -4px;
    left: 0;
    width: 100%;
    background-color: #eee;
    padding: 4px;
    display: flex;
    justify-content: space-between;

    audio {
      display: none;
    }

    .song-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 12px;
      box-shadow: 0 0 3px 1px #666;

      img {
        width: 40px;
        height: 40px;
        // 动画旋转
        animation: imgRotate 14s linear infinite;

        &.stop {
          animation-play-state: paused;
        }
      }

      @keyframes imgRotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }

    .song-center {
      width: auto;
      flex: 1;
      padding-top: 4px;
      margin-right: 10px;

      .song-progress-box {
        width: 100%;
        height: 6px;
        background: #fff;
        border-radius: 20px;
        position: relative;

        .song-progress {
          // width: 100%;
          height: 100%;
          background-color: #dd001b;
          border-radius: 20px;
          position: absolute;
          left: 0;
          top: 0;
        }

        .slider {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: tomato;
          position: absolute;
          left: 0;
          top: -2px;
          z-index: 10;
        }
      }

      .song-desc {
        font-size: 13px;
        margin-top: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 220px;

        span.singer {
          font-size: 12px;
          color: #888;
        }
      }
    }

    .controls {
      position: relative;

      .text {
        position: absolute;
        left: 6px;
        top: 6px;
        width: 28px;
        height: 28px;
        border-radius: 50%;

        &::before {
          content: "";
          width: 28px;
          height: 28px;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 0;
          background: url("../assets/images/play.png") no-repeat 8px 7px;
          background-size: 14px 14px;
        }

        &.pause::before {
          background: url("../assets/images/pause.png") no-repeat center;
          background-size: 14px 14px;
        }
      }
    }

    .user-play-list {
      width: 40px;
      height: 44px;
      position: relative;

      .list-img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: url("../assets/images/playlist.png") no-repeat center;
        background-size: 22px 22px;
        position: absolute;
        left: 0;
        top: 4px;
      }
    }
  }

  .animate__animated.animate__fadeIn,
  .animate__animated.animate__fadeOut {
    --animate-duration: 240ms;
  }

  .play-full {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    // 如果没有背景图片时的默认底色
    background: linear-gradient(to bottom, rgb(54, 54, 54), rgb(100, 95, 95));
    padding: 4px 0;
    box-sizing: border-box;

    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;

    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background-size: cover;
      background-position: center;
      // 背景图片模糊 blur模糊程度  brightness底色度
      // filter: blur(120px) brightness(.6);
      filter: blur(80px) brightness(0.5);
    }
  }
}
</style>