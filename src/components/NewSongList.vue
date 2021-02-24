<template>
  <div class="new-song-list">
    <NavBar>最新音乐</NavBar>

    <ol class="new-song-box">
      <ListItem
        v-for="song in newsongDatas"
        :key="song.id"
        :song="song"
        @get-song="getSong"
        :currentSong="currentSong"
        :class="{ active: currentSong.id === song.id }"
        :pause="pause"
      >
        <!-- <div class="num">01</div> -->
      </ListItem>
      <!-- <ListItem>
        <div class="num">01</div>
      </ListItem> -->
    </ol>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import ListItem from "../components/ListItem.vue";

export default {
  name: "NewSongList",

  props:["pause","currentSong"],

  data() {
    return {
      // 最新歌曲列表
      newsongDatas: [],
    };
  },

  created() {
    // 获取新音乐
    this.getNewsong();
  },

  components: {
    NavBar,
    ListItem,
  },

  methods: {
    // 获取新音乐的方法
    getNewsong() {
      // 加载轻提示
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
      });

      this.axios({
        method: "get",
        url: "/personalized/newsong",
      })
        .then((result) => {
          this.newsongDatas = result.data.result;
          console.log("this.newsongDatas =>", this.newsongDatas);
        })
        .catch((err) => {
          console.log(err);
        }).finally( () => {
          // 关闭轻提示
          this.$toast.clear();
        });
    },

    getSong(song){
      this.$emit('get-song', song);
    }
  },
};
</script>

<style lang="less" scoped>

</style>