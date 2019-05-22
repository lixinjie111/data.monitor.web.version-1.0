// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import axios from 'axios'
import Qs from 'qs'

axios.defaults.withCredentials = true;

// Element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//高德地图
import VueAMap from "vue-amap";
Vue.use(VueAMap);

VueAMap.initAMapApiLoader({
  key: "8bf04484a44d846096c9ab84730e88b8",
  plugin: [
    "AMap.ElasticMarker"
  ],
  uiVersion: "1.0"
});

// 权限
import { setAuthInfo, getAdminId, getAuthInfo, removeAuthInfo } from '@/utils/auth';

Vue.use(ElementUI)
Vue.prototype.$http = axios;

// 全局静态资源
import './assets/css/reset.css';
import './assets/scss/public.scss';

// 设置页面切换进度条
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

Vue.config.productionTip = false;

// axios 过滤器
axiosFilter();

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
    adminName: "shilu",
    adminId: "123456"
});
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

// 避免在账号登录失效后提示多次
let isOutLogin = true;

/**
 * axios过滤器
 */
function axiosFilter() {
    // request
    axios.create({
      baseURL: cfg.url,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      responseType: 'json',
      transformResponse: [function(data) { //后端发送过来的数据
        return data;
      }],
      transformRequest: [function(data) {
        return data;
      }]
    });
    // axios.interceptors.request.use(
    //     config => {
    //         config.headers['Content-Type'] = 'application/json;charset=UTF-8';

    //         if (config.method == 'post') {
    //             config.data = {
    //                 ...config.data,
    //                 _t: Date.parse(new Date()) / 1000,
    //             }
    //         } else if (config.method == 'get') {
    //             config.params = {
    //                 _t: Date.parse(new Date()) / 1000,
    //                 ...config.params
    //             }
    //         }
    //         config.data = Qs.stringify(config.data);
    //         return config
    //     },
    //     function(error) {
    //         return Promise.reject(error)
    //     }
    // )

    // response
    axios.interceptors.response.use(function(response) {
        // 全局报错信息
        if(response.data.msg && response.data.status != '200') {
            vm.$message.error(response.data.msg);
        }
        // 失去效果登录
        if(isOutLogin && (response.data.status == '204')) {
            isOutLogin = false;
            vm.$confirm(response.data.msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeAuthInfo();
                store.dispatch('ClearMenuList');
                window.location.href = '/'
                isOutLogin = true;
            }).catch(() => {
                removeAuthInfo();
                store.dispatch('ClearMenuList');
                window.location.href = '/'
                isOutLogin = true;
            });
        }
        return response;
    }, function(error) {
        // Do something with response error
        if(error.config.url.indexOf('getMenuList') != '-1'){
            vm.$alert('登录已过期，请重新登录', '', {
                confirmButtonText: '确定',
                callback: action => {
                    removeAuthInfo();
                    window.location.href = '/'
                    isOutLogin = true;
                }  
            });
        }else{
            return Promise.reject(error)
        }
    });
}

 /* eslint-disable no-new */
const vm = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
