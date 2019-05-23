import Vue from 'vue'
import Router from 'vue-router'

/* 默认路由，不要删除 */
const Login = resolve => require(['@/views/login/index'], resolve)
const Home = resolve => require(['@/views/home/index'], resolve)
const Err404 = resolve => require(['@/views/error/404'], resolve)


const DataMonitor = resolve => require(['@/views/dataMonitor/index'], resolve)
const DataViewMonitor = resolve => require(['@/views/dataMonitor/view'], resolve)
const CarMonitor = resolve => require(['@/views/carMonitor/index'], resolve)
const CarViewMonitor = resolve => require(['@/views/carMonitor/view'], resolve)
const SingleCarMonitor = resolve => require(['@/views/carMonitor/singleCarMonitor'], resolve)
const RoadMonitor = resolve => require(['@/views/roadMonitor/index'], resolve)
const RoadViewMonitor = resolve => require(['@/views/roadMonitor/view'], resolve)
const CloudMonitor = resolve => require(['@/views/cloudMonitor/index'], resolve)
const CloudViewMonitor = resolve => require(['@/views/cloudMonitor/view'], resolve)
const AlertMonitor = resolve => require(['@/views/alertMonitor/index'], resolve)
const AlertViewMonitor = resolve => require(['@/views/alertMonitor/view'], resolve)
const MonitorManage = resolve => require(['@/views/monitorShow/index'], resolve)



const EchartsTest = resolve => require(['@/views/test/echarts'], resolve)
const MapTest = resolve => require(['@/views/test/map'], resolve)


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
    path: '/dataMonitor/view',
    name: 'DataViewMonitor',
    component: DataViewMonitor,
    meta: {
      showHeader: false
    }
  },{
    path: '/carMonitor',
    name: 'CarMonitor',
    component: CarMonitor,
    meta: {
      showHeader: true
    }
  },{
    path: '/carMonitor/view',
    name: 'CarViewMonitor',
    component: CarViewMonitor,
    meta: {
      showHeader: false
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
    path: '/roadMonitor/view',
    name: 'RoadViewMonitor',
    component: RoadViewMonitor,
    meta: {
      showHeader: false
    }
  },{
    path: '/cloudMonitor',
    name: 'CloudMonitor',
    component: CloudMonitor,
    meta: {
      showHeader: true
    }
  },{
    path: '/cloudMonitor/view',
    name: 'CloudViewMonitor',
    component: CloudViewMonitor,
    meta: {
      showHeader: false
    }
  },{
    path: '/alertMonitor',
    name: 'AlertMonitor',
    component: AlertMonitor,
    meta: {
      showHeader: true
    }
  },{
    path: '/alertMonitor/view',
    name: 'AlertViewMonitor',
    component: AlertViewMonitor,
    meta: {
      showHeader: false
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
  }],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
