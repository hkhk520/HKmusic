<template>
  <li class="list-item" @click="$emit('get-song',song)">
    <!-- 插槽部分 -->
    <slot>
      <!-- <div class="num">01</div> -->
    </slot>

    <div class="right-box">
      <div class="song-desc-box">
        <div class="song-name">{{ song.name }}</div>
        <div class="singer-info">
          <span class="icon"></span>
          <span class="info-text">{{ singers }} - {{ albumName }}</span>
        </div>
      </div>

      <!-- 使用切换播放按钮的组件 -->
      <TogglePlayBtn
        :pause="pause"
        :song="song"
        :currentSong="currentSong"
      ></TogglePlayBtn>
    </div>
  </li>
</template>

<script>
import TogglePlayBtn from "../components/TogglePlayBtn.vue";
export default {
  name: "ListItem",

  props: {
    song: {
      type: Object,
      default() {
        return {};
      },
      required: true,
    },
    pause: {
      type: Boolean,
    },
    currentSong: {
      type: Object,
    },
  },

  data() {
    return {};
  },

  components: {
    TogglePlayBtn,
  },

  computed: {
    // 处理歌手名
    singers() {
      let singArr = [];
      if(this.song.song){  // 渲染NewSongList列表的处理
        this.song.song.artists.forEach((item) => {
          singArr.push(item.name);
        });
      }else if(this.song.ar){  // 渲染Hot列表的处理
        this.song.ar.forEach((item) => {
          singArr.push(item.name);
        }); 
      }else{ // 渲染搜索结果的列表的处理
        this.song.artists.forEach((item) => {
          singArr.push(item.name);
        });
      }
      return singArr.join(" / ");
    },
    // 处理专辑名
    albumName() {
      if(this.song.song){  // 渲染NewSongList列表的处理
        return this.song.song.album.name;
      }else if(this.song.al){  // 渲染Hot列表的处理
        return this.song.al.name;
      }else{ // 渲染搜索结果的列表的处理
        return this.song.album.name;
      }
    },
  },

  methods: {},
};
</script>

<style lang="less" scoped>
li.list-item {
  padding-left: 10px;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  display: flex;

  &.active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .num {
    margin-right: 10px;
    font-size: 17px;
    line-height: 57px;
    color: #999;

    &.top-three{
      color: #dd001b;
    }
  }

  .right-box {
    display: flex;
    justify-content: space-between;
    padding: 6px 2px 6px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f1;
    width: 100%;
  }

  .song-desc-box {
    flex: 1;
    .song-name {
      font-size: 17px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 280px;
    }

    .singer-info {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 280px;

      .icon {
        display: inline-block;
        width: 12px;
        height: 8px;
        margin-right: 4px;
        background: url("../assets/images/icon.png") no-repeat;
        background-size: 162px 97px;
      }

      .info-text {
        font-size: 12px;
        color: #888;
      }
    }
  }
}
</style>