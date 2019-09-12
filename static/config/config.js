window.config = {
    //公司测试 外网地址
    url: 'http://120.133.21.14:9093/monPlatApp/', //监控平台
    operateUrl: 'http://120.133.21.14:9090/operateApp/', //运营平台
    websocketUrl:'ws://120.133.21.14:49982/mon',  //监控
    socketUrl:'ws://120.133.21.14:49999/ws',  //影子系统
    dlUrl: 'http://113.208.118.62:8085/', //迪路
    dlWmsUrl: 'http://113.208.118.62:8080/', //迪路

    //上海正式环境  内网-IP
    // url: 'http://172.16.1.199:9093/monPlatApp/', //监控平台
    // operateUrl: 'http://172.16.1.197:9090/operateApp/', //运营平台
    // websocketUrl:'ws://172.16.1.199:9982/mon',  //监控
    // socketUrl:'ws://172.16.1.198:9999/icv',  //影子系统
    // dlUrl: 'http://172.16.1.197:8085/', //迪路
    // dlWmsUrl: 'http://172.16.1.197:8080/', //迪路

    //上海正式环境  内网-主机名
    // url: 'http://app03:9093/monPlatApp/', //监控平台
    // operateUrl: 'http://app01:9090/operateApp/', //运营平台
    // websocketUrl:'ws://app03:9982/mon',  //监控
    // socketUrl:'ws://app02:9999/icv',  //影子系统
    // dlUrl: 'http://app01:8085/', //迪路
    // dlWmsUrl: 'http://app01:8080/', //迪路

    //上海正式环境  外网
    // url: 'http://116.236.72.204:49093/monPlatApp/', //监控平台
    // operateUrl: 'http://116.236.72.204:49090/operateApp/', //运营平台
    // websocketUrl:'ws://116.236.72.204:49982/mon',  //监控
    // socketUrl:'ws://116.236.72.204:49999/icv',  //影子系统
    // dlUrl: 'http://116.236.72.204:48085/', //迪路
    // dlWmsUrl: 'http://116.236.72.204:48080/', //迪路

    version: 1.0,       // 版本号
}
//地图额外配置项添加
window.mapOption = {
	// center: [121.551976, 31.276054],	//上海-高德地图坐标点
	// center: [113.07876,28.255618],	//长沙-高德地图坐标点
    mapStyleEmpty: "amap://styles/b7a754e1a4bd3ea61bfe80668b2f98ce", // 纯灰色背景地图 路口
    defaultCenterPoint :  [121.262939,31.245149],   // 上海默认中心点 --- 高德坐标点
    centerPoint :  [121.17265957261286,31.284096076877844],     // 数据概览 中心点位置(获取地理位置计算天气) --- 高德坐标点
    singlePoint:[121.18653381418872,31.274421462567677],    // 单车监控 大地图中心点 --- 高德坐标点
};

window.defaultMapOption = {
	center: window.mapOption.defaultCenterPoint,
	zoom: 11,		// 默认：比例尺显示100m
	resizeEnable: true, //是否监控地图容器尺寸变化
	rotateEnable: true,
	mapStyle: "amap://styles/78d617ebfc385fd27f9c6b6469ac954f"
}
//路网配置参数
window.dlWmsOption = {
    'LAYERS_dlzc': 'shanghai_qcc:gd_dlzc',
    'LAYERS_gjlk': 'shanghai_qcc:dl_shcsq_wgs84_gjlk',
    'LAYERS_centerline': 'shanghai_qcc:gd_road_centerline',
    'LAYERS_laneavgspeed': 'shanghai_qcc:dl_shcsq_wgs84_laneavgspeed',
    'STYLES':'shanghai_qcc:dl_shcsq_wgs84_road_centerline_car_statistics',
    'VERSION':'1.1.0',
}
window.dlWmsDefaultOption = {
    url:window.config.dlWmsUrl+'geoserver/shanghai_qcc/wms',
    blend: true,
    tileSize: 256,
    params:{}
}