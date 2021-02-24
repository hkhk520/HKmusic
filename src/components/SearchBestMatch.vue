<template>
  <div class="search-best-match">
    <div class="search-result-box" v-if="isSearchResult">
      <div class="search-result-title">最佳匹配</div>
      <div class="singer-box" @click="goSingerDesc">
        <img :src="singerBoxData.img1v1Url" />
        <div class="right-box">
          <div class="singer-desc">
            歌手: <span>{{ singerBoxData.name }}</span>
          </div>
          <img src="../assets/images/right.png" />
        </div>
      </div>
      <!-- 搜索结果数据列表展示 start -->
      <ul class="search-result-list-box" v-if="!isShowVoice">
        <ListItem
          v-for="song in songsListDatas"
          :key="song.id"
          :song="song"
          @get-song="$emit('get-song', song)"
          :currentSong="currentSong"
          :class="{ active: currentSong.id === song.id }"
          :pause="pause"
        >
          <!-- <div class="num" :class="{ 'top-three': index < 3 }">
            {{ (index + 1) | newIndex }}
          </div> -->
        </ListItem>

        <!-- 显示懒加载的盒子 -->
        <!-- <li class="lazy-loading-box">
          <div v-if="moreShowBoolen" class="more">tips：滚动加载更多</div>
          <div v-else class="no-more" ref="noMore">已无更多</div>
        </li> -->
      </ul>
      <!-- 搜索结果数据列表展示 end -->

      <!-- 展示请求前的动画 start -->
      <Voice :isShowVoice="isShowVoice"></Voice>
      <!-- 展示请求前的动画 end -->
    </div>
  </div>
</template>

<script>
import ListItem from "../components/ListItem.vue";
import Voice from '../components/Voice.vue';

export default {
  name: "SearchBestMatch",

  props: ["isSearchResult","singerBoxData","songsListDatas","currentSong","pause","isShowVoice","singerId"],

  components: {
    ListItem,
    Voice,
  },

  methods: {
    goSingerDesc(){
      // 不显示导航栏
      this.$emit("update:isShowMainNav");
      // 跳到歌手信息页面
      this.$router.push({name: 'SingerDesc',query: {singerId: this.singerId}});
    }
  },
};
</script>

<style lang="less" scoped>
.search-result-box {
  .search-result-title {
    font-size: 12px;
    color: #666666;
    padding: 10px;
    box-sizing: border-box;
  }

  .singer-box {
    margin-left: 10px;
    padding: 0 8px 10px 0;
    display: flex;
    border-bottom: 1px solid rgb(219, 219, 219);

    > img {
      width: 50px;
      height: 50px;
      vertical-align: bottom;
      margin-right: 12px;
      box-shadow: 0 0 1px 1px rgb(235, 232, 232);
    }

    .right-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      font-size: 17px;

      .singer-desc {
        span {
          color: #507daf;
        }
      }

      img {
        width: 18px;
        height: 18px;
        margin: 0 8px;
        vertical-align: bottom;
      }
    }
  }
}
</style>