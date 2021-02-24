<template>
  <div class="play-full-header">
    <div class="back" @click="$emit('show-play-bar')"></div>
    <div class="singer-desc">
      <div class="song-name">{{ currentSong.name }}</div>
      <div class="singer-name">{{ singers }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayFullHeader",

  props: ["currentSong"],

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
  },
};
</script>

<style lang="less" scoped>
.play-full-header {
  height: 50px;
  width: 100%;
  display: flex;
  padding: 18px 10px 0;

  .back {
    width: 40px;
    height: 100%;
    background: url("../assets/images/back.png") no-repeat center;
    background-size: 22px 22px;
  }

  .singer-desc {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;

    .song-name {
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 300px;
    }

    .singer-name {
      font-size: 12px;
      color: #999;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 300px;
    }
  }
}
</style>