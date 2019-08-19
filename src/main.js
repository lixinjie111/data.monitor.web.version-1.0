// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import Qs from 'qs'


// Element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//导入video.js

import VideoPlayer  from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'

// import $ from 'jquery'
Vue.use(VideoPlayer);
//echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//高德地图
// import VueAMap from "vue-amap";
// Vue.use(VueAMap);

// VueAMap.initAMapApiLoader({
//   key: "8bf04484a44d846096c9ab84730e88b8",
//   plugin: [
//     "AMap.ElasticMarker"
//   ],
//   uiVersion: "1.0"
// });

// 权限
import { setAuthInfo, getAdminId, getAuthInfo, removeAuthInfo } from '@/cookie/index';

Vue.use(ElementUI)

// 全局静态资源
import './assets/css/reset.css';
import './assets/scss/public.scss';
import './assets/scss/element-ui-reset.scss';

// 设置页面切换进度条
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

Vue.config.productionTip = false;

/* eslint-disable no-new */
Vue.filter('toFixed',function (value,num) {
  value = Number(value);
  return value.toFixed(num);
});

// 时间戳转时间
import TDate from '@/assets/js/utils/date.js'
Vue.prototype.$dateUtil = TDate;


// 在免登录白名单，直接进入
const whiteList = ['/login','/404'];
setAuthInfo({
    userNo: "********",
    id: "********"
});
// removeAuthInfo();
// router global config
router.beforeEach((to,from,next) => {
    NProgress.start()
    // _hmt.push(['_trackPageview', to.fullPath]);
    const ADMINID = getAdminId();
    if(ADMINID) {
        // 回填用户信息
        store.dispatch('setAuthInfo', getAuthInfo());
        if(to.path === '/login') {
            next({path: '/'});
        }else {
            next();
        }
    }else {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
          next()
        } else {
          next('/login'); // 否则全部重定向到登录页
        }
        NProgress.done()
    }
})

router.afterEach(() => {
    NProgress.done()
})


 /* eslint-disable no-new */
const vm = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});

// axios 过滤器
import axiosFilter from './api/axiosConfig.js';
axiosFilter(vm);
