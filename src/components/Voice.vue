<template>
  <div class="voice-box">
    <!-- 展示请求前的动画 start -->
    <div class="dongle" v-if="isShowVoice">
      <span class="voice">
        <!-- pause用来控制 暂停时，停止动画效果 -->
        <i class="first"></i>
        <i class="second"></i>
        <i class="three"></i>
        <i class="four"></i>
      </span>
    </div>
    <!-- 展示请求前的动画 end -->
  </div>
</template>

<script>
export default {
  name: "Voice",

  props: ["isShowVoice"]
};
</script>

<style lang="less" scoped>
.dongle {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 100px;
}
.voice {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 22px;
  height: 27px;
  padding: 0 10px;

  i {
    display: inline-block;
    border-left: 2px solid #dd001b;
    margin: 0 1px;
  }

  .first {
    height: 8px;
    animation: first 0.4s linear 0s infinite alternate;
  }

  .second {
    height: 4px;
    animation: second 0.8s linear 0s infinite alternate;
  }

  .three {
    height: 6px;
    animation: three 0.6s linear 0s infinite alternate;
  }

  .four {
    height: 12px;
    animation: four 0.4s linear 0s infinite alternate;
  }

  @keyframes first {
    0% {
      height: 4px;
    }

    50% {
      height: 8px;
    }

    100% {
      height: 10px;
    }
  }

  @keyframes second {
    0% {
      height: 12px;
    }

    50% {
      height: 9px;
    }

    100% {
      height: 7px;
    }
  }

  @keyframes three {
    0% {
      height: 14px;
    }

    50% {
      height: 12px;
    }

    100% {
      height: 10px;
    }
  }

  @keyframes four {
    0% {
      height: 10px;
    }

    50% {
      height: 8px;
    }

    100% {
      height: 5px;
    }
  }
}
</style>