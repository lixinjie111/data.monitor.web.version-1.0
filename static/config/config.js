window.config = {

    //望京 内网
    url: 'http://172.17.1.16:9093/monPlatApp/', //监控平台
    operateUrl: 'http://172.17.1.16:9090/operateApp/',	//运营平台
    websocketUrl:'ws://172.17.1.16:9982/mon',  //监控
    socketUrl:'ws://172.17.1.16:9999/ws',  //影子系统
    dlUrl: 'http://10.0.1.22:8085/', //迪路
    dlWmsUrl: 'http://10.0.1.22:8080/', //迪路

    //望京 外网
    // url: 'http://120.133.21.14:9093/monPlatApp/', //监控平台
    // operateUrl: 'http://120.133.21.14:9090/operateApp/',	//运营平台
    // websocketUrl:'ws://120.133.21.14:49982/mon',  //监控
    // socketUrl:'ws://120.133.21.14:49999/ws',  //影子系统
    // dlUrl: 'http://117.114.144.227:8085/', //迪路
    // dlWmsUrl: 'http://117.114.144.227:8080/', //迪路 

    //长沙 正式地址
    // url: 'http://218.76.44.22:9093/monPlatApp/', //监控平台
    // operateUrl: 'http://218.76.44.22:9090/operateApp/', //运营平台
    // websocketUrl:'ws://218.76.44.22:9982/mon',  //监控
    // socketUrl:'ws://218.76.44.22:9999/ws',  //影子系统
    // dlUrl: 'http://218.76.44.22:8085/', //迪路
    // dlWmsUrl: 'http://218.76.44.22:48080/', //迪路

    version: 1.0,       // 版本号
}
//地图额外配置项添加
window.mapOption = {
	// center: [121.551976, 31.276054],	//上海-高德地图坐标点
	// center: [113.07876,28.255618],	//长沙-高德地图坐标点
    mapStyleEmpty: "amap://styles/bc5a63d154ee0a5221a1ee7197607a00", // 纯灰色背景地图 路口
    defaultCenterPoint :  [121.262939,31.245149],   // 上海默认中心点 --- 高德坐标点
    centerPoint :  [121.17265957261286,31.284096076877844],     // 数据概览 中心点位置(获取地理位置计算天气) --- 高德坐标点
    singlePoint:[121.18653381418872,31.274421462567677],    // 单车监控 大地图中心点 --- 高德坐标点
};
window.defaultMapOption = {
	center: window.mapOption.defaultCenterPoint,
	zoom: 11,		// 默认：比例尺显示100m
	resizeEnable: true, //是否监控地图容器尺寸变化
	rotateEnable: true,
	mapStyle: "amap://styles/3312a5b0f7d3e828edc4b2f523ba76d8"
};

// 调用
// this.distanceMap = new AMap.Map('map-container', window.defaultMapOption);
// let _option = Object.assign(
// 	{},
// 	window.defaultMapOption,
// 	{
// 		mapStyle: window.mapOption.mapStyleEmpty
// 	}
// );
// this.distanceMap = new AMap.Map('map-container', _option);

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
//	调用
// let _optionWms = Object.assign(
// 	{},
// 	window.dlWmsDefaultOption,
// 	{
// 		params:{'LAYERS': window.dlWmsOption.LAYERS_centerline,'STYLES': window.dlWmsOption.STYLES, 'VERSION': window.dlWmsOption.VERSION}
// 	}
// );
// this.wms = new AMap.TileLayer.WMS(_optionWms);
// this.distanceMap.add(this.wms);

// 3D地图范围默认参数配置
window.mapParam={
    minX:325295.155400,
    minY:3461941.703700,
    minZ:50,
    maxX:326681.125700,
    maxY:3462723.022400,
    maxZ:80,
    background:"black"
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
    redius:600.0,
    center:[325535.061,3462402.816,13.618],
    color:"#ffffff",
    outline:false,
    outlineColor:"#ff0000",
    opacity:0.5,
    rotate:[0,0,0]
};
