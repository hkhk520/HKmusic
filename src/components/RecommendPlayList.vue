<template>
  <div class="recommend-play-list">
    <NavBar>推荐歌单</NavBar>

    <!-- 推荐歌单列表 start -->
    <ul class="play-list-box">
      <li
        v-for="item in recommendPlayList"
        :key="item.id"
        @click="goPlayList(item.id)"
      >
        <div class="list-img">
          <img :src="item.picUrl" />

          <!-- 使用播放次数的组件 -->
          <PlayCount :item="item"></PlayCount>
        </div>
        <div class="list-name">{{ item.name }}</div>
      </li>
    </ul>
    <!-- 推荐歌单列表 end -->
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import PlayCount from "../components/PlayCount.vue";
export default {
  name: "RecommendPlayList",
  data() {
    return {
      recommendPlayList: [],
      allRecommendPlayList: [],
    };
  },

  created() {
    // 获取推荐歌单
    this.getRecommendPlayList();
  },

  // 由于在router-view的路由出口使用了keep-alive，那么在调用keep-alive里面的组件时就有activated 和 deactivated 这两个生命周期钩子函数将会被对应执行
  activated() {
    // 随机取一个起始下标值
    let startIndex = Math.floor(Math.random() * this.allRecommendPlayList.length);
    // 判断临界值
    if (startIndex > 23) {
      startIndex = 24;
    }
    // 根据起始下标，确定结束下标值
    let endIndex = startIndex + 6;
    // 截取数组中6个item
    this.recommendPlayList = this.allRecommendPlayList.slice(startIndex, endIndex);
    console.log("activated.recommendPlayList =>", this.recommendPlayList);
  },

  components: {
    NavBar,
    PlayCount,
  },

  methods: {
    // 获取推荐歌单的方法
    getRecommendPlayList() {

      // 加载轻提示
      // this.$root.isShowLoading = true;
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
      });

      this.axios({
        method: "get",
        url: "/personalized",
      })
        .then((result) => {
          this.allRecommendPlayList = result.data.result;
          // 一created就取前6个，进行展示
          this.recommendPlayList = this.allRecommendPlayList.slice(0, 6);
          console.log("created.recommendPlayList =>", this.recommendPlayList);
        })
        .catch((err) => {
          console.log(err);
        }).finally( () => { // axios请求完成
          // 关闭轻提示
          // this.$root.isShowLoading = false;
          this.$toast.clear();
        });
    },

    // 点击每一个li跳转到歌单详情页
    goPlayList(listId) {
      // 不显示导航栏
      this.$emit("update:isShowMainNav");
      this.$router.push({ name: "PlayList", query: { listId } });
    },
  },
};
</script>

<style lang="less" scoped>
.recommend-play-list {
  .play-list-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 24px;

    li {
      width: 32.8%;
      margin-bottom: 16px;

      .list-img {
        width: 100%;
        position: relative;
        img {
          width: 100%;
          vertical-align: bottom;
        }
      }

      .list-name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        padding: 6px 2px 0 6px;
        box-sizing: border-box;
      }
    }
  }
}
</style>