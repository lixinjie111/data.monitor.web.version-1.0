window.config = {
    //长沙 测试地址
    // url: 'http://111.23.140.59:9093/monPlatApp/', //监控平台
    // operateUrl: 'http://111.23.140.59:9090/operateApp/', //运营平台
    // websocketUrl:'ws://111.23.140.59:9982/mon',  //监控
    // socketUrl:'ws://111.23.140.59:9999/ws',  //影子系统
    // dlUrl: 'http://218.76.44.22:8085/', //迪路
    // dlWmsUrl: 'http://218.76.44.22:48080/', //迪路

    //长沙 正式地址
    url: 'http://218.76.44.22:9093/monPlatApp/', //监控平台
    operateUrl: 'http://218.76.44.22:9090/operateApp/',	//运营平台
    websocketUrl:'ws://218.76.44.22:9982/mon',  //监控
    socketUrl:'ws://218.76.44.22:9999/ws',  //影子系统
    dlUrl: 'http://218.76.44.22:8085/', //迪路
    dlWmsUrl: 'http://218.76.44.22:48080/', //迪路

    version: 1.0,       // 版本号
}
//地图额外配置项添加
window.mapOption = {
    mapStyleEmpty: "amap://styles/3e9326410a47bb37df6cd0c4f74ea976", // 纯灰色背景地图 路口
    defaultCenterPoint :  [113.00739171981809,28.21220959243717],   // 长沙默认中心点 --- 高德坐标点
    centerPoint :  [113.00739171981809,28.21220959243717],     // 数据概览 中心点位置(获取地理位置计算天气) --- 高德坐标点
    singlePoint:[113.00739171981809,28.21220959243717],    // 单车监控 大地图中心点 --- 高德坐标点
};
window.defaultMapOption = {
	center: window.mapOption.defaultCenterPoint,
	zoom: 12,		// 默认：比例尺显示100m
	resizeEnable: true, //是否监控地图容器尺寸变化
	rotateEnable: true,
	mapStyle: "amap://styles/7a893466c58601035af135907c163385"
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
// 3D地图范围默认参数配置
window.mapParam={
    minX: 679567,
    minY: 3107616,
    minZ: 17657.736291098932,
    maxX: 708733,
    maxY: 3136008,
    maxZ: 17757.736291098932,
    background: "black"
};

window.defaultMapParam = {
    x:442456.0905737311,
    y:4427223.965503679,
    z:60.22107514430958,
    radius:31.40011218302981,
    pitch:-0.6747685185185206,
    yaw:-0.7853942219746017
}

window.circleParam = {
    redius:17000.0,
    center:[325535.061,3462402.816,13.618],
    color:"#ffffff",
    outline:false,
    outlineColor:"#ff0000",
    opacity:0.5,
    rotate:[0,0,0]
};
