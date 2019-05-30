import Vue from 'vue'
import Router from 'vue-router'

/* 默认路由，不要删除 */
const Login = resolve => require(['@/views/login/index'], resolve)
const Home = resolve => require(['@/views/home/index'], resolve)
const Err404 = resolve => require(['@/views/error/404'], resolve)


const DataMonitor = resolve => require(['@/views/dataMonitor/index'], resolve)
const CarMonitor = resolve => require(['@/views/carMonitor/index'], resolve)
const SingleCarMonitor = resolve => require(['@/views/carMonitor/singleCarMonitor'], resolve)
const RoadMonitor = resolve => require(['@/views/roadMonitor/index'], resolve)
const EquipmentMonitor = resolve => require(['@/views/equipmentMonitor/index'], resolve)
const MonitorManage = resolve => require(['@/views/monitorManage/index'], resolve)
const MonitorVideo = resolve => require(['@/views/monitorManage/monitorVideo.vue'], resolve)


const EchartsTest = resolve => require(['@/views/test/echarts'], resolve)
const MapTest = resolve => require(['@/views/test/map'], resolve)
const videoTest = resolve => require(['@/views/test/video'], resolve)
const MarkerTest = resolve => require(['@/views/test/marker'], resolve)


Vue.use(Router)

export default new Router({
  // mode: 'history',
  linkActiveClass:'is-active',
  routes: [{
    path: '/login',
    name: 'Login',
    component: Login,
    // component: () => import('@/pages/home/Home'),
    meta: {}
  },{
    path: '*',
    name: '404',
    component: Err404,
    meta: {
      showHeader: true
    }
  },{
    path: '/dataMonitor',
    name: 'DataMonitor',
    component: DataMonitor,
    meta: {
      showHeader: true
    }
  },{
    path: '/carMonitor',
    name: 'CarMonitor',
    component: CarMonitor,
    meta: {
      showHeader: true
    }
  },{
    path: '/singleCarMonitor/:vehicleId',
    name: 'SingleCarMonitor',
    component: SingleCarMonitor,
    meta: {
      showHeader: false
    }
  },{
    path: '/roadMonitor',
    name: 'RoadMonitor',
    component: RoadMonitor,
    meta: {
      showHeader: true
    }
  },{
    path: '/equipmentMonitor',
    name: 'EquipmentMonitor',
    component: EquipmentMonitor,
    meta: {
      showHeader: true
    }
  },{
    path: '/test/echarts',
    name: 'EchartsTest',
    component: EchartsTest,
    meta: {
      showHeader: true
    }
  },{
    path: '/test/map',
    name: 'MapTest',
    component: MapTest,
    meta: {
      showHeader: true
    }
  },{
    path: '/videoTest',
    name: 'VideoTest',
    component: videoTest,
    meta: {
      showHeader: false
    }
  },{
    path: '/markerTest',
    name: 'MarkerTest',
    component: MarkerTest,
    meta: {
      showHeader: false
    }
  },{
    path: '/',
    name: 'Home',
    component: Home,
    // component: () => import('@/pages/home/Home'),
    meta: {
      showHeader: true
    }
  },{
    path: '/monitorManage',
    name: 'MonitorManage',
    component: MonitorManage,
    // component: () => import('@/pages/home/Home'),
    meta: {
      showHeader: false
    }
  },{
    path: '/monitorVideo',
    name: 'MonitorVideo',
    component: MonitorVideo,
    // component: () => import('@/pages/home/Home'),
    meta: {
      showHeader: false
    }
  }],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
