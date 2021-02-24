import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: "/main",
    name: "Main",
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: "recommend",
        name: "Recommend",
        component: () => import('../views/Recommend.vue')
      },
      {
        path: "hot",
        name: "Hot",
        component: () => import('../views/Hot.vue')
      },
      {
        path: "search",
        name: "Search",
        component: () => import('../views/Search.vue')
      },
      {
        path: "/playlist",
        name: "PlayList",
        component: () => import('../views/PlayList.vue')
      },
      {
        path: "/singerdesc",
        name: "SingerDesc",
        component: () => import('../views/SingerDesc.vue')
      },
    ]
  },


  // 路由重定向
  {
    path: "*",
    redirect: {
      name: 'Recommend'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
