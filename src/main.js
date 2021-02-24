import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'

// 导入Vue移动端左右滑屏幕返回的插件
import touch from 'vue-directive-touch';
// vue-directive-touch提供了以下事件类型：
// 单击： v-touch:tap
// 长按： v-touch:long
// 左滑： v-touch:left
// 右滑： v-touch:right
// 上滑： v-touch:up
// 下滑： v-touch:down

// 导入vant的轻提示插件
import { 
  Toast, 
  Swipe, 
  SwipeItem 
} from 'vant';

// 注册插件
Vue.use(touch)
  .use(Toast)
  .use(Swipe)
  .use(SwipeItem);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),

  data: {
    isShowLoading: false
  },

}).$mount('#app')
