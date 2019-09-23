window.config = {
    //雄安 外网地址
    url: 'http://144.7.122.19:9093/monPlatApp/', //监控平台
    operateUrl: 'http://144.7.122.89:9090/operateApp/',	//运营平台
    websocketUrl:'ws://144.7.122.19:9982/mon',  //监控
    socketUrl:'ws://144.7.122.84:9999/ws',  //影子系统
    dlUrl: 'http://144.7.122.19:8085/', //迪路
    dlWmsUrl: 'http://144.7.122.19:8080/', //迪路 

    version: 1.0,       // 版本号
}
//地图额外配置项添加
window.mapOption = {
    mapStyleEmpty: "amap://styles/bc5a63d154ee0a5221a1ee7197607a00", // 纯灰色背景地图 路口
    defaultCenterPoint :  [115.912987, 39.049487],   // 雄安默认中心点 --- 高德坐标点
    centerPoint :  [115.912987, 39.049487],     // 数据概览 中心点位置(获取地理位置计算天气) --- 高德坐标点
    singlePoint:[115.912987, 39.049487],    // 单车监控 大地图中心点 --- 高德坐标点
};
window.defaultMapOption = {
	center: window.mapOption.defaultCenterPoint,
	zoom: 11,		// 默认：比例尺显示100m
	resizeEnable: true, //是否监控地图容器尺寸变化
	rotateEnable: true,
	mapStyle: "amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8"
};
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
    minX:0,
    minY:0,
    minZ:0,
    maxX:0,
    maxY:0,
    maxZ:0,
    background:"black"
};

window.defaultMapParam = {
    x:0,
    y:0,
    z:0,
    radius:0,
    pitch:0,
    yaw:0
}

window.circleParam = {
    redius:600.0,
    center:[0,0,0],
    color:"#ffffff",
    outline:false,
    outlineColor:"#ff0000",
    opacity:0.5,
    rotate:[0,0,0]
};
