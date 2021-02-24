<template>
  <div class="search" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
    <!-- 头部 start -->
    <div class="search-header">
      <div class="input-box">
        <img src="../assets/images/sousuo.png" />
        <input
          type="text"
          placeholder="搜索歌曲、歌手、专辑"
          v-model.trim="inputValue"
          @input="inputHandler"
          ref="inputDom"
          @keyup.enter="setStorage(inputValue)"
          @focus="inputFocus"
        />
        <img src="../assets/images/inputdel.png" class="input-del" v-show="inputValue" @click.stop="emptyInput"/>
      </div>
    </div>
    <!-- 头部 end -->

    <!-- 热门搜索 start -->
    <div class="hot-search-box" v-if="isShowHot && !isSearchResult">
      <div class="hot-title">热门搜索</div>
      <ul class="hot-container clearfix">
        <li v-for="(item, index) in hotsListDatas" :key="index" @click="goValueDetail(item)">
          {{ item.first }}
        </li>
      </ul>

      <!-- 搜索的本地缓存展示 start -->
      <ol class="storage">
        <li
          v-for="item in historyMessageArr"
          :key="item.id"
          @click="goValueDetail(item)"
        >
          <div><img src="../assets/images/clock.png" /></div>
          <span
            >{{ item.text
            }}<img src="../assets/images/x.png" @click.stop="delItem(item)"
          /></span>
        </li>
      </ol>
      <!-- 搜索的本地缓存展示 end -->
    </div>
    <!-- 热门搜索 end -->

    <!-- input输入请求到的数据展示的盒子 start -->
    <div class="input-search-box" v-if="!isShowHot && !isSearchResult">
      <div class="input-search-value">搜索"{{ inputValue }}"</div>
      <ul class="input-search-container" ref="ulDom" v-if="!isShowVoice">
        <li v-for="(item, index) in inputListsongs" :key="index" @click="goValueDetail(item)">
          <div><img src="../assets/images/sousuo.png" /></div>
          <span>{{ item.keyword }}</span>
        </li>
      </ul>

      <!-- 展示请求前的动画 start -->
      <Voice :isShowVoice="isShowVoice"></Voice>
      <!-- 展示请求前的动画 end -->
    </div>
    <!-- input输入请求到的数据展示的盒子 end -->

    <!-- 点击关键词，渲染对应的歌曲列表的盒子 start -->
    <SearchBestMatch :isSearchResult="isSearchResult" :singerBoxData="singerBoxData" :songsListDatas="songsListDatas" :currentSong="currentSong" :pause="pause" @get-song="$emit('get-song', $event)" :isShowVoice="isShowVoice" :singerId="singerId" @update:isShowMainNav="$emit('update:isShowMainNav')"></SearchBestMatch>
    <!-- 点击关键词，渲染对应的歌曲列表的盒子 end -->
  </div>
</template>

