<template>
  <div class="hot" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
    <div class="hot-top">
      <div class="hotopct">
        <div class="hot-icon"></div>
        <div class="hot-time">更新日期：{{ months }}月{{ days }}日</div>
      </div>
    </div>

    <ul class="hot-song-box">
      <ListItem
        v-for="(song, index) in lazyListDatas"
        :key="song.id"
        :song="song"
        @get-song="getSong"
        :currentSong="currentSong"
        :class="{ active: currentSong.id === song.id }"
        :pause="pause"
      >
        <div class="num" :class="{ 'top-three': index < 3 }">
          {{ (index + 1) | newIndex }}
        </div>
      </ListItem>

      <!-- 显示懒加载的盒子 -->
      <li class="lazy-loading-box">
        <div v-if="moreShowBoolen" class="more">tips：滚动加载更多</div>
        <div v-else class="no-more" ref="noMore">已无更多</div>
      </li>
    </ul>
  </div>
</template>

<script>
import ListItem from "../components/ListItem.vue";
export default {
  name: "Hot",

  props: ["pause", "currentSong"],

  data() {
    return {
      // 保存所有歌曲详情信息的id
      idsStr: "",
      // 懒加载数据
      lazyListDatas: [],
      // 记录更新日期时间
      months: null,
      days: null,
      // 控制是否显示更多
      moreShowBoolen: false,
      // 控制页数
      nowPage: 1,
      // 记录卷积高度
      scrollHeight: 0,
      // 触摸的起始点
      startX: null,
      startY: null,
      // 触摸移动的X、Y距离
      moveX: null,
      moveY: null,
    };
  },

  created() {
    this.getHotListData();

    // 调用懒加载获取更多歌曲的方法
    this.lazyLoading();
  },

  activated() {
    // 把触摸移动的X、Y距离置空
    this.moveX = null;
    this.moveY = null;
  },

  // 过滤器
  filters: {
    // 补0
    newIndex(oldIndex) {
      return oldIndex < 10 ? "0" + oldIndex : oldIndex;
    },
  },

  components: {
    ListItem,
  },

  methods: {
    touchstart(event){
      // 触摸的起始点
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },
    touchmove(event){
      // 触摸移动的X、Y距离
      this.moveX = event.touches[0].clientX - this.startX;
      this.moveY = event.touches[0].clientY - this.startY;
    },
    touchend(){ 
      // Math.abs(X) > Math.abs(Y) && X > 0
      if(Math.abs(this.moveX) > Math.abs(this.moveY) && this.moveX < 0){ // 左滑
        this.goSearch();
      }else if(Math.abs(this.moveX) > Math.abs(this.moveY) && this.moveX > 0){ // 右滑
        this.goRecommend();
      }
    },
    // 左滑去搜索页面路由
    goSearch(){
      this.$router.push({name: "Search"});
      this.$emit("update:currentIndex",2);
    },
    // 右滑去推荐音乐页面路由
    goRecommend(){
      this.$router.push({name: "Recommend"});
      this.$emit("update:currentIndex",0);
    },

    // 获取热歌榜歌曲列表
    getHotListData() {
      // 加载轻提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });

      this.axios({
        method: "get",
        url: "/top/list",
        params: {
          idx: 1,
        },
      })
        .then((response) => {
          console.log("this.getHotListData =>", response);

          // 格式化更新的日期时间
          let updateTime = response.data.playlist.updateTime;
          this.months = Math.floor((updateTime / 1000 / 3600 / 24 / 30) % 12);
          this.days = Math.floor((updateTime / 1000 / 3600 / 24) % 30);

          // 将获取到的歌曲id，拼接成字符串
          let trackIds = response.data.playlist.trackIds;
          let idsArr = [];
          trackIds.forEach((item) => {
            idsArr.push(item.id);
          });
          // 保存所有歌曲详情信息的id
          this.idsStr = idsArr.join();

          // 调用根据歌曲id来获取前7条歌曲的详细信息
          this.init(this.idsStr);
        })
        .catch((err) => {
          console.log(err);
          this.$refs.noMore.innerText = "请求失败，请重新刷新";
        });
    },

    // 根据歌曲id来获取前9条歌曲的详细信息
    init(ids) {
      // 加载轻提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });

      this.axios({
        method: "get",
        url: "/song/detail",
        params: {
          ids,
        },
      })
        .then((response) => {
          let songDetailDatas = response.data.songs;
          console.log("songDetailDatas =>", songDetailDatas);

          if (songDetailDatas.length <= 9) {
            this.lazyListDatas = songDetailDatas;
            // 显示无更多数据
            this.moreShowBoolen = false;
          } else {
            // 长度大于9
            // 截取前9条数据
            this.lazyListDatas = songDetailDatas.slice(0, 9);
            // 显示更多数据
            this.moreShowBoolen = true;
          }

          // 关闭轻提示
          this.$toast.clear();
        })
        .catch((err) => {
          console.log(err);

          // 关闭轻提示
          this.$toast.clear();
        });
    },

    // 滑动来获取更多7条歌曲数据
    scrollMore(ids) {

      this.axios({
        method: "get",
        url: "/song/detail",
        params: {
          ids,
        },
      })
        .then((response) => {
          let songDetailDatas = response.data.songs;

          // 截取下一个7条数据，加上之前的数据
          this.lazyListDatas = this.lazyListDatas.concat(
            songDetailDatas.slice(this.nowPage * 9, (this.nowPage + 1) * 9)
          );
          // 页数+1
          this.nowPage++;

          if (songDetailDatas.length >= this.nowPage * 9) {
            // 还有数据
            this.moreShowBoolen = true;
          } else {
            // 没数据了
            this.moreShowBoolen = false;
          }

          // 关闭轻提示
          this.$toast.clear();
        })
        .catch((err) => {
          console.log(err);

          // 关闭轻提示
          this.$toast.clear();
        });
    },

    // 监听滑动时获取更多数据的方法，即懒加载方法
    lazyLoading() {
      // screen.availHeight表示屏幕高度
      // document.documentElement.scrollTop表示当前页面滚动条的位置,documentElement对应的是html标签,body对应的是body标签
      // document.compatMode用来判断当前浏览器采用的渲染方式,CSS1Compat表示标准兼容模式开启
      window.addEventListener("scroll", () => {
        const scrollY =
          document.documentElement.scrollTop || document.body.scrollTop; // 滚动条在Y轴上的滚动距离

        const vh =
          document.compatMode === "CSS1Compat"
            ? document.documentElement.clientHeight
            : document.body.clientHeight; // 页面的可视高度（能看见的）

        const allHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        ); // 页面的总高度（所有的）
        // console.log(scrollY);
        // console.log(vh);
        // console.log(allHeight);

        if (scrollY + vh >= allHeight - 1) {
          // 当滚动条滑到页面底部

          this.scrollMore(this.idsStr);
        }
      });
    },

    // 接收子组件传过来的函数
    getSong(song) {
      this.$emit("get-song", song);
    },
  },
};
</script>

<style lang="less" scoped>
.hot {
  width: 100vw;
  .hot-top {
    background: url("https://s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg?f01a252389c26bcf016816242eaa6aee=")
      no-repeat center;
    background-size: cover;
    height: 145px;
    width: 100%;

    .hotopct {
      padding: 20px 0 0 20px;
      box-sizing: border-box;

      .hot-icon {
        display: inline-block;
        width: 142px;
        height: 67px;
        background: url("../assets/images/icon.png") no-repeat -24px -29px;
        background-size: 166px 97px;
      }

      .hot-time {
        margin-top: 10px;
        color: hsla(0, 0%, 100%, 0.8);
        font-size: 12px;
      }
    }
  }

  .lazy-loading-box {
    width: 100%;
    margin: 14px 0;
    font-size: 14px;
    text-align: center;
    color: #666;

    .no-more {
      color: #999;
    }
  }
}
</style>