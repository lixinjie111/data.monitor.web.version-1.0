// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import Qs from 'qs'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 权限
import { setAuthInfo, getAdminId, getAuthInfo, removeAuthInfo } from '@/session/index.js';

// 全局静态资源
import './assets/css/reset.css';
import './assets/scss/public.scss';
import './assets/scss/element-ui-reset.scss';
import './assets/icon-font/iconfont.css';

import AddScriptJs from '@/assets/js/utils/addScriptJs';

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
// setAuthInfo({
//     userNo: "********",
//     id: "********"
// });
// axios 过滤器
import  axiosFilter from './api/axiosConfig.js';

//取消请求的对象
window.cancleSource={};
window.cancelToken = axios.CancelToken;
// 路由拦截器
router.beforeEach((to, from, next) => {
    window.cancleSource.cancel && window.cancleSource.cancel()
    window.cancleSource = window.cancelToken.source()
    NProgress.start()
    // _hmt.push(['_trackPageview', to.fullPath]);
    const ADMINID = getAdminId();
    if(ADMINID) {//已登录
        // 回填用户信息
        store.dispatch('setAuthInfo', getAuthInfo());
        AddScriptJs.add("gaodeMap", window.scriptJs.gaodeMapUrl, function() {
            AddScriptJs.add("livePlayer", window.scriptJs.livePlayerUrl, function() {
                if(to.path === '/login') {
                    next({path: '/dataMonitor'});
                }else {
                    next();
                }
            });
        });
    }else {//未登录
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
axiosFilter(vm);