<script>
import Voice from '../components/Voice.vue';
import SearchBestMatch from "../components/SearchBestMatch.vue";
export default {
  name: "Search",

  props: ["currentSong","pause"],

  data() {
    return {
      // 保存热门搜索的li列表数据
      hotsListDatas: [],
      // 记录input输入框的输入的值
      inputValue: "",
      // 控制是否显示热门搜索的默认列表盒子
      isShowHot: true,
      // input时请求到的歌曲数据
      inputListsongs: [],
      // 保存延时器的状态
      timer: null,
      // 控制展示动画效果
      isShowVoice: true,
      // 保存历史搜索记录的数组
      historyMessageArr: [],
      // 记录每一个历史记录的id
      messageId: 0,
      // 控制是否显示搜索结果列表
      isSearchResult: false,
      // 歌手盒子信息
      singerBoxData: {},
      // 记录歌手id
      singerId: 0,
      // 搜索结果列表数据
      songsListDatas: [],
      // 没有图片，使用默认的图片
      picUrl: require('../assets/images/default.jpg'),
      // 触摸的起始点
      startX: null,
      startY: null,
      // 触摸移动的X、Y距离
      moveX: null,
      moveY: null,
    };
  },

  // 注册组件
  components: {
    Voice,
    SearchBestMatch,
  },

  created() {
    // 调用获取热门搜索列表的数据
    this.getSearchHot();
  },

  // activated() {
  //   this.moveX = null;
  // },

  // 挂载的生命周期钩子
  mounted() {
    // 自动获取焦点
    this.$refs.inputDom.focus();
  },

  // 由于使用了keep-alive 所以除第一次进来之后的切换的生命周期会无效，但有activated和deactivated
  activated() {
    // 自动获取焦点
    this.$refs.inputDom.focus();
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
      // 右滑
      if(Math.abs(this.moveX) > Math.abs(this.moveY) && this.moveX > 0){
        this.goHot();
      }
      // 把触摸移动的X、Y距离置空
      this.moveX = null;
      this.moveY = null;
    },
    // 右滑去到热歌榜页面路由
    goHot(){
      this.$router.push({name: "Hot"});
      this.$emit("update:currentIndex",1);
    },

    // 获取热门搜索的列表的简略数据
    getSearchHot() {
      // 加载轻提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      this.axios({
        method: "get",
        url: "/search/hot",
      })
        .then((response) => {
          this.hotsListDatas = response.data.result.hots;
          console.log("this.hotsListDatas =>", this.hotsListDatas);
          this.$toast.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 点击清空input的value的方法
    emptyInput(){
      this.inputValue = "";
      // 显示热门搜索盒子
      this.isShowHot = true;
      // 不显示搜索结果数据列表
      this.isSearchResult = false;
      // 自动获取焦点
      this.$refs.inputDom.focus();
    },

    // 监听input框输入时
    inputHandler() {
      // 使用延时器来实现防抖
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);

        // 显示红色跳动的动画
        this.isShowVoice = true;

        // 如果input框的value值不为空就请求数据
        if (this.inputValue) {
          // 不显示热门搜索盒子
          this.isShowHot = false;

          // 根据input框的value值来请求数据
          this.$axios({
            method: "get",
            url: "/search/suggest",
            params: {
              type: "mobile",
              keywords: this.inputValue,
            },
          })
            .then((response) => {
              this.inputListsongs = response.data.result.allMatch;
              console.log("this.inputListsongs =>", this.inputListsongs);
              // 不显示红色跳动的动画
              this.isShowVoice = false;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          // 显示热门搜索盒子
          this.isShowHot = true;
        }
      }, 380);
    },

    // 当修改input框的value后，按下enter后松开，或者点击了热门搜索的词， 或者点击了历史记录的词， 就把数据存到本地缓存中去
    setStorage(transmitText) {
      // 先判断本地缓存中是否有该数组
      let messageArr = localStorage.getItem("historyMessageArr");
      // 存在该缓存数组
      if (messageArr) {
        // 如果输入的值一样，则先找到对应的下标
        let index = this.historyMessageArr.findIndex((item) => {
          return item.text == transmitText;
        });

        // 当本地缓存中有一样的数据时，先删除该数据
        if (index != -1) {
          // 先把本地缓存中已经一样的删除
          this.historyMessageArr.splice(index, 1);
        }
      }

      // 再在最前面添加一个输入的值
      this.historyMessageArr.unshift({
        id: this.messageId,
        text: transmitText,
      });
      // id要累加
      this.messageId++;

      console.log("this.historyMessageArr =>", this.historyMessageArr);

      // 默认localStorage只能存取字符串, 所以先把数据转成json类型，再存到本地缓存中去
      localStorage.setItem(
        "historyMessageArr",
        JSON.stringify(this.historyMessageArr)
      );
    },

    // 点击了历史记录每一项的x，就删除该项
    delItem(item) {
      // 先拿到本地缓存中的数组
      let messageArr = JSON.parse(localStorage.getItem("historyMessageArr"));
      // 找到id相同的那一项
      let index = messageArr.findIndex((value) => {
        return item.id == value.id;
      });
      // 删除id相同的那一项
      messageArr.splice(index, 1);
      // 存到本地缓存中去
      localStorage.setItem("historyMessageArr", JSON.stringify(messageArr));
      // 保存到渲染的数据中去
      this.historyMessageArr = messageArr;
    },

    // 点击历史记录 或 热门搜索的词 或 input输入请求的推荐搜索词，获取对应的详细数据的方法
    goValueDetail(item) {
      // 显示搜索结果数据列表
      this.isSearchResult = true;

      // 显示红色跳动的动画
      this.isShowVoice = true;

      // 赋值input框的value值
      this.inputValue = item.text || item.first || item.keyword;

      // 请求歌手盒子的数据
      this.$axios({
        method: "get",
        url: "/search",
        params: {
          keywords: item.text || item.first || item.keyword,
          type: 100,
        },
      })
        .then((response) => {
          // 如果请求不到数据，就使用默认的
          if(response.data.result.artists.length == 0){
            this.singerBoxData = {
              img1v1Url: this.picUrl,
              name: "黄恺"
            }
          }else{ // 请求到数据了
            this.singerBoxData = response.data.result.artists[0];
            this.singerId = this.singerBoxData.id;
          }
          console.log('this.singerBoxData =>',this.singerBoxData);
        })
        .catch((err) => {
          console.log(err);
        });

      // 根据关键词请求对应的歌曲数据
      this.$axios({
        method: "get",
        url: "/search",
        params: {
          keywords: item.text || item.first || item.keyword,
        },
      })
        .then((response) => {
          this.songsListDatas = response.data.result.songs;
          // 由于请求回来的数据没有picUrl，所以自己添加一个默认的picUrl
          this.songsListDatas.map( item => {
            item.picUrl = this.picUrl;
          });

          console.log("this.songsListDatas =>", this.songsListDatas);

          // 不显示红色跳动的动画
          this.isShowVoice = false;
        })
        .catch((err) => {
          console.log(err);
        });

      // 调用存数据到本地缓存的方法
      this.setStorage(item.text || item.first || item.keyword);
    },

    // 当input框有焦点时 触发的方法
    inputFocus(){
      // 不显示搜索结果数据列表
      this.isSearchResult = false;

      // 手动调用监听input框的方法
      this.inputHandler();
    }
  },
};
</script>

