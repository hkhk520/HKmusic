<template>
  <div class="play-list" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
    <div class="play-list-box">
      <div class="play-list-header">
        <!-- 背景图片的模糊遮罩层 start -->
        <div
          class="mask"
          :style="{ backgroundImage: 'url(' + listData.coverImgUrl + ')' }"
        ></div>
        <!-- 背景图片的模糊遮罩层 end -->
        <div class="list-img">
          <img :src="listData.coverImgUrl" />

          <!-- 使用播放次数的组件 -->
          <PlayCount :item="listData"></PlayCount>

          <div class="lsthd_icon">歌单</div>
        </div>
        <div class="list-desc-box">
          <div class="desc-name">{{ listData.name }}</div>
          <div class="blogger-box">
            <div class="blogger-icon">
              <img :src="creator.avatarUrl" />
            </div>
            <div class="blogger-nick">{{ creator.nickname }}</div>
          </div>
        </div>
      </div>

      <div class="list-title">歌曲列表</div>

      <ul class="musics-list-box">
        <ListItem
          v-for="(song, index) in lazyListDatas"
          :key="song.id"
          :song="song"
          @get-song="$emit('get-song', $event)"
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
  </div>
</template>

<script>
import PlayCount from "../components/PlayCount.vue";
import ListItem from "../components/ListItem.vue";

export default {
  name: "PlayList",

  props: ["currentSong", "pause"],

  data() {
    return {
      // 歌单列表id
      listId: null,
      // 歌曲列表数据
      listData: {},
      // 保存play-list-header的一些用户信息
      creator: {},
      // 保存所有歌曲详情信息的id
      idsStr: "",
      // 懒加载数据
      lazyListDatas: [],
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

  // created() {
  //   this.listId = this.$route.query.listId;

  //   this.getPlaylistDetail();
  // },

  // beforeRouteUpdate(){
  //   console.log(this.listId);
  // },

  // 由于加上了keepalive,像created这样的生命周期失效了，但有activated和deactivated切换的生命周期
  activated() {
    this.listId = this.$route.query.listId;
    this.getPlaylistDetail();

    // 调用懒加载获取更多歌曲的方法
    this.lazyLoading();

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
    PlayCount,
    ListItem,
  },

  methods: {
    // 获取歌单详情信息的方法
    getPlaylistDetail() {
      // 加载轻提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });

      this.axios({
        method: "get",
        url: "/playlist/detail",
        params: {
          id: this.listId,
        },
      })
        .then((result) => {
          this.listData = result.data.playlist;
          // console.log("this.listData =>", this.listData);
          // 保存play-list-header的一些用户信息
          this.creator = this.listData.creator;

          // 将获取到的歌曲id，拼接成字符串
          let trackIds = this.listData.trackIds;
          let idsArr = [];
          trackIds.forEach((item) => {
            idsArr.push(item.id);
          });

          // 保存所有歌曲详情信息的id
          this.idsStr = idsArr.join();

          // 调用获取歌曲详情的方法
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

    // 滑动来获取更多9条歌曲数据
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
      if(Math.abs(this.moveX) > Math.abs(this.moveY) && this.moveX < 0){ // 左滑
        this.goBack();
      }else if(Math.abs(this.moveX) > Math.abs(this.moveY) && this.moveX > 0){ // 右滑
        this.goBack();
      }
    },
    // 右滑返回上一页路由
    goBack() {
      // 显示导航栏
      this.$emit("update:isShowMainNav");
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>

.play-list {
  font-size: 17px;
  padding: 0 !important;

  .play-list-header {
    width: 100%;
    padding: 30px 10px 30px 15px;
    background: rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    position: relative;

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
      filter: blur(80px);
    }

    display: flex;

    .list-img {
      width: 126px;
      height: 126px;
      position: relative;
      img {
        width: 126px;
        height: 126px;
      }

      .lsthd_icon {
        position: absolute;
        top: 10px;
        left: 0;
        padding: 0 8px;
        height: 17px;
        color: #fff;
        font-size: 9px;
        text-align: center;
        line-height: 17px;
        background-color: rgba(217, 48, 48, 0.8);
        border-top-right-radius: 17px;
        border-bottom-right-radius: 17px;
      }
    }

    .list-desc-box {
      margin-left: 16px;

      .desc-name {
        color: #efefef;
        height: 45px;
      }

      .blogger-box {
        margin-top: 20px;
        font-size: 14px;
        color: hsla(0, 0%, 100%, 0.7);
        display: flex;

        .blogger-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 6px;
          img {
            width: 100%;
            height: 100%;
          }
        }

        .blogger-nick {
          width: 120px;
          line-height: 30px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .list-title {
    height: 23px;
    line-height: 23px;
    padding: 0 10px;
    font-size: 12px;
    color: #666;
    background-color: #eeeff0;
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