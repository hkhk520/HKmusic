<template>
  <div @click="$emit('toggle-show-lyric')" class="play-full-lyric">
    <ul
      class="lyric"
      ref="lyricBox"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
    ></ul>
  </div>
</template>

<script>
export default {
  name: "PlayFullLyric",

  props: ["currentSong", "audio"],

  data() {
    return {
      // 保存歌词
      formatLyric: null,
      // 记录开始触摸的clientY位置
      startY: 0,
      // 控制是否触摸了
      isTouch: false,
      // 计算移动了多少个li盒子
      liMoveNum: 0,
      // 保存当前歌曲播放时间的下一句歌词的下标
      i: 0,
    };
  },

  created() {
    this.getLyric();
  },

  // 当触摸滑动时，监听移动了多少个li盒子liMoveNum的变化
  watch: {
    liMoveNum() {
      this.lyricRoll();
    },
  },

  methods: {
    // 格式化获取到的歌词
    paresLyric(lyric) {
      // 正则表达式
      let patt = /\[\d{2}:\d{2}\.\d{2,3}\]/gi;
      let lyricArr = lyric
        .split("\n")
        .filter((e) => e)
        .map((str) => {
          let time = str.match(patt)[0].replace(/(\[|\])/gi, "");
          let timeArr = time.split(":");
          time = Number(timeArr[0]) * 60 + Number(timeArr[1]);
          let text = str.replace(patt, "");
          return { time, text };
        });
      return lyricArr;
    },

    // 歌词滚动的效果的方法
    lyricRoll() {
      // 获取歌曲当前的播放时间
      let currentTime = this.audio.currentTime;

      // 找到当前歌曲播放时间的下一句歌词的下标
      this.i = this.formatLyric.findIndex((element) => {
        return element.time > currentTime;
      });

      // 排他，先把其他的li的字体颜色设置为灰色
      let lis = this.$refs.lyricBox.querySelectorAll("li");
      for (let i = 0; i < lis.length; i++) {
        lis[i].style.color = "#999";
        lis[i].style.fontSize = "14px";
      }

      // 获取当前正在播放的li的高度
      // let curLiHeight = this.$refs.lyricBox.querySelectorAll("li")[this.i - 1]
      //   .offsetHeight;

      // 设置歌词盒子的margin-top
      this.$refs.lyricBox.style.marginTop =
        -30 * (this.i - 1) + 200 + "px";

      // // 获取歌词ul盒子的margin-top
      // let marginTop = this.$refs.lyricBox.offsetTop;
      // console.log(marginTop);
      // if (marginTop > 246) {
      //   // 当滑动到第一句歌词之前的临界值处理
      //   this.$refs.lyricBox.style.marginTop = 246 + "px";
      // } else if (marginTop < -1092) {
      //   // 当滑动到最后一句歌词之后的临界值处理
      //   this.$refs.lyricBox.style.marginTop = -1092 + "px";
      // }

      // 获取所有的li Dom对象
      let liDoms = this.$refs.lyricBox.querySelectorAll("li");

      // 设置当前播放的那一句的歌词字体颜色为高亮 和 字体变大
      liDoms[this.i - 1].style.color = "#dd001b";
      liDoms[this.i - 1].style.fontSize = "18px";
    },

    // 获取当前播放歌曲的歌词
    getLyric() {
      this.axios({
        method: "get",
        url: "/lyric",
        params: {
          id: this.currentSong.id,
        },
      })
        .then((response) => {
          let lyric = response.data.lrc.lyric;
          // 把请求到的歌词格式化成为我们所需要的格式
          this.formatLyric = this.paresLyric(lyric);
          console.log("this.formatLyric =>", this.formatLyric);

          this.formatLyric.forEach((item) => {
            // 遍历歌词，创建li，并追加到歌词盒子里面去
            let liDom = document.createElement("li");
            liDom.innerText = item.text ? item.text : "----";
            liDom.style["marginBottom"] = "14px";
            liDom.style["fontSize"] = "14px";

            this.$refs.lyricBox.appendChild(liDom);

            // 进去歌词界面时，实时更新歌词的位置
            this.audio.ontimeupdate = () => {
              // 如果存在歌词盒子，才进行改变，不存在就不改变
              if (this.$refs.lyricBox) {
                // 不触摸才让歌词滚动
                if (!this.isTouch) {
                  // 调用歌词滚动的效果的方法
                  this.lyricRoll();
                }
              }
            };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 触摸歌词盒子开始的方法
    touchstart(event) {
      // 记录开始触摸的起始clientY的位置
      this.startY = event.touches[0].clientY;
      // 触摸为true
      this.isTouch = true;
    },

    touchmove(event) {
      // 记录移动了多少clientY
      let moveY = event.touches[0].clientY - this.startY;
      // 计算移动了多少个li盒子
      this.liMoveNum = Math.floor(moveY / 30);
      // console.log(this.liMoveNum);
    },

    touchend() {
      // if(this.formatLyric[this.i - 1 + this.liMoveNum]){
      //   this.audio.currentTime = this.formatLyric[this.i - 1 + this.liMoveNum].time;
      // }else{
      //   this.audio.currentTime = 0;
      // }
      // // 触摸为false
      // this.isTouch = false;
    },
  },
};
</script>

<style lang="less" scoped>
.play-full-lyric {
  width: 100vw;
  height: 74vh;
  margin-top: 4px;
  overflow: hidden;

  ul.lyric {
    color: #999;
    width: 100vw;
    text-align: center;
    margin-top: 50%;
    transition: all 1s;
  }
}
</style>