<style lang="less" scoped>
.search {
  background-color: #fcfcfd;
  width: 100vw;
  height: 100vh;
  .search-header {
    padding: 18px 15px;
    border-bottom: 1px solid #e7e7e7;
    box-sizing: border-box;
    width: 100%;

    .input-box {
      display: flex;
      width: 100%;
      background-color: #f5f1f1;
      align-items: center;
      border-radius: 16px;
      overflow: hidden;
      position: relative;

      img {
        width: 18px;
        height: 18px;
        margin: 0 6px;
      }

      input[type="text"] {
        flex: 1;
        height: 32px;
        border: none;
        background-color: rgba(255, 255, 255, 0.1);

        // 修改input占位符的样式
        &::-webkit-input-placeholder {
          font-size: 14px;
          color: rgb(211, 203, 203);
        }
      }

      .input-del{
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
    }
  }

  .hot-search-box {
    .hot-title {
      font-size: 12px;
      color: #666666;
      padding: 14px 10px 10px;
      box-sizing: border-box;
    }

    ul.hot-container {
      width: 100vw;
      padding: 0 10px;
      box-sizing: border-box;

      li {
        float: left;
        margin: 0 10px 10px 0;
        padding: 6px 12px;
        box-shadow: 0 0 1px 1px rgb(226, 224, 224);
        border-radius: 18px;
        box-sizing: border-box;
        font-size: 14px;
      }

      // 给ul加上一个清除浮动的类名
      &.clearfix::after {
        content: "";
        display: block;
        clear: both;
        overflow: hidden;
      }
    }

    .storage {
      margin-top: 10px;
      li {
        display: flex;

        div {
          height: 45.8px;
          display: flex;
          align-items: center;

          img {
            width: 18px;
            height: 18px;
            margin: 0 10px;
            vertical-align: bottom;
          }
        }

        span {
          border-bottom: 1px solid rgb(230, 230, 230);
          width: 100%;
          padding: 12px 0;
          font-size: 15px;

          img {
            width: 14px;
            height: 14px;
            margin-right: 18px;
            vertical-align: bottom;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }
  }

  .input-search-box {
    .input-search-value {
      padding: 16px 0;
      margin-left: 12px;
      border-bottom: 1px solid rgb(219, 219, 219);
      color: #507daf;
    }

    .input-search-container {
      li {
        display: flex;

        div {
          height: 45.8px;
          display: flex;
          align-items: center;

          img {
            width: 18px;
            height: 18px;
            margin: 0 8px;
            vertical-align: bottom;
          }
        }

        span {
          border-bottom: 1px solid rgb(219, 219, 219);
          width: 100%;
          padding: 12px 0;
          font-size: 15px;
        }
      }
    }
  }

}

</style>