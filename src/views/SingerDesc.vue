<template>
  <div class="singer-desc" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
    <div class="singer-desc-header">
      <img :src="artist.picUrl" />
      <div class="mask"></div>
      <div class="artist-info-box">
        <div class="name">{{ artist.name }}</div>
        <div class="rank">歌手榜华语地区 No.1</div>
        <div class="simple">
          <p class="nickname">昵称：{{ artist.name }}</p>
          <p class="follow">
            <span>
              <span class="followCnt"
                >关注 <span class="count">{{ artist.topicPerson }}</span></span
              >
              <span class="fansCnt"
                >粉丝 <span class="count">1127.4万</span></span
              >
            </span>
          </p>
          <p class="identities-area">
            <span class="identifyTag">入驻艺人</span>
          </p>
        </div>
      </div>
    </div>
    <h2>歌手简介</h2>
    <div class="intro">
      <p :class="{ hidden: isnotFull }">{{ artist.briefDesc }}</p>
      <div class="full" @click="isnotFull = !isnotFull">
        {{ fullDesc }} <img :src="fullIcon" />
      </div>
    </div>
    <h2 style="margin-top: 8px">热门单曲</h2>

    <ul class="singer-hot-box">
      <ListItem
        v-for="(song, index) in hotSongs"
        :key="song.id"
        :song="song"
        @get-song="$emit('get-song', song)"
        :currentSong="currentSong"
        :class="{ active: currentSong.id === song.id }"
        :pause="pause"
      >
        <div class="num" :class="{ 'top-three': index < 3 }">
          {{ (index + 1) | newIndex }}
        </div>
      </ListItem>

      <!-- 显示懒加载的盒子 -->
      <!-- <li class="lazy-loading-box">
        <div v-if="moreShowBoolen" class="more">tips：滚动加载更多</div>
        <div v-else class="no-more" ref="noMore">已无更多</div>
      </li> -->
    </ul>
  </div>
</template>

<script>
import ListItem from "../components/ListItem.vue";

export default {
  name: "SingerDesc",

  props: ["currentSong","pause"],

  data() {
    return {
      // 记录歌手id
      singerId: 0,
      // 歌手信息数据
      artist: {},
      // 热门单曲数据
      hotSongs: [],
      // 控制完整显示歌手的简介内容
      isnotFull: true,
      // 触摸的起始点
      startX: null,
      startY: null,
      // 触摸移动的X、Y距离
      moveX: null,
      moveY: null,
    };
  },

  components: {
    ListItem,
  },

  activated() {
    // 获取路由传递过来的歌手id
    this.singerId = this.$route.query.singerId;

    // 调用获取歌手信息和热门单曲的数据的方法
    this.getSingerDesc();

    // 把触摸移动的X、Y距离置空
    this.moveX = null;
    this.moveY = null;
  },

  computed: {
    fullDesc() {
      return this.isnotFull ? "完整歌手介绍" : "收起";
    },
    fullIcon() {
      return this.isnotFull
        ? require("../assets/images/down.png")
        : require("../assets/images/up.png");
    },
  },

  // 过滤器
  filters: {
    // 补0
    newIndex(oldIndex) {
      return oldIndex < 10 ? "0" + oldIndex : oldIndex;
    },
  },

  methods: {
    // 请求歌手信息和热门单曲的数据
    getSingerDesc() {
      // 加载轻提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });

      // 请求歌手信息和热门单曲的数据
      this.$axios({
        method: "get",
        url: "/artists",
        params: {
          id: this.singerId,
        },
      })
        .then((response) => {
          this.artist = response.data.artist;
          console.log("this.artist =>", this.artist);
          this.hotSongs = response.data.hotSongs.slice(0, 10);
          console.log("this.hotSongs =>", this.hotSongs);

          // 关闭轻提示
          this.$toast.clear();
        })
        .catch((err) => {
          console.log(err);
          // 关闭轻提示
          this.$toast.clear();
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
      // Math.abs(X) > Math.abs(Y) && X > 0
      if(Math.abs(this.moveX) > Math.abs(this.moveY) && this.moveX < 0){ // 左滑
        this.goBack();
      }else if(Math.abs(this.moveX) > Math.abs(this.moveY) && this.moveX > 0){ // 右滑
        this.goBack();
      }
    },
    // 左、右滑 返回上一个路由
    goBack(){
      // 显示导航栏
      this.$emit("update:isShowMainNav");
      this.$router.go(-1);
    }
  },
};
</script>

<style lang="less" scoped>
.singer-desc {
  background-color: #fcfcfd;

  padding: 0 !important;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;

  .singer-desc-header {
    width: 100vw;
    height: 300px;
    position: relative;

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 300px;
    }

    .mask {
      position: absolute;
      background: rgba(0, 0, 0, 0.2);
      width: 100%;
      height: 300px;
      top: 0;
      left: 0;
    }

    .artist-info-box {
      position: absolute;
      left: 16px;
      bottom: 30px;
      color: #fff;
      z-index: 2;

      .name {
        font-size: 20px;
      }
      .rank {
        margin-top: 15px;
        font-size: 13px;
      }
      .simple {
        margin-top: 15px;
        opacity: 0.8;
        font-size: 12px;
        line-height: 12px;

        p {
          margin-top: 10px;
          font-size: 13px;
        }
      }
      .follow {
        .followCnt {
          margin-right: 10px;

          .count {
            margin-left: 4px;
          }
        }
      }
    }
  }

  h2 {
    font-size: 18px;
    z-index: 2;
    padding: 15px;
    background: #fff;
    font-weight: 700;
    background-color: #fff;
  }

  .intro {
    padding: 0 16px 18px;
    font-size: 14px;
    color: #666;
    background-color: #fff;

    p {
      &.hidden {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
      }
    }

    .full {
      margin-top: 25px;
      text-align: center;

      img {
        width: 12px;
        height: 12px;
      }
    }
  }

  .singer-hot-box{
    background-color: #fff;
    padding-bottom: 52px;
  }
}
</style>