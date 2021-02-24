<template>
  <div class="menu-model" v-if="showPlayList">
    <!-- 播放列表模态框 start -->
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div class="play-list-model" @click.stop="$emit('update:showPlayList')">
        <transition
          name="custom-classes-transition"
          enter-active-class="animate__animated animate__slideInUp"
          leave-active-class="animate__animated animate__slideOutDown"
        >
          <div class="play-list-box">
            <div class="title">
              当前播放<span>（{{ songArr.length }}）</span>
            </div>
            <div class="play-function">
              <div class="mode" @click.stop="$emit('update:currentIcon')">
                <img :src="playModeIcon.iconb" />
                <span>{{ playModeIcon.text }}</span>
              </div>
              <div class="collect">
                <img src="../assets/images/collect.png" />
                <span>收藏全部</span>
              </div>
            </div>
            <ul class="music-list">
              <li
                v-for="item in songArr"
                :key="item.id"
                @click.stop="$emit('update:currentSong', item)"
              >
                <div class="left">
                  <img
                    src="../assets/images/voice.png"
                    v-if="item.id == currentSong.id"
                  />
                  <span
                    class="song-message"
                    :class="{ active: item.id == currentSong.id }"
                    >{{ item.name }}
                    <span :class="{ active: item.id == currentSong.id }"
                      >- {{ singers(item) }}</span
                    ></span
                  >
                </div>
                <img
                  src="../assets/images/del.png"
                  class="del"
                  @click.stop="$emit('del-song', item)"
                />
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </transition>
    <!-- 播放列表模态框 end -->
  </div>
</template>

<script>
export default {
  name: "MenuModel",
  props: [
    "showPlayList",
    "currentSong",
    "songArr",
    "isEnded",
    "isPrev",
    "playModeIcon"
  ],

  data() {
    return {
    };
  },

  created() {},

  updated() {},

  watch: {
    // 监听父组件的isEnded的变化，即监听父组件的audio是否播放结束 或者点击了下一曲
    isEnded() {
      // 歌曲播放要结束了 或者点击了下一曲，想父组件发射歌曲列表数组
      this.$emit("transmit-song-arr");
    },

    // 监听点击了上一曲的isPrev变化
    isPrev() {
      this.$emit("transmit-song-arr-prev");
    },
  },

  methods: {
    // 处理歌手名
    singers(item) {
      let singArr = [];
      if (item.song) {
        // 渲染NewSongList列表的处理
        item.song.artists.forEach((item) => {
          singArr.push(item.name);
        });
      } else if (item.ar) {
        // 渲染Hot列表的处理
        item.ar.forEach((item) => {
          singArr.push(item.name);
        });
      } else {
        // 渲染搜索结果的列表的处理
        item.artists.forEach((item) => {
          singArr.push(item.name);
        });
      }
      return singArr.join(" / ");
    },

  },
};
</script>

<style lang="less" scoped>
.menu-model {
  .play-list-model {
    position: fixed;
    bottom: 0;
    left: 0;

    z-index: 30;

    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);

    .play-list-box {
      width: 90%;
      height: 60%;
      background: #fff;
      border-radius: 14px;
      position: absolute;
      bottom: 4%;
      left: 5%;
      color: #000;
      padding: 20px 14px;
      box-sizing: border-box;

      .title {
        font-weight: bold;

        span {
          font-size: 14px;
          color: #999;
          margin-left: 4px;
        }
      }

      .play-function {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        img {
          width: 20px;
          height: 20px;
          vertical-align: bottom;
          margin-right: 5px;
        }
        .collect {
          img {
            width: 18px;
            height: 18px;
          }
        }
      }

      .music-list {
        height: 88%;
        overflow: hidden;
        li {
          display: flex;
          justify-content: space-between;
          margin-top: 18px;

          .left {
            display: flex;
            font-size: 15px;
            img {
              width: 18px;
              height: 18px;
              vertical-align: bottom;
              margin-right: 6px;
            }
            .song-message {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 240px;

              span {
                color: #777;
                font-size: 12px;

                &.active {
                  color: #dd001b;
                }
              }

              &.active {
                color: #dd001b;
              }
            }
          }

          .del {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
}
</style